import prisma from "@utils/prismaDB";
import { UserInputError } from "apollo-server-errors";
var CryptoJS = require("crypto-js");
import { makeRandomString, changeTimeZone } from "@helpers/common";

export default {
  Mutation: {
    signUpUser: async (
      _,
      {
        // Required
        email,
        password,
        firstName,
        lastName,
        role,
        // Guardian required

        childFirstName,
        childLastName,
        childDateOfBirth,
        username,

        // School Admin / Therapist Practice required
        organizationName,
        phoneNumber,

        // Organization Invite Key
        organizationInviteKey,
      },
      context
    ) => {
      try {
        if (context.user) throw new UserInputError("Already logged in");

        // Check for conflicting user
        let potentialUsers = await prisma.user.findMany({
          where: {
            email: email,
          },
          select: {
            email: true,
          },
        });

        let conflict = null;
        potentialUsers.map((userObject) => {
          if (userObject.email.toLowerCase() === email.toLowerCase()) {
            conflict = userObject;
          }
        });

        if (conflict) {
          throw new UserInputError("Email already exists.");
        }

        // Ensure that the role is not of a child
        if (
          role !== "GUARDIAN" &&
          role !== "THERAPIST" &&
          role !== "ADMIN"
        ) {
          throw new UserInputError("Role does not exist.");
        }

        // Create base user then add on extras
        // Encrypt the user password
        const encryptedPassword = CryptoJS.AES.encrypt(
          password,
          process.env.PASSWORD_SECRET_KEY
        ).toString();

        // Validate required fields for each user role
        let missingFields = "";
        if (role === "GUARDIAN") {
          if (!childFirstName) {
            missingFields += "childFirstName, ";
          }
          if (!childLastName) {
            missingFields += "childLastName, ";
          }
          if (!childDateOfBirth) {
            missingFields += "childDateOfBirth, ";
          }
          if (missingFields.length >= 1) {
            throw new UserInputError(
              `Missing required fields for Guardian: ${missingFields}`
            );
          }
        } else if (role === "THERAPIST" || role === "ADMIN") {
          let isInvited = false;

          // When we add organization invites, will remove
          // if (organizationInviteKey) {
          //     isInvited = true;
          // }

          // If they were not invited to another organization
          if (!isInvited) {
            // if (!organizationName) {
            //   missingFields += "organizationName, ";
            // }
            // if (!phoneNumber) {
            //   missingFields += "phoneNumber, ";
            // }
            if (missingFields.length >= 1) {
              throw new UserInputError(
                `Missing required fields for Therapist / School Admin: (${missingFields}) or organizationInviteKey`
              );
            }
          }
        }

        // Create the base user
        let baseUser = await prisma.user.create({
          data: {
            email: email,
            password: encryptedPassword,
            username: username,
            role: role,
            firstName: firstName,
            lastName: lastName,
          },
        });

        // Create the role specific values
        if (role === "GUARDIAN") {
          // Create the child for the guardian account
          await prisma.user.create({
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

          // If organization invite link - add them to the organization as an organization user
          // TODO
        } else if (role === "THERAPIST" || role == "ADMIN") {
          // Create the organization for the therapist
          let baseOrganization = await prisma.organization.create({
            data: {
              organizationType: role === "THERAPIST" ? "PRACTICE" : "SCHOOL",
              owner: {
                connect: {
                  id: baseUser.id,
                },
              },
              name: organizationName,
              phoneNumber: phoneNumber,
            },
          });

          // Add them as the initial organization user
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
                  id: baseOrganization.id,
                },
              },
            },
          });

          // If organization invite link - add them to the organization as an organization user
          // TODO
        }

        // TODO SEND WELCOME EMAIL

        // Create the client string
        const jwtTokenString = makeRandomString(60);

        // Create the new JWT token
        await prisma.jWTToken.create({
          data: {
            active: true,
            token: jwtTokenString,
            createdAt: changeTimeZone(new Date(), "America/New_York"),
            user: {
              connect: {
                id: baseUser.id,
              },
            },
          },
        });

        // Encypt the JWT token before sending down
        const clientToken = CryptoJS.AES.encrypt(
          jwtTokenString,
          process.env.JWT_SECRET_KEY
        ).toString();

        // Return the user object and jwt token for login
        return {
          user: baseUser,
          token: clientToken,
        };
      } catch (error) {
        console.log(error)
        throw new Error(error);
      }
    },
  },
};
