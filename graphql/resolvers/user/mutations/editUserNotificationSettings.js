/* eslint-disable import/no-anonymous-default-export */
import prisma from "@utils/prismaDB";
import { UserInputError } from "apollo-server-errors";
import { getUserObject } from "@helpers/api/auth";

// Used to to to edit any users notitications settings
export default {
  Mutation: {
    editUserNotificationSettings: async (
      _,
      { muteMessageNotifications, muteAssignmentNotifications },
      context
    ) => {
      if (!context.user) throw new UserInputError("Login required");

      await prisma.user.update({
        where: {
          id: context.user.id,
        },
        data: {
          muteAllMessages: muteMessageNotifications,
          muteAllAssignments: muteAssignmentNotifications,
        },
      });

      // Check the user status and then determine what fields we will allow
      let userObject = await getUserObject(context.user);

      return userObject;

      
    },
  },
};
