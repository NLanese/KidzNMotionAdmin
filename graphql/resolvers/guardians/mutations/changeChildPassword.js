/* eslint-disable import/no-anonymous-default-export */
import prisma from "@utils/prismaDB";
import { UserInputError } from "apollo-server-errors";
var CryptoJS = require("crypto-js");

export default {
  Mutation: {
    changeChildPassword: async (_, { childUserID, childPassword }, context) => {
      if (!context.user) throw new UserInputError("Login required");

      if (context.user.role !== "GUARDIAN")
        throw new UserInputError("Only guardians can edit child settings");

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

      // Encrypt the child password
      const encryptedPassword = CryptoJS.AES.encrypt(
        childPassword,
        process.env.PASSWORD_SECRET_KEY
      ).toString();

      // Update the child password
      await prisma.user.update({
        where: {
          id: childUserID,
        },

        data: {
            password: encryptedPassword
        },
      });

      return true;
    },
  },
};
