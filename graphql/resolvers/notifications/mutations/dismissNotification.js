/* eslint-disable import/no-anonymous-default-export */
import prisma from "@utils/prismaDB";
import { UserInputError } from "apollo-server-errors";
export default {
  Mutation: {
    dismissNotification: async (_, { notificationID }, context) => {
      if (!context.user) throw new UserInputError("Login required");

      // Before: any signed-in user could dismiss anyone's notification by id.
      const notification = await prisma.notification.findUnique({
        where: { id: notificationID },
        select: { toUserId: true },
      });
      if (!notification || notification.toUserId !== context.user.id) {
        throw new UserInputError("Notification not found");
      }
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
