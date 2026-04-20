import prisma from "@utils/prismaDB";
import { UserInputError } from "apollo-server-errors";
import sendEmail from "../../../prisma_functions/sendGrid/sendEmail";

export default {
  Mutation: {
    requestResetPassword: async (
      _,
      {
        // Required
        email,
      },
      context
    ) => {
      // If the user is already logged in do not let them reset password

      // Retrieve the users that match the email address
      let potentialUsers = await prisma.user.findMany({
        where: {
          email: email,
        },
      });
      // Loop through to find user
      let userResetingPassword = null;
      potentialUsers.map((userObject) => {
        if (!userObject) {
          return;
        }
        if (userObject.email.toLowerCase() === email.toLowerCase()) {
          userResetingPassword = userObject;
        }
      });

      // If no user can be found with this email address, return an error
      if (!userResetingPassword) {
        throw new UserInputError("Account does not exist.");
      }

      // Create the reset password key

      let resetPasswordKey = await prisma.passwordResetKey.create({
        data: {
          user: {
            connect: {
              id: userResetingPassword.id,
            },
          },
        },
      });

      sendEmail(
        true,
        null,
        `<p>Please click the link below to reset your password</p>
            <br />
            <a href=${
              "https://dashboard.kidz-n-motion.app/authentication/reset-password-from-key?key=" +
              resetPasswordKey.id
            }>${
          "https://dashboard.kidz-n-motion.app/authentication/reset-password-from-key?key=" +
          resetPasswordKey.id
        }</a>
            <br />
            <strong>If you did not request this password reset, you can ignore this message</strong>
        `,
        userResetingPassword.email,
        "Kidz-N-Motion Password Reset"
      )

      return true;
    },
  },
};
