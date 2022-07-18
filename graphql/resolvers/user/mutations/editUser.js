import prisma from "@utils/prismaDB";
import { UserInputError } from "apollo-server-errors";

export default {
  Mutation: {
    editUser: async (_, {
        email,
        firstName,
        lastName,
        phoneNumber
    }, context) => {
      if (!context.user) throw new UserInputError("Login required");

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
          if (userObject.email !== context.user.email) {
            conflict = userObject;
          }
        }
      });

      if (conflict) {
        throw new UserInputError("Email already exists.");
      }

      await prisma.user.update({
        where: {
          id: context.user.id,
        },
        data: {
          firstName: firstName,
          lastName: lastName,
          email: email,
          phoneNumber: phoneNumber,
        },
      });


    },
  },
};
