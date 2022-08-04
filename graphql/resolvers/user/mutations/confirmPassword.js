/* eslint-disable import/no-anonymous-default-export */
import prisma from "@utils/prismaDB";
import { UserInputError } from "apollo-server-errors";
var CryptoJS = require("crypto-js");

export default {
  Mutation: {
    confirmPassword: async (_, { password }, context) => {
      if (!context.user) throw new UserInputError("Login required");

      // Get the user encrypted password from Prisma to compare to submitted password
      let passwordToCompare = await prisma.user.findUnique({
        where: {
          id: context.user.id,
        },
        select: {
          password: true,
        },
      });

      passwordToCompare = passwordToCompare.password;

      // Check the password against the password attempt
      let bytes = CryptoJS.AES.decrypt(
        passwordToCompare,
        process.env.PASSWORD_SECRET_KEY
      );
      let decryptedPassword = bytes.toString(CryptoJS.enc.Utf8);

      // Return if the password matches or it does not
      if (decryptedPassword === password) {
        return true;
      } else {
        return false;
      }
    },
  },
};
