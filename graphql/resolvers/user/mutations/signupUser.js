import prisma from "@utils/prismaDB";
import { UserInputError } from "apollo-server-errors";

export default {
  Mutation: {
    signUpUser: async (_, { }, context) => {
      try {
        if (context.user) throw new UserInputError("Already logged in");
        
       

      } catch (error) {
        
        throw new Error(error);
      }
    },
  },
};
