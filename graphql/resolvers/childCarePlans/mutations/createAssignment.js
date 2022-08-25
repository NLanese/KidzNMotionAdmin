/* eslint-disable import/no-anonymous-default-export */
import prisma from "@utils/prismaDB";
import { UserInputError } from "apollo-server-errors";
import VIDEOS from "@constants/videos";

export default {
  Mutation: {
    createAssignment: async (
      _,
      { childCarePlanID, dateStart, dateDue, title, description, videoIDs },
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

      // Check all the videos passed to make sure they are valid video contentful ids
      let videoValid = true;

      videoIDs.map((videoID) => {
        if (!VIDEOS[videoID]) {
          videoValid = false;
        }
      });

      if (!videoValid) {
        throw new UserInputError(
          "One of your video ids is not a valid contentful ID"
        );
      }

      let newAssignment = await prisma.assignment.create({
        data: {
          dateStart: dateStart,
          dateDue: dateDue,
          title: title,
          description: description,
          childCarePlan: {
            connect: {
              id: childCarePlanID,
            },
          },
        },
      });

      for (var i = 0; i < videoIDs.length; i++) {
        let videoID = videoIDs[i];
        await prisma.video.create({
          data: {
            contentfulID: videoID,
            title: VIDEOS[videoID].title,
            description: "",
            level: VIDEOS[videoID].level,
            assignments: {
              connect: {
                id: newAssignment.id,
              },
            },
          },
        });
      }

      return true;
    },
  },
};
