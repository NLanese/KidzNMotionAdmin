/* eslint-disable import/no-anonymous-default-export */
import prisma from "@utils/prismaDB";
import { UserInputError } from "apollo-server-errors";
import { getUserObject } from "@helpers/api/auth";

export default {
  Mutation: {
    changeProfilePicture: async (_, { profilePic }, context) => {
      if (!context.user) throw new UserInputError("Login required");
    
      profilePic = JSON.stringify(profilePic)
      profilePic = JSON.parse(profilePic)
      
      await prisma.user.update({
        where: {
          id: context.user.id,
        },
        data: {
          profilePic: profilePic,
        },
      });

        let userObject = await getUserObject(context.user);

        return userObject; 
    },
  },
};
