/* eslint-disable import/no-anonymous-default-export */
import prisma from "@utils/prismaDB";
import { UserInputError } from "apollo-server-errors";

// Used for a therpaist to claim an existing guardian / child account
export default {
  Mutation: {
    claimPatient: async (_, { patientUserID }, context) => {
      console.log(patientUserID)
      if (!context.user) throw new UserInputError("Login required");
      if (context.user.role !== "THERAPIST")
        throw new UserInputError(
          "Only therapists can edit notification settings"
        );

      // Make sure the child exists
      let childUser = await prisma.user.findUnique({
        where: {
          id: patientUserID,
        },
        select: {
          guardianId: true,
          id: true,
          role: true,
          guardian: {
            select: {
              id: true,
            },
          },
          organizations: {
            select: {
              organization: {
                select: {
                  id: true,
                },
              },
            },
          },
          childCarePlans: {
            select: {
              id: true,
              therapistId: true,
            },
          },
        },
      });

      let therapistUser = await prisma.user.findUnique({
        where: {
          id: context.user.id,
        },
        select: {
          guardianId: true,
          id: true,
          role: true,
          organizations: {
            select: {
              organization: {
                select: {
                  id: true,
                },
              },
            },
          },
          childCarePlans: {
            select: {
              id: true,
              therapistId: true,
            },
          },
        },
      });


      // If they are not, then return user input error
      if (!childUser) {
        throw new UserInputError("Child does not exist");
      }

      // Make sure it is a child
      if (childUser.role !== "CHILD") {
        throw new UserInputError("The user is not a child");
      }

      console.log(childUser)
      // Make sure they are apart of the same organization
      if (
        childUser.organizations &&
        childUser.organizations[0].organization.id !==
          therapistUser.organizations[0].organization.id
      ) {
        throw new UserInputError("The user is a child");
      }

      // If they already have a child care plan
      let existingChildCarePlanId = null;
      if (
        childUser.childCarePlans[0] &&
        childUser.childCarePlans[0].therapistId
      ) {
        existingChildCarePlanId = childUser.childCarePlans[0].id;
        if (childUser.childCarePlans[0].therapistId === context.user.id) {
          throw new UserInputError(
            "Therapist already has child care plan with user"
          );
        }
      }

      if (existingChildCarePlanId) {
        // If they don't already have a child care plan
        throw new UserInputError(
          "The child already has a child care plan"
        );
      } else {
        // Create the child care plan

        await prisma.childCarePlan.create({
          data: {
            child: {
              connect: {
                id: childUser.id,
              },
            },
            therapist: {
              connect: {
                id: context.user.id,
              },
            },
            level: parseInt(
             1
            ),
          },
        });

        // Create the chat rooms for child + guardian
        await prisma.chatroom.create({
          data: {
            users: {
              connect: [
                {
                  id: childUser.guardian.id,
                },
                {
                  id: context.user.id,
                },
              ],
            },
          },
        });
        await prisma.chatroom.create({
          data: {
            users: {
              connect: [
                {
                  id: context.user.id,
                },
                {
                  id: childUser.id,
                },
              ],
            },
          },
        });
      }

      return true;
    },
  },
};
