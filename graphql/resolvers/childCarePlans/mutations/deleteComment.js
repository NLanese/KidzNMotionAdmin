/* eslint-disable import/no-anonymous-default-export */
import prisma from "@utils/prismaDB";
import { UserInputError } from "apollo-server-errors";

export default {
  Mutation: {
    deleteComment: async (_, { commentID }, context) => {
      if (!context.user) throw new UserInputError("Login required");

      if (context.user.role !== "THERAPIST")
        throw new UserInputError("Only therapists can edit child care plans");

      // Find the comment that we are tyring to delete
      let comment = await prisma.comment.findUnique({
        where: {
          id: commentID,
        },
        select: {
          id: true,
          therapist: {
            select: {
              id: true,
            },
          },
        },
      });

      // If they are not, then return user input error
      if (!comment) {
        throw new UserInputError("Child care plan does not exist");
      }

      if (!comment.therapist) {
        throw new UserInputError("Access denied");
      }
      
      // Only the therapist assigned to the child care plan can edit it
      if (comment.therapist.id !== context.user.id) {
        throw new UserInputError("Access denied");
      }

      // Remove all old jwt tokens
      await prisma.comment.deleteMany({
        where: {
          id: comment.id,
        },
      });

      return true;
    },
  },
};
