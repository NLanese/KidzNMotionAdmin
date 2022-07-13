import prisma from "@utils/prismaDB";
import { UserInputError } from "apollo-server-errors";

export default {
  Query: {
    getChatFromId: async (_, { id }, context) => {

      if (!context.user) throw new UserInputError("Login required");

      let chatRooms = await prisma.user.findUnique({
        where: {
          id: context.user.id,
        },
        select: {
          chatRooms: {
            where: {
              active: true,
              id: id, // query the user chats by the param ID
            },
            select: {
              id: true,
              messages: {
                select: {
                  createdAt: true,
                  content: true,
                  sentAt: true,
                  sentBy: true,
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

      return chatRooms.chatRooms[0];
    },
  },
};
