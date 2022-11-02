/* eslint-disable import/no-anonymous-default-export */
import prisma from "@utils/prismaDB";
import { UserInputError } from "apollo-server-errors";

export default {
  Mutation: {
    updatePhoneToken: async (_, { token }, context) => {
      if (!context.user) throw new UserInputError("Login required");

      await prisma.user.update({
        where: {
          id: context.user.id,
        },
        data: {
          fcmToken: token,
        },
      });

      return true;
    },
  },
};
