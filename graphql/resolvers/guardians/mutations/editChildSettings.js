import prisma from "@utils/prismaDB";
import { UserInputError } from "apollo-server-errors";

export default {
  Mutation: {
    editChildSettings: async (
      _,
      { childUserID, leaveApp, accessMessages, accessSettings },
      context
    ) => {
      if (!context.user) throw new UserInputError("Login required");
      console.log(context.user.role)
      if (context.user.role !== "GUARDIAN") throw new UserInputError("Only guardians can edit child settings");
      
      // Find the child object to determine if the are under the guardian account
      let childUser = await prisma.user.findUnique({
        where: {
          id: childUserID,
        },
        select: {
          guardianId: true,
          id: true,
        },
      });

      // If they are not, then return user input error
      if (!childUser) {
        throw new UserInputError("Child does not exist");
      }

      // If they guardian does not have acess to the user then return error
      if (childUser.guardianId != context.user.id) {
        throw new UserInputError("You do not have access to this child");
      }

      // Update the child object
      await prisma.user.update({
        where: {
            id: childUserID,
        },

        data: {
          leaveApp: leaveApp,
          accessMessages: accessMessages,
          accessSettings: accessSettings
        },
      });

      return true;
    },
  },
};
