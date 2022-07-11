import prisma from "@utils/prismaDB";
import { UserInputError } from "apollo-server-errors";

export default {
  Mutation: {
    logoutUser: async (_, { }, context) => {
      try {
        if (!context.user) throw new UserInputError("Login required");
        
        await prisma.jWTToken.deleteMany({
          where: {
            userId: context.user.userId,
          },
        });

        return "Success"

      } catch (error) {
        
        throw new Error(error);
      }
    },
  },
};
