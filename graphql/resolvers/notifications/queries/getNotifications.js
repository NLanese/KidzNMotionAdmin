import prisma from "@utils/prismaDB";
import { UserInputError } from "apollo-server-errors";

export default {
  Query: {
    getNotifications: async (_, {}, context) => {
      if (!context.user) throw new UserInputError("Login required");

    
      let notifications = await prisma.notification.findMany({
        where: {
          toUserId: context.user.id,
          dismissed: false,
        },
        orderBy: [
          {
            createdAt: "desc",
          }
        ],
        select: {
          id: true,
          createdAt: true,
          title: true,
          description: true,
          type: true,
          toUserId: true,
          fromUserId: true,
        },
      });

      return notifications;
    },
  },
};
