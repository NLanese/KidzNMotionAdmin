/* eslint-disable import/no-anonymous-default-export */
import prisma from "@utils/prismaDB";
import { UserInputError } from "apollo-server-errors";
import { getUserObject } from "@helpers/api/auth";

// Used to to to edit any users notitications settings
export default {
  Mutation: {
    changeUserNotifications: async (
      _,
      { userID, messagesMuted, assignMuted },
      context
    ) => {
      if (!context.user) throw new UserInputError("Login required");

      await prisma.user.update({
        where: {
          id: userID
        },
        data: {
          messagesMuted: messagesMuted,
          assignMuted: assignMuted,
        },
      });

      // Check the user status and then determine what fields we will allow
      let userObject = await getUserObject(context.user);

      return userObject;

      
    },
  },
};
