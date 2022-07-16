import prisma from "@utils/prismaDB";
import { UserInputError } from "apollo-server-errors";
const sgMail = require('@sendgrid/mail')
sgMail.setApiKey(process.env.SEND_GRID_API_KEY)

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
      if (context.user) throw new UserInputError("Already logged in");

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
      
      const msg = {
        to: userResetingPassword.email, // Change to your recipient
        from: 'test@em8453.getfreelaundry.com', // Change to your verified sender
        subject: 'Kids In Motion Password Reset',
        text: 'and easy to do anywhere, even with Node.js',
        html: `
            <p>Please click the link below to reset your password</p>
            <br />
            <a href=${"https://kids-in-motion.vercel.app/authentication/reset-password-from-key?key=" + resetPasswordKey.id}>${"https://kids-in-motion.vercel.app/authentication/reset-password-from-key?key=" + resetPasswordKey.id}</a>
            <br />
            <strong>If you did not request this password reset, you can ignore this message</strong>
        `,
      }
      sgMail
        .send(msg)
        .then(() => {
          console.log('Email sent')
        })
        .catch((error) => {
          console.error(error.response.body)
        })

      return true;
    },
  },
};
