import prisma from "@utils/prismaDB";
import { UserInputError } from "apollo-server-errors";

export default {
  Mutation: {
    editUser: async (_, {
        email,
        firstName,
        lastName,
        phoneNumber,
        id
    }, context) => {
      if (!context.user) throw new UserInputError("Login required");

      // Check for conflicting user
      let user = await prisma.user.findUnique({
        where: {
          id: id,
        },
      });

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
