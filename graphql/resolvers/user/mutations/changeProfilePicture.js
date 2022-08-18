/* eslint-disable import/no-anonymous-default-export */
import prisma from "@utils/prismaDB";
import { UserInputError } from "apollo-server-errors";
import { getUserObject } from "@helpers/api/auth";

export default {
  Mutation: {
    changeProfilePicture: async (_, { profilePic }, context) => {
      if (!context.user) throw new UserInputError("Login required");

      // Parse and stringigy the profile pic JSON
      profilePic = JSON.stringify(profilePic);
      profilePic = JSON.parse(profilePic);

      console.log("hit")

      // Update the user with the json object for the profile pic
      await prisma.user.update({
        where: {
          id: context.user.id,
        },
        data: {
          profilePic: profilePic,
        },
      }).catch(error => console.log(error))

      // Get the new user object
      let userObject = await getUserObject(context.user);

      return userObject;
    },
  },
};
