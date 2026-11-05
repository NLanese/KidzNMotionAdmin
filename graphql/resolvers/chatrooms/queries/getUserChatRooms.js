import prisma from "@utils/prismaDB";
import { UserInputError } from "apollo-server-errors";
import { messageTime } from "./messageTime";

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
              // createdAt is stored as text ("Thu Nov 05 2026 ..."), so the
              // database can't sort it by time. Load them and pick the newest below.
              messages: {
                select: {
                  createdAt: true,
                  content: true,
                  sentBy: true,
                  sentAt: true,
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

      // Each room comes back with only its newest message (for the preview).
      return chatRooms.chatRooms.map((room) => {
        const newest = [...room.messages].sort((a, b) => messageTime(b) - messageTime(a))[0];
        return { ...room, messages: newest ? [newest] : [] };
      });
    },
  },
};
