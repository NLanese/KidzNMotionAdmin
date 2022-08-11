/* eslint-disable import/no-anonymous-default-export */
import prisma from "@utils/prismaDB";
import { UserInputError } from "apollo-server-errors";

export default {
  Mutation: {
    sendMessage: async (_, { content, chatRoomID }, context) => {
      if (!context.user) throw new UserInputError("Login required");

      // Get the chat room 
      let chatRoom = await prisma.chatroom.findUnique({
        where: {
          id: chatRoomID,
        },
        select: {
          users: {
            select: {
              id: true,
            },
          },
        },
      });

      // If not chat room exists, throw an error
      if (!chatRoom) {
        throw new UserInputError("Chat room does not exist");
      }

      // Create the message and assign to the chatroom
      await prisma.message.create({
        data: {
          content: content,
          sentBy: {
            userID: context.user.id,
          },
          createdAt: new Date().toString(),
          sentAt: {
            timeStamp: new Date().toString(),
          },
          chatRoom: {
            connect: {
              id: chatRoomID,
            },
          },
        },
      });

      return true;
    },
  },
};
