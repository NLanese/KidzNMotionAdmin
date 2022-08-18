/* eslint-disable import/no-anonymous-default-export */
import prisma from "@utils/prismaDB";
import { UserInputError } from "apollo-server-errors";

export default {
  Mutation: {
    editChildCarePlan: async (
      _,
      { childCarePlanID, level, newAssignedTherapistID, blockedVideos },
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

      // Create the update data object
      let updateObject = {};
      if (level) {
        updateObject.level = level;
      }
      if (newAssignedTherapistID) {
        // If we are trying to assign a new therapist, check to make sure it is a valid Therapist ID
        let newTherapist = await prisma.user.findUnique({
          where: {
            id: newAssignedTherapistID,
          },
          select: {
            id: true,
            role: true,
          },
        });
        if (!newTherapist) {
          throw new UserInputError(" Therapist does not exist");
        }
        if (newTherapist.role !== "THERAPIST") {
          throw new UserInputError(
            " User is not a therapist and cannot be assigned"
          );
        }

        updateObject.therapist = { connect: { id: newAssignedTherapistID } };
      }

      if (blockedVideos) {
        if (!blockedVideos.ids) {
          throw new UserInputError(
            " blockedVideos should be formated like {ids: ['VIDEO_ID', 'VIDEO_ID']}"
          );
        }
        updateObject.blockedVideos = JSON.parse((JSON.stringify(blockedVideos)))
      }

      // Update the child care plan
      let updatedChildCarePlan = await prisma.childCarePlan.update({
        where: {
          id: childCarePlan.id,
        },
        data: updateObject,
      });

      return updatedChildCarePlan;
    },
  },
};
