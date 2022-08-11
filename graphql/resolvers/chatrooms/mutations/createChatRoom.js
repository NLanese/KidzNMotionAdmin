/* eslint-disable import/no-anonymous-default-export */
import prisma from "@utils/prismaDB";
import { UserInputError } from "apollo-server-errors";

export default {
  Mutation: {
    createChatRoom: async (_, { otherParticipantID }, context) => {
      if (!context.user) throw new UserInputError("Login required");


      if (otherParticipantID === context.user.id) {
        throw new UserInputError("The other user cannot be yourself");
      }

      // Find the other user account via the particant id
      let otherParticipant = await prisma.user.findUnique({
        where: {
          id: otherParticipantID,
        },
        select: {
          id: true,
        },
      });

      if (!otherParticipant) {
        throw new UserInputError("Other user does not exist");
      }

      // Create the chat room
      let newChatRoom = await prisma.chatroom.create({
        data: {
          users: {
            connect: [
              {
                id: context.user.id,
              },
              {
                id: otherParticipantID,
              },
            ],
          },
        },
      });

      // Send the final chat room object in response
      return newChatRoom.id;
    },
  },
};
