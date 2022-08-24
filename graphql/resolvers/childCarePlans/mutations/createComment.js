/* eslint-disable import/no-anonymous-default-export */
import prisma from "@utils/prismaDB";
import { UserInputError } from "apollo-server-errors";

export default {
  Mutation: {
    createComment: async (
      _,
      { commentContent, videoID, assignmentID, childCarePlanID },
      context
    ) => {
      if (!context.user) throw new UserInputError("Login required");

      if (context.user.role !== "THERAPIST")
        throw new UserInputError("Only therapists can edit child care plans");

      // Find the child care plan that we are tyring to edot
      let childCarePlan = await prisma.childCarePlan.findUnique({
        where: {
          id: childCarePlanID,
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
      if (!childCarePlan) {
        throw new UserInputError("Child care plan does not exist");
      }

      // Only the therapist assigned to the child care plan can edit it
      if (childCarePlan.therapist.id !== context.user.id) {
        throw new UserInputError("Access denied");
      }

      await prisma.comment.create({
        data: {
          content: commentContent,
          videoId: videoID,
          assignmentId: assignmentID,
          therapist: {
              connect: {
                  id: context.user.id
              }
          },
          childCarePlan: {
            connect: {
              id: childCarePlanID,
            },
          },
        },
      })

      let updatedChildCarePlan = await prisma.childCarePlan.findUnique({
        where: {
          id: childCarePlanID,
        }
      });

      return updatedChildCarePlan;
    },
  },
};
