/* eslint-disable import/no-anonymous-default-export */
import prisma from "@utils/prismaDB";
import { UserInputError } from "apollo-server-errors";
var CryptoJS = require("crypto-js");
import { makeRandomString, changeTimeZone } from "@helpers/common";

const sgMail = require("@sendgrid/mail");
sgMail.setApiKey(process.env.SEND_GRID_API_KEY);

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
        title,

        // Organization Invite Key
        organizationInviteKey,
      },
      context
    ) => {
      console.log(organizationName);
      console.log(title)
      console.log(role)

      // Define a base child user to user later in create organizatino user
      let childUser;

      try {
        // #region Check User Conflicts
        // // console.log(context.user);
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

        // #endregion

        // #region Check For Missing Fields / Incorrect Input
        // Ensure that the role is not of a child
        if (role !== "GUARDIAN" && role !== "THERAPIST" && role !== "ADMIN") {
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
        } else if (role === "THERAPIST") {
          if (!title) {
            missingFields += "title, ";
          }
          if (missingFields.length >= 1) {
            throw new UserInputError(
              `Missing required fields for Therapist: ${missingFields}`
            );
          }
        }
        // #endregion

        const allVideos = await prisma.video.findMany;

        // #region Create the User & required information
        // Create the base user
        console.log("creating user")
        let baseUser = await prisma.user.create({
          data: {
            email: email,
            password: encryptedPassword,
            username: username,
            role: role,
            title: title,
            phoneNumber: phoneNumber,
            firstName: firstName,
            lastName: lastName,
            soloSubscriptionStatus: "Trial"
          },
        });

        console.log("user created")
        // Create the role specific values
        if (role === "GUARDIAN") {
          // The guardian is signing up without an organization invite key, mark their account as solo
          if (!organizationInviteKey) {
            await prisma.user.update({
              where: {
                id: baseUser.id,
              },
              data: {
                solo: true,
              },
            });
          }

          // Create the child for the guardian account
          childUser = await prisma.user.create({
            data: {
              email: makeRandomString(60) + "@kidz-n-motion.com",
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
          console.log("therapist")
          // If they were not invited and do not have an invite link then create their own organization
          if (!organizationInviteKey) {
            console.log("No invite key")
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

            console.log(baseOrganization)

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
          }
          console.log("passed key check")
        }
        console.log("passed all org stuff")
        // #endregion

        // If there is an organization invite key then add them to the organization
        let organizationInvite;
        if (organizationInviteKey) {
          organizationInvite = await prisma.organizationInviteKey.findMany({
            where: {
              id: organizationInviteKey,
              active: true,
            },
            select: {
              organizationId: true,
              additionalInformation: true,
            },
          });
        }

        // If there is a organization invite
        if (organizationInvite && organizationInvite[0]) {
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
                  id: organizationInvite[0].organizationId,
                },
              },
            },
          });

          // Create the organization user for the child as well
          if (childUser) {
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
                    id: organizationInvite[0].organizationId,
                  },
                },
              },
            });

            // If there is a chidl user and the organization invite has additional information, then create:
            //  - Child Care Plan
            //  - Set Initial Therapist ID & Child Level

            if (organizationInvite[0].additionalInformation.childTherapistID) {
              await prisma.childCarePlan.create({
                data: {
                  child: {
                    connect: {
                      id: childUser.id,
                    },
                  },
                  therapist: {
                    connect: {
                      id: organizationInvite[0].additionalInformation
                        .childTherapistID,
                    },
                  },
                  level: parseInt(
                    organizationInvite[0].additionalInformation.childLevel
                  ),
                },
              });
            }

            if (organizationInvite[0].additionalInformation.childTherapistID) {
              await prisma.chatroom.create({
                data: {
                  users: {
                    connect: [
                      {
                        id: childUser.id,
                      },
                      {
                        id: organizationInvite[0].additionalInformation
                          .childTherapistID,
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
                        id: organizationInvite[0].additionalInformation
                          .childTherapistID,
                      },
                    ],
                  },
                },
              });
            }
          }

          await prisma.organizationInviteKey.update({
            where: {
              id: organizationInviteKey,
            },
            data: {
              active: false,
            },
          });
        }

        // #region Create JWT Token
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
        // #endregion

        const msg2 = {
          to: email, // Change to your recipient
          from: "noreply@em9019.kidz-n-motion.app", // Change to your verified sender
          subject: "Your free trial is officially active!",

          html: `
              <div style="text-align: center">
              <img src="https://kids-in-motion.vercel.app/logos/Main.png"  width="110px"/>
              </div>
                <br />
                <p>Hi ${firstName},</p>
                <br />
                <p>Welcome to Kidz-N-Motion! Your 7-day trial is officially active. You have access to some of the features and functions of the app as well as the website. We are delighted that you chose to enhance your physical therapy services.</p>
                <br />
                <p>
                  <b>Here’s what you need to know:</b>
                </p>
                <ol>
                  <li>
                  You will have 7 days to explore the features and functions of the app. You can cancel at anytime during the trial period.
                  </li>
                  <li>
                  If you don’t cancel within 7 days your paid subscription will automatically start on your selected plan.
                  </li>
                  <li>
                  You can access the website to learn more at: https://kidz-n-motion.app/
                  </li>
                </ol>
                <br />
                <p>Thank you, </p>
                <p>Team Kidz-N-Motion</p>
  
            `,
        };

        if (role === "THERAPIST" || role === "ADMIN") {
          await sgMail
            .send(msg2)
            .then(() => {
              // // console.log('Email sent')
            })
            .catch((error) => {
              console.error(error.response.body);
            });
        }

        // Return the user object and jwt token for login
        return {
          user: baseUser,
          token: clientToken,
        };
      } catch (error) {
        // // console.log(error);
        throw new Error(error);
      }
    },
  },
};
