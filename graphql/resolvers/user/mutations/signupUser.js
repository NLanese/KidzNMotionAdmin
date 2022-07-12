import prisma from "@utils/prismaDB";
import { UserInputError } from "apollo-server-errors";

export default {
  Mutation: {
    signUpUser: async (
      _,
      {
        // Required
        email,
        password,
        firstName,
        lastName,
        role,

        // Guardian required
        childFirstName,
        childLastName,
        childDateOfBirth
        
      },
      context
    ) => {
      try {
        if (context.user) throw new UserInputError("Already logged in");

        // Check for conflicting user
        let potentialUsers = await prisma.user.findMany({
          where: {
            email: email,
          },
          select: {
            email: true,
          },
        });

        let conflict = null;
        potentialUsers.map((userObject) => {
          if (userObject.email.toLowerCase() === email.toLowerCase()) {
            conflict = userObject;
          }
        });

        if (conflict) {
          throw new UserInputError("Email already exists.");
        }

        // Ensure that the role is not of a child
        if (role !== "GUARDIAN" && role !== "THERAPIST" && role !== "SCHOOL_ADMIN") {
            throw new UserInputError("Role does not exists.");
        }




      } catch (error) {
        throw new Error(error);
      }
    },
  },
};
