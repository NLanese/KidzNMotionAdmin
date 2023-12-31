/* eslint-disable import/no-anonymous-default-export */
import prisma from "@utils/prismaDB";
import { UserInputError } from "apollo-server-errors";
import pusherServer from "@utils/pusherServer";
import { createNotification } from "@helpers/api/notifications";

export default {
  Mutation: {
    sendMessage: async (_, { content, chatRoomID }, context) => {
      if (!context.user) throw new UserInputError("Login required");

      ///////////////////////
      // Gets the Chatroom //
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
      if (!chatRoom) {
        throw new UserInputError("Chat room does not exist");
      }

      /////////////////////////
      // Valid Chat ID Check //
      let inChatRoom = false;
      let otherUserIds = [];
      chatRoom.users.map((userObject) => {
        if (userObject.id === context.user.id) {
          inChatRoom = true;
        } else {
          otherUserIds.push(userObject.id);
        }
      });
      if (!inChatRoom) {
        throw new UserInputError(
          "You have to be in chat room to send a message"
        );
      }

      ///////////////////////////////////////////////////
      // Creates the Message and Connections in PRISMA //
      await prisma.message.create({
        data: {
          content: content,
          sentBy: {
            userID: context.user.id,
            firstName: context.user.firstName,
            lastName: context.user.lastName,
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


      for (var i = 0; i < otherUserIds.length; i++) {
        console.log("In sendMessage, sending notification...")
        await createNotification(
          "New Message From " + context.user.firstName,
          content,
          "MESSAGE",
          otherUserIds[i],
          context.user.id
        );
      }

      // Send out the pusher trigger
      pusherServer.trigger(chatRoomID.toString(), "new-message", {
        message: "new-message",
      });

      return true;
    },
  },
};
