import prisma from "@utils/prismaDB";
import { UserInputError } from "apollo-server-errors";

import { makeRandomString, changeTimeZone } from "@helpers/common";

var CryptoJS = require("crypto-js");

export default {
  Mutation: {
    swapToChildAccount: async (_, { childUserID }, context) => {
      console.log("\n=======================\nInside Swap To Child Account\n-----------------------\n")
      if (!context.user) throw new UserInputError("Login required");
      if (context.user.role !== "GUARDIAN")
        throw new UserInputError("Only guardians can switch to a child account");

      // Find the child object to determine if the are under the guardian account
      console.log("Trying to find child ", childUserID)
      let childUser = await prisma.user.findUnique({
        where: {
          id: childUserID,
        },
        select: {
          guardianId: true,
          id: true
        }
      });

      // If they are not, then return user input error
      if (!childUser) {
        throw new UserInputError("Child does not exist");
      }
      console.log("Child Found")

      // If they guardian does not have acess to the user then return error
      if (childUser.guardianId != context.user.id) { throw new UserInputError("You do not have access to this child") }
      console.log("Access to account granted")

      // Create the client string
      console.log("Making random sttring")
      const jwtTokenString = makeRandomString(60);

      // Remove all old jwt tokens
      await prisma.jWTToken.deleteMany({
        where: {
          userId: childUser.id,
          active: false,
        },
      });

      // Create the new JWT token
      console.log("Creating Token")
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
      console.log("Token Created...")

      // Encypt the JWT token before sending down
      const clientToken = CryptoJS.AES.encrypt(
        jwtTokenString,
        process.env.JWT_SECRET_KEY
      ).toString();
      console.log("Client Token Created")

      // Return the child user object and their token id
      return {
        token: clientToken,
        user: childUser,
      };
    },
  },
};
