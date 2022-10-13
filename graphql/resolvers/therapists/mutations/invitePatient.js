/* eslint-disable import/no-anonymous-default-export */
import prisma from "@utils/prismaDB";
import { UserInputError } from "apollo-server-errors";
var CryptoJS = require("crypto-js");
const sgMail = require("@sendgrid/mail");
sgMail.setApiKey(process.env.SEND_GRID_API_KEY);
import { makeRandomString, changeTimeZone } from "@helpers/common";
// Used for a therpaist to create a
export default {
  Mutation: {
    invitePatient: async (
      _,
      {
        email,
        guardianFirstName,
        guardianLastName,
        childFirstName,
        childLastName,
        childDateOfBirth,
        childLevel,
        childTherapistID,
      },
      context
    ) => {
      if (!context.user) throw new UserInputError("Login required");
      if (context.user.role !== "THERAPIST")
        throw new UserInputError(
          "Only therapists can edit notification settings"
        );

      // Check if the user exists
      let existingUserObject = null;
      // Check to see if the user exists or not
      let potentialUsers = await prisma.user.findMany({
        where: {
          email: email,
        },
      });

      // Loop through to find user
      potentialUsers.map((userObject) => {
        if (!userObject) {
          return;
        }
        if (userObject.email.toLowerCase() === email.toLowerCase()) {
          existingUserObject = userObject;
        }
      });

      // The user already exists, return an error
      if (existingUserObject) {
        throw new UserInputError(
          "User already exists, the email is already in use"
        );
      }

      // If no
      // Create their account
      // Create the base user
      const encryptedPassword = CryptoJS.AES.encrypt(
        Math.random.toString(),
        process.env.PASSWORD_SECRET_KEY
      ).toString();

      let baseUser = await prisma.user.create({
        data: {
          email: email,
          password: encryptedPassword,
          username: email,
          role: "GUARDIAN",
          firstName: guardianFirstName,
          lastName: guardianLastName,
        },
      });

      // Create the child for the guardian account
      let childUser = await prisma.user.create({
        data: {
          email: makeRandomString(60) + "@kidsinmotion.com",
          password: makeRandomString(60),
          role: "CHILD",
          firstName: childFirstName,
          lastName: childLastName,
          childDateOfBirth: childDateOfBirth,
          guardian: {
            connect: {
              id: baseUser.id,
            },
          },
        },
      });
      // Add both to the organization
      await prisma.organizationUser.create({
        data: {
          active: true,
          user: {
            connect: {
              id: baseUser.id,
            },
          },
          organization: {
            connect: {
              id: context.user.ownedOrganization.id,
            },
          },
        },
      });
      await prisma.organizationUser.create({
        data: {
          active: true,
          user: {
            connect: {
              id: childUser.id,
            },
          },
          organization: {
            connect: {
              id: context.user.ownedOrganization.id,
            },
          },
        },
      });

      // Add the child care plan for the child
      await prisma.childCarePlan.create({
        data: {
          child: {
            connect: {
              id: childUser.id,
            },
          },
          therapist: {
            connect: {
              id: childTherapistID,
            },
          },
          level: parseInt(childLevel),
        },
      });
      // Create the message chat rooms for both the child and the guardian
      await prisma.chatroom.create({
        data: {
          users: {
            connect: [
              {
                id: childUser.id,
              },
              {
                id: context.user.id,
              },
            ],
          },
        },
      });
      await prisma.chatroom.create({
        data: {
          users: {
            connect: [
              {
                id: baseUser.id,
              },
              {
                id: context.user.id,
              },
            ],
          },
        },
      });
      // Send a password reset link to the guardian, but with a more "invite spin"

      let resetPasswordKey = await prisma.passwordResetKey.create({
        data: {
          user: {
            connect: {
              id: baseUser.id,
            },
          },
        },
      });

      const msg = {
        to: baseUser.email, // Change to your recipient
        from: "test@em8453.getfreelaundry.com", // Change to your verified sender
        subject: "Kidz-N-Motion Account Activation",

        html: `
            <p>Please click the link below to activate your accoujt</p>
            <br />
            <a href=${
              "https://kids-in-motion.vercel.app/authentication/reset-password-from-key?key=" +
              resetPasswordKey.id + "&create=true"
            }>${
          "https://kids-in-motion.vercel.app/authentication/reset-password-from-key?key=" +
          resetPasswordKey.id + "&create=true"
        }</a>
            <br />
            <strong>If you did not request this account account activation, you can ignore this message</strong>
        `,
      };
      await sgMail
        .send(msg)
        .then(() => {
          // console.log('Email sent')
        })
        .catch((error) => {
          console.error(error.response.body);
        });
      // Return a stringn for th chjild user id or child care plan id
      return childUser.id;
    },
  },
};
