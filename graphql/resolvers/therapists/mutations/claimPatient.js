/* eslint-disable import/no-anonymous-default-export */
import prisma from "@utils/prismaDB";
import { UserInputError } from "apollo-server-errors";

const orgIds = (user) =>
  (user && user.organizations ? user.organizations : [])
    .map((o) => o.organization && o.organization.id)
    .filter(Boolean);

// Makes sure the therapist and the patient share a chat room.
async function ensureChatRoom(therapistId, otherUserId) {
  if (!otherUserId) return;
  const existing = await prisma.chatroom.findFirst({
    where: {
      AND: [{ users: { some: { id: therapistId } } }, { users: { some: { id: otherUserId } } }],
    },
    select: { id: true },
  });
  if (existing) return;
  await prisma.chatroom.create({
    data: { users: { connect: [{ id: therapistId }, { id: otherUserId }] } },
  });
}

// A therapist takes on a child in their organization who has no therapist.
// If the child already has a care plan without a therapist (for example,
// their last therapist removed them), that plan is reused so their medals,
// assignments and notes carry over.
export default {
  Mutation: {
    claimPatient: async (_, { patientUserID }, context) => {
      if (!context.user) throw new UserInputError("Login required");
      if (context.user.role !== "THERAPIST")
        throw new UserInputError("Only therapists can take on clients");

      const orgSelect = {
        where: { active: true },
        select: { organization: { select: { id: true } } },
      };

      const childUser = await prisma.user.findUnique({
        where: { id: patientUserID },
        select: {
          id: true,
          role: true,
          guardianId: true,
          organizations: orgSelect,
          guardian: { select: { id: true, organizations: orgSelect } },
          childCarePlans: { select: { id: true, therapistId: true, active: true } },
        },
      });
      if (!childUser) throw new UserInputError("Child does not exist");
      if (childUser.role !== "CHILD") throw new UserInputError("The user is not a child");

      const therapist = await prisma.user.findUnique({
        where: { id: context.user.id },
        select: { organizations: orgSelect },
      });

      // The child or their parent must be in one of the therapist's organizations.
      const mine = new Set(orgIds(therapist));
      const theirs = [...orgIds(childUser), ...orgIds(childUser.guardian)];
      if (!theirs.some((id) => mine.has(id))) {
        throw new UserInputError("This child isn't in your organization");
      }

      const plans = childUser.childCarePlans || [];
      if (plans.some((p) => p.therapistId === context.user.id && p.active !== false)) {
        throw new UserInputError("This child is already your client");
      }
      if (plans.some((p) => p.therapistId && p.active !== false)) {
        throw new UserInputError("This child already has a therapist");
      }

      const reusable = plans.find((p) => !p.therapistId && p.active !== false) || plans.find((p) => !p.therapistId);
      if (reusable) {
        await prisma.childCarePlan.update({
          where: { id: reusable.id },
          data: { therapist: { connect: { id: context.user.id } }, active: true },
        });
      } else {
        await prisma.childCarePlan.create({
          data: {
            child: { connect: { id: childUser.id } },
            therapist: { connect: { id: context.user.id } },
            level: 1,
          },
        });
      }

      await ensureChatRoom(context.user.id, childUser.guardianId);
      await ensureChatRoom(context.user.id, childUser.id);
      return true;
    },
  },
};
