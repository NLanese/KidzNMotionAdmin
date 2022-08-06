/* eslint-disable import/no-anonymous-default-export */
import prisma from "@utils/prismaDB";
import { UserInputError } from "apollo-server-errors";
export default {
  Mutation: {
    editOrganizationSubscriptionStatus: async (_, { cancelled }, context) => {
      if (!context.user) throw new UserInputError("Login required");

      if (!context.user.ownedOrganization)
        throw new UserInputError("Owner Role required");

      await prisma.organization.update({
        where: {
          id: context.user.ownedOrganization.id,
        },
        data: {
          subscriptionStatus: cancelled ? "Cancelled" : "Active",
        },
      });
      return true;
    },
  },
};
