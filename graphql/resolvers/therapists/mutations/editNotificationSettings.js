/* eslint-disable import/no-anonymous-default-export */
import prisma from "@utils/prismaDB";
import { UserInputError } from "apollo-server-errors";

// Used to to to edit the pateitn notification settings from the Thereapist
export default {
  Mutation: {
    editNotificationSettings: async (
      _,
      { patientUserID, muteMessageNotifications, muteAssignmentNotifications },
      context
    ) => {
      if (!context.user) throw new UserInputError("Login required");
      if (context.user.role !== "THERAPIST")
        throw new UserInputError(
          "Only therapists can edit notification settings"
        );

      // If not patiet userID is present, this will only edit the Therapist settings globally
      if (!patientUserID) {
        await prisma.user.update({
          where: {
            id: context.user.id,
          },
          data: {
            muteAllMessages: muteMessageNotifications,
            muteAllAssignments: muteAssignmentNotifications,
          },
        });
      } else {
        // Find the child object to determine if the are under the patient account
        let childUser = await prisma.user.findUnique({
          where: {
            id: patientUserID,
          },
          select: {
            childCarePlans: {
                select: {
                    therapistId: true
                }
            },
            id: true,
          },
        });

        // If they are not, then return user input error
        if (!childUser) {
          throw new UserInputError("Child does not exist");
        }

        let childIsUnderTherapistCare = false;

        childUser.childCarePlans.map((carePlan) => {
            if (carePlan.therapistId === context.user.id) {
                childIsUnderTherapistCare = true;
            }
        })
        // If they therapist does not have acess to the user then return error
        if (!childIsUnderTherapistCare) {
          throw new UserInputError("You do not have access to this child");
        }

        // Update the child object
        await prisma.user.update({
          where: {
            id: patientUserID,
          },

          data: {
            assignMuted: muteAssignmentNotifications,
            messagesMuted: muteMessageNotifications,
          },
        });
      }

      return true;
    },
  },
};
