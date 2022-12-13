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
      if (!context.user) throw new UserInputError("Login required");

      await createNotification(
        title,
        description,
        type,
        toUserId,
        context.user.id
      );

      return true;
    },
  },
};
