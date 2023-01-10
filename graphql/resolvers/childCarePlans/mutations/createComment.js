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
      // console.log(assignmentID)
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
              id: context.user.id,
            },
          },
          childCarePlan: {
            connect: {
              id: childCarePlanID,
            },
          },
        },
      });

      let updatedChildCarePlan = await prisma.childCarePlan.findUnique({
        where: {
          id: childCarePlanID,
        },
        select: {
          id: true,
          child: {
            select: {
              id: true,
              email: true,
              username: true,
              firstName: true,
              lastName: true,
              profilePic: true,
            },
          },
          level: true,
          active: true,
          allVideoStatus: true,
          weeklyVideoStatus: true,
          assignments: {
            select: {
              id: true,
              dateStart: true,
              dateDue: true,
              seen: true,
              title: true,
              description: true,
              videos: {
                select: {
                  id: true,
                  contentfulID: true,
                  completed: true,
                  medals: {
                    select: {
                      id: true,
                      title: true,
                      image: true,
                      description: true,
                      createdAt: true,
                      level: true,
                    },
                  },
                },
              },
            },
          },
          comments: {
            select: {
              id: true,
              content: true,
              createdAt: true,
              videoId: true,
            },
          },
        },
      });

      return updatedChildCarePlan;
    },
  },
};
