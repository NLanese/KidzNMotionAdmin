/* eslint-disable import/no-anonymous-default-export */
import prisma from "@utils/prismaDB";
import { UserInputError } from "apollo-server-errors";
export default {
  Mutation: {
    dismissNotification: async (_, { notificationID }, context) => {
      if (!context.user) throw new UserInputError("Login required");

      await prisma.notification.update({
        where: {
          id: notificationID,
        },
        data: {
          dismissed: true,
        },
      });

      return true;
    },
  },
};
