import prisma from "@utils/prismaDB";
import { UserInputError } from "apollo-server-errors";
import { makeRandomString, changeTimeZone } from "@helpers/common";

var CryptoJS = require("crypto-js");

export default {
  Mutation: {
    loginUser: async (_, { email, password }) => {
      try {
        // Retrieve the users that match the email address
        const potentialUsers = await prisma.user.findMany({
          where: {
            email: {
              contains: email,
            },
          },
          select: {
            id: true,
            email: true,
            password: true,
            firstName: true,
            lastName: true,
            role: true,
          },
        });

        // Loop through to find user
        let userToLogin = null;
        potentialUsers.map((userObject) => {
          if (userObject.email.toLowerCase() === email.toLowerCase()) {
            userToLogin = userObject;
          }
        });

        // If no user can be found with this email address, return an error
        if (!userToLogin) {
          throw new UserInputError("Email/Password are incorrect.");
        }

        // If the user is a child return cannot long
        if (userToLogin.role === "CHILD") {
          throw new UserInputError(
            "Only guardians can sign in for their children"
          );
        }

        // Check the users login attemps and the last one
        var oneHourAgo = new Date(new Date().getTime() - 60 * 60 * 1000);
        const loginAttempts = await prisma.loginAttempts.findMany({
          where: {
            createdAt: {
              gte: changeTimeZone(oneHourAgo, "America/New_York"),
            },
            userId: userToLogin.id,
          },
        });

        if (loginAttempts.length >= 5) {
          throw new UserInputError(
            "You have reached your 5 try limit this hour. Please wait and try again."
          );
        }

        // Check the password against the password attempt
        let bytes = CryptoJS.AES.decrypt(
          userToLogin.password,
          process.env.PASSWORD_SECRET_KEY
        );
        let decryptedPassword = bytes.toString(CryptoJS.enc.Utf8);

        // If the passwords match
        if (decryptedPassword === password) {
          // Create the client string
          const jwtTokenString = makeRandomString(60);

          // Remove all old jwt tokens
          await prisma.jWTToken.deleteMany({
            where: {
              userId: userToLogin.id,
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
                  id: userToLogin.id,
                },
              },
            },
          });

          // Encypt the JWT token before sending down
          const clientToken = CryptoJS.AES.encrypt(
            jwtTokenString,
            process.env.JWT_SECRET_KEY
          ).toString();

          // Return token and truncated user object
          return {
            token: clientToken,
            user: {
              role: userToLogin.role,
              id: userToLogin.id,
              firstName: userToLogin.firstName,
              lastName: userToLogin.lastName,
              email: userToLogin.email,
            },
          };
        } else {
          await prisma.loginAttempts.create({
            data: {
              user: {
                connect: {
                  id: userToLogin.id,
                },
              },
              createdAt: changeTimeZone(new Date(), "America/New_York"),
            },
          });

          throw new UserInputError("Email/Password are incorrect.");
        }
      } catch (error) {
        throw new Error(error);
      }
    },
  },
};
