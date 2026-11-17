/* eslint-disable import/no-anonymous-default-export */
import prisma from "@utils/prismaDB";
import { UserInputError } from "apollo-server-errors";

// Saves this phone's push token for the signed-in account.
// A phone gets pushes for one account at a time (whoever is signed in), so
// the token is taken off any other account first. Sending "" turns pushes
// off for this account on this phone (used when signing out).
export default {
  Mutation: {
    updatePhoneToken: async (_, { token }, context) => {
      if (!context.user) throw new UserInputError("Login required");
      const value = String(token || "").trim();

      if (value) {
        await prisma.user.updateMany({
          where: { fcmToken: value, NOT: { id: context.user.id } },
          data: { fcmToken: null },
        });
      }
      await prisma.user.update({
        where: { id: context.user.id },
        data: { fcmToken: value || null },
      });
      return true;
    },
  },
};
