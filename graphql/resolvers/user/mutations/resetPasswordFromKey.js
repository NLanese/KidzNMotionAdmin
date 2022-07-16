import prisma from "@utils/prismaDB";
import { UserInputError } from "apollo-server-errors";
var CryptoJS = require("crypto-js");

export default {
  Mutation: {
    resetPasswordFromKey: async (
      _,
      {
        // Required
        password,
        resetPasswordKeyID,
      },
      context
    ) => {
      // If the user is already logged in do not let them reset password
      if (context.user) throw new UserInputError("Already logged in");

      // Retreive the password reset key and check if its active
      const resetPasswordKey = await prisma.passwordResetKey.findUnique({
        where: {
          id: resetPasswordKeyID,
        },
        select: {
          id: true,
          active: true,
          user: {
            select: {
              id: true,
            },
          },
        },
      });

      // If the token is not valid send out error
      if (!resetPasswordKey) {
        throw new UserInputError("Reset password key does not exist.");
      }

      if (!resetPasswordKey.active) {
        throw new UserInputError("Reset password has already been used.");
      }

      // Encrypt the user password
      const encryptedPassword = CryptoJS.AES.encrypt(
        password,
        process.env.PASSWORD_SECRET_KEY
      ).toString();

      // Update the user object & passsword reset key
      await prisma.user.update({
        where: {
          id: resetPasswordKey.user.id,
        },
        data: {
          password: encryptedPassword,
        },
      });

      await prisma.passwordResetKey.update({
        where: {
          id: resetPasswordKey.id,
        },
        data: {
          active: false,
        },
      });

      return true;
    },
  },
};
