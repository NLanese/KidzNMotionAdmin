/* eslint-disable import/no-anonymous-default-export */
import prisma from "@utils/prismaDB";
import { UserInputError } from "apollo-server-errors";

export default {
  Mutation: {
    toggleAssignmentSeen: async (_, { assignmentID, hasSeen }, context) => {
      if (!context.user) throw new UserInputError("Login required");

      if (context.user.role !== "THERAPIST" && context.user.role !== "CHILD")
        throw new UserInputError(
          "Only therapists or children can toggle assignment seen"
        );

      // Find the assignment that we are tyring to toggle as see
      let assignment = await prisma.assignment.findUnique({
        where: {
          id: assignmentID,
        },
        select: {
          id: true,
        },
      });

      // If they are not, then return user input error
      if (!assignment) {
        throw new UserInputError("Assignment does not exist");
      }

      // Update the assignment
      let updatedAssignment = await prisma.assignment.update({
        where: {
          id: assignment.id,
        },
        data: {
          seen: hasSeen,
        },
      });

      return updatedAssignment;
    },
  },
};
