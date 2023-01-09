/* eslint-disable import/no-anonymous-default-export */
import prisma from "@utils/prismaDB";
import { UserInputError } from "apollo-server-errors";

// Used for a therpaist to claim an existing guardian / child account
export default {
  Mutation: {
    deletePatient: async (_, { patientUserID }, context) => {
      // console.log(patientUserID)
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

      // console.log(childUser)
      // Make sure they are apart of the same organization
      if (
        childUser.organizations &&
        childUser.organizations[0].organization.id !==
          therapistUser.organizations[0].organization.id
      ) {
        throw new UserInputError("The user is a child");
      }

      await prisma.organizationUser.deleteMany({
        where: {
          userId: patientUserID,
        },
      });

      await prisma.organizationUser.deleteMany({
        where: {
          userId: childUser.guardianId,
        },
      });

      await prisma.childCarePlan.deleteMany({
        where: {
          childId: patientUserID,
        },
      });

      // Delete pateitn
      await prisma.user.delete({
        where: {
          id: patientUserID,
        },
      });

      await prisma.user.delete({
        where: {
          id: childUser.guardianId,
        },
      });

      return true;
    },
  },
};
