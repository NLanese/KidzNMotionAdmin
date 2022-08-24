/* eslint-disable import/no-anonymous-default-export */
import prisma from "@utils/prismaDB";
import { UserInputError } from "apollo-server-errors";

export default {
  Mutation: {
    editColorSettings: async (_, { colorSettings }, context) => {
      if (!context.user) throw new UserInputError("Login required");

      await prisma.user.update({
        where: {
          id: context.user.id,
        },
        data: {
          colorSettings: colorSettings,
        },
      });

      return true;
    },
  },
};
