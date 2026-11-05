import prisma from "@utils/prismaDB";
import { UserInputError, ApolloError } from "apollo-server-errors";
import sendEmail from "../../../prisma_functions/sendGrid/sendEmail";

// Where the "reset your password" link points. Set SITE_URL in Vercel if the
// website moves; it must serve /authentication/reset-password-from-key.
const SITE_URL = (process.env.SITE_URL || "https://dashboard.kidz-n-motion.app").replace(/\/$/, "");

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
      const cleanEmail = (email || "").trim();

      // Retrieve the users that match the email address
      let potentialUsers = await prisma.user.findMany({
        where: {
          email: cleanEmail,
        },
      });
      // Loop through to find user
      let userResetingPassword = null;
      potentialUsers.map((userObject) => {
        if (!userObject) {
          return;
        }
        if (userObject.email.toLowerCase() === cleanEmail.toLowerCase()) {
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

      const link = `${SITE_URL}/authentication/reset-password-from-key?key=${resetPasswordKey.id}`;

      // Must be awaited: on Vercel the function can be frozen as soon as it
      // returns, which used to cut the SendGrid request off before it was sent.
      const sent = await sendEmail(
        true,
        `Reset your Kidz-N-Motion password by opening this link: ${link}\n\nIf you did not request this, you can ignore this email.`,
        `<p>Please click the link below to reset your password</p>
            <br />
            <a href="${link}">${link}</a>
            <br />
            <strong>If you did not request this password reset, you can ignore this message</strong>
        `,
        userResetingPassword.email,
        "Kidz-N-Motion Password Reset"
      );

      // Tell the person instead of pretending it worked.
      if (!sent) {
        throw new ApolloError(
          "We couldn't send the reset email. Please try again later.",
          "EMAIL_NOT_SENT"
        );
      }

      return true;
    },
  },
};
