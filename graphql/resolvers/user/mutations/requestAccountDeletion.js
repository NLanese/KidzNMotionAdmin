/* eslint-disable import/no-anonymous-default-export */
import prisma from "@utils/prismaDB";
import { UserInputError } from "apollo-server-errors";

export default {
  Mutation: {
    requestAccountDeletion: async (_, { userId }, context) => {
      return true;
    },
  },
};
