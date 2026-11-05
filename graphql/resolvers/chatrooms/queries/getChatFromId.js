import prisma from "@utils/prismaDB";
import { UserInputError } from "apollo-server-errors";
import { messageTime } from "./messageTime";

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
                orderBy: {
                  createdAt: "asc",
                },
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

      const room = chatRooms.chatRooms[0];
      if (!room) return room;
      // The database sorted createdAt as text (so by weekday name); sort by real time.
      return { ...room, messages: [...room.messages].sort((a, b) => messageTime(a) - messageTime(b)) };
    },
  },
};
