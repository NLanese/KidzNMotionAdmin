/* eslint-disable import/no-anonymous-default-export */
import prisma from "@utils/prismaDB";
import { UserInputError } from "apollo-server-errors";

import { createNotification } from "@helpers/api/notifications";

export default {
  Mutation: {
    createUserToUserNotification: async (
      _,
      { title, description, type, toUserId },
      context
    ) => {

      console.log("=-=-=-=-=\n=-=-=-=-=-=Made it inside CREATE_USER_TO_USER_NOTIFICATION")

      if (!context.user) throw new UserInputError("Login required");
      

      console.log("Finding Assignment")
      let assignment;
      if (type) {
        // Find the assignment that we are tyring to toggle as see
        assignment = await prisma.assignment.findUnique({
          where: {
            id: type,
          },
          select: {
            notificationSent: true,
          },
        });
      }
    

      // Notification Already Sent for This Assignment
      if (assignment && assignment.notificationSent){
        return
      }

      console.log("Creating Notification")

      await createNotification(
        title,
        description,
        type,
        toUserId,
        context.user.id
      );

      console.log("Notification Sent")

      // Updates Assignment if notification is sent
      if (assignment && !assignment.notificationSent)
        await prisma.assignment.update({
          where: {
            id: type,
          },
          data: {
            notificationSent: true,
          },
        });

        console.log("Assignment Updated")

      return true;
    },
  },
};
