import prisma from "@utils/prismaDB";
import { UserInputError } from "apollo-server-errors";

import { makeRandomString, changeTimeZone } from "@helpers/common";

var CryptoJS = require("crypto-js");

export default {
  Mutation: {
    swapToChildAccount: async (_, { childUserID }, context) => {
      if (!context.user) throw new UserInputError("Login required");
      if (context.user.role !== "GUARDIAN")
        throw new UserInputError("Only guardians can edit child settings");

      // Find the child object to determine if the are under the guardian account
      let childUser = await prisma.user.findUnique({
        where: {
          id: childUserID,
        }
      });

      // If they are not, then return user input error
      if (!childUser) {
        throw new UserInputError("Child does not exist");
      }

      // If they guardian does not have acess to the user then return error
      if (childUser.guardianId != context.user.id) {
        throw new UserInputError("You do not have access to this child");
      }
      // Create the client string
      const jwtTokenString = makeRandomString(60);

      // Remove all old jwt tokens
      await prisma.jWTToken.deleteMany({
        where: {
          userId: childUser.id,
          active: false,
        },
      });

      // Create the new JWT token
      await prisma.jWTToken.create({
        data: {
          active: true,
          token: jwtTokenString,
          createdAt: changeTimeZone(new Date(), "America/New_York"),
          user: {
            connect: {
              id: childUser.id,
            },
          },
        },
      });

      // Encypt the JWT token before sending down
      const clientToken = CryptoJS.AES.encrypt(
        jwtTokenString,
        process.env.JWT_SECRET_KEY
      ).toString();

      // Return the child user object and their token id
      return {
        token: clientToken,
        user: childUser,
      };


      return true;
    },
  },
};
