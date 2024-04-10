import prisma from "@utils/prismaDB";
import { UserInputError } from "apollo-server-errors";

export default {
  Query: {
    getMeetings: async (_, {}, context) => {

      // Login Check
      if (!context.user) throw new UserInputError("Login required");

      // Get user meetings
      const user = await prisma.user.findUnique({
        where: {
          id: context.user.id,
        },
        include: {
          meetings: {
            orderBy: {
              meetingDateTime: 'asc',
            },
            where: {
              completed: false,
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
              meetingOwnerID: true,
              users: {
                select: {
                  id: true,
                  firstName: true,
                  lastName: true,
                  role: true,
                  profilePic: true
                }
              },
            }
          },
        },
      });

      // Return only the meetings
      return user.meetings;
    },
  },
};
