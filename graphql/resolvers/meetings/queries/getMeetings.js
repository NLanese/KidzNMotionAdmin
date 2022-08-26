import prisma from "@utils/prismaDB";
import { UserInputError } from "apollo-server-errors";

export default {
  Query: {
    getMeetings: async (_, {}, context) => {
      if (!context.user) throw new UserInputError("Login required");

      // Get all user meetings
      let user = await prisma.user.findUnique({
        where: {
          id: context.user.id,
        },
        select: {
          meetings: {
            where: {
              canceled: false,
            },
            select: {
              id: true,
              createdAt: true,
              meetingDateTime: true,
              title: true,
              completed: true,
              canceled: true,
              type: true,
              pendingApproval: true,
              approved: true,
              users: true,
              meetingOwnerID: true,
            }
          }
        },
      });

      return user.meetings;
    },
  },
};