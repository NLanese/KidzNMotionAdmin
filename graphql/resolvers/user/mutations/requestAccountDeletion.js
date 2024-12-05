/* eslint-disable import/no-anonymous-default-export */
import prisma from "@utils/prismaDB";
import { UserInputError } from "apollo-server-errors";

export default {
  Mutation: {
    requestAccountDeletion: async (_, { userId, superUserKey }, context) => {


      //////////////
      // Security // 
      if (!context.user){
        throw new UserInputError("Login required");
      }
      if ( context.user.email.toLowerCase() !== "nlanese21@gmail.com" &&  context.user.email.toLowerCase() !== "ostrichdeveloper@gmail.com" ){
        throw new UserInputError("Acccess Denied! Super class actions are restricted to Super Users only.")
      }
      if (superUserKey !== `${process.env.SUPER_USER_SECRET_KEY}`){
        throw new UserInputError("Acccess Denied! Super Key was incorrect -- ", superUserKey)
      }


      // Make sure the user exists
      let user = await prisma.user.findUnique({
        where: {
          id: userId ? userId : context.user.id,
        },
        select: {
          id: true,
          role: true,
          guardianId: true,
          children: {
            select: {
              id: true,
            },
          },
        },
      });

      let usersToPurge = [userId ? userId : context.user.id];

      if (user.guardianId) {
        usersToPurge.push(user.guardianId);
      }

      if (user.children.length > 0) {
        usersToPurge.push(...user.children.map((child) => child.id));
      }

      // Loop through all users to purge and delete them
      for (let i = 0; i < usersToPurge.length; i++) {
        try {
          await prisma.childCarePlan.deleteMany({
            where: {
              childId: usersToPurge[i],
            },
          });
        } catch {
          console.warn("No child");
        }

        try {
          await prisma.organizationUser.deleteMany({
            where: {
              userId: usersToPurge[i],
            },
          });
        } catch {
          console.warn("No child");
        }

        try {
          await prisma.user.deleteMany({
            where: {
              id: usersToPurge[i],
            },
          }).then(() => {
            console.log("Account Deleted...")
            console.log(usersToPurge[i])
          })
        } catch {
          console.warn("No child");
        }
      }

      // If user is a child, make sure they are not in any care plans

      return true;
    },
  },
};
