/* eslint-disable import/no-anonymous-default-export */
import prisma from "@utils/prismaDB";
import { UserInputError } from "apollo-server-errors";

var CryptoJS = require("crypto-js");

// Lets a signed-in user permanently delete their own account (required by the
// App Store and Google Play). A parent's children are deleted with them.
//
// The database uses Prisma's relationMode = "prisma", so nothing cascades on
// its own: every record pointing at these users is removed or unlinked here,
// inside one transaction, so a failure leaves nothing half-deleted.
//
// The older super-user tool (requestAccountDeletion) is unchanged.

export default {
  Mutation: {
    deleteMyAccount: async (_, { password }, context) => {
      if (!context.user) throw new UserInputError("Login required");

      const me = await prisma.user.findUnique({
        where: { id: context.user.id },
        select: {
          id: true,
          role: true,
          password: true,
          children: { select: { id: true } },
          ownedOrganization: { select: { id: true } },
        },
      });
      if (!me) throw new UserInputError("Account not found.");

      // Confirm it's really them.
      const decrypted = CryptoJS.AES.decrypt(me.password, process.env.PASSWORD_SECRET_KEY).toString(CryptoJS.enc.Utf8);
      if (!password || decrypted !== password) {
        throw new UserInputError("That password is incorrect.");
      }

      if (me.role === "CHILD") {
        throw new UserInputError("A parent needs to delete this account from their own Settings.");
      }

      // An organization owner can't strand their staff and families.
      if (me.ownedOrganization) {
        const others = await prisma.organizationUser.count({
          where: { organizationId: me.ownedOrganization.id, NOT: { userId: me.id } },
        });
        if (others > 0) {
          throw new UserInputError(
            "Your organization still has other members. Remove them, or contact support, before deleting your account."
          );
        }
      }

      const userIds = [me.id, ...me.children.map((c) => c.id)];

      await prisma.$transaction(async (tx) => {
        // Care plans belonging to these children, and everything hanging off them.
        const plans = await tx.childCarePlan.findMany({
          where: { childId: { in: userIds } },
          select: { id: true },
        });
        const planIds = plans.map((p) => p.id);
        if (planIds.length > 0) {
          // Each assignment has its own video records (they hold "completed").
          const assignmentVideos = await tx.video.findMany({
            where: { assignments: { some: { childCarePlanId: { in: planIds } } } },
            select: { id: true },
          });
          await tx.medal.deleteMany({ where: { childCarePlanId: { in: planIds } } });
          await tx.comment.deleteMany({ where: { childCarePlanId: { in: planIds } } });
          for (const v of assignmentVideos) {
            await tx.video.update({ where: { id: v.id }, data: { assignments: { set: [] }, users: { set: [] } } });
          }
          await tx.video.deleteMany({ where: { id: { in: assignmentVideos.map((v) => v.id) } } });
          await tx.assignment.deleteMany({ where: { childCarePlanId: { in: planIds } } });
          await tx.childCarePlan.deleteMany({ where: { id: { in: planIds } } });
        }

        // Therapists: keep their clients' care plans and comments, just unlink them.
        await tx.childCarePlan.updateMany({ where: { therapistId: me.id }, data: { therapistId: null } });
        await tx.comment.updateMany({ where: { therapistId: me.id }, data: { therapistId: null } });

        // Their own (now empty) organization.
        if (me.ownedOrganization) {
          await tx.organizationInviteKey.deleteMany({ where: { organizationId: me.ownedOrganization.id } });
          await tx.organizationUser.deleteMany({ where: { organizationId: me.ownedOrganization.id } });
          await tx.organization.delete({ where: { id: me.ownedOrganization.id } });
        }

        // Records that point at the users directly.
        await tx.organizationUser.deleteMany({ where: { userId: { in: userIds } } });
        await tx.organizationInviteKey.deleteMany({ where: { userId: { in: userIds } } });
        await tx.jWTToken.deleteMany({ where: { userId: { in: userIds } } });
        await tx.loginAttempts.deleteMany({ where: { userId: { in: userIds } } });
        await tx.passwordResetKey.deleteMany({ where: { userId: { in: userIds } } });
        await tx.notification.deleteMany({ where: { toUserId: { in: userIds } } });

        // Leave shared meetings, chats and videos (removes only the link).
        for (const id of userIds) {
          await tx.user.update({
            where: { id },
            data: { meetings: { set: [] }, chatRooms: { set: [] }, videos: { set: [] } },
          });
        }

        // Children first: they point at the parent through guardianId.
        const childIds = userIds.filter((id) => id !== me.id);
        if (childIds.length > 0) await tx.user.deleteMany({ where: { id: { in: childIds } } });
        await tx.user.delete({ where: { id: me.id } });
      }, { timeout: 20000 });

      return true;
    },
  },
};
