import prisma from "@utils/prismaDB";
import { UserInputError } from "apollo-server-errors";

export default {
  Query: {
    getUserChatRooms: async (_, {}, context) => {
      if (!context.user) throw new UserInputError("Login required");

      // Check the user status and then determine what fields we will allow
      let chatRooms = await prisma.user.findUnique({
        where: {
          id: context.user.id,
        },
        select: {
          chatRooms: {
            where: {
              active: true,
            },
            select: {
              id: true,
              messages: {
                take: 1,
                orderBy: {
                  createdAt: "asc",
                },
                select: {
                  createdAt: true,
                },
              },
              users: {
                select: {
                  firstName: true,
                  lastName: true,
                  role: true,
                  id: true,
                },
              },
            },
          },
        },
      });

      return chatRooms.chatRooms;
    },
  },
};
