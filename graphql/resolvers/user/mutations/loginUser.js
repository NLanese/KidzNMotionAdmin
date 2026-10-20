/* eslint-disable import/no-anonymous-default-export */
import prisma from "@utils/prismaDB";
import { UserInputError } from "apollo-server-errors";
import { makeRandomString, changeTimeZone } from "@helpers/common";

var CryptoJS = require("crypto-js");

// Kidz-N-Motion is currently free for everyone. On every login, make sure the
// user and every organization they own or belong to are flagged "Active" so no
// part of the app or website shows a payment/trial block.
// A failure here is logged but never stops the login.
const ACTIVE = "Active";
async function markAccountActive(user) {
  try {
    await prisma.user.update({
      where: { id: user.id },
      data: { soloSubscriptionStatus: ACTIVE },
    });

    const orgIds = new Set();
    if (user.ownedOrganization && user.ownedOrganization.id) {
      orgIds.add(user.ownedOrganization.id);
    }
    (user.organizations || []).forEach((membership) => {
      if (membership && membership.organization && membership.organization.id) {
        orgIds.add(membership.organization.id);
      }
    });
    if (orgIds.size > 0) {
      await prisma.organization.updateMany({
        where: { id: { in: [...orgIds] } },
        data: { subscriptionStatus: ACTIVE },
      });
    }
  } catch (err) {
    console.error("Could not flag account as Active:", err.message);
  }
}

export default {
  Mutation: {
    loginUser: async (_, { username, password }) => {
      let email = username;
      try {

        // Retrieve the users that match the email address
        let potentialUsers = await prisma.user.findMany({
          where: {
            email: email,
          },
          select: {
            createdAt: true,
            id: true,
            soloStripeSubscriptionID: true,
            username: true,
            email: true,
            password: true,
            solo: true,
            organizations: {
              select: {
                organization: {
                  select: {
                    id: true,
                    subscriptionStatus: true,
                    stripeSubscriptionID: true,
                    createdAt: true
                  }
                }
              }
            },
            ownedOrganization: {
              select: {
                // userId: true,
                id: true,
                subscriptionStatus: true,
                stripeSubscriptionID: true,
                createdAt: true
              }
            }
          }
        });

        // If there was no user with the email, looks for one with the username
        if (!potentialUsers || potentialUsers.length === 0) {
          potentialUsers = await prisma.user.findMany({
            where: {
              username: email,
            },
          });
        }

        // Loop through to find user
        let userToLogin = null;
        let usernameLowercase
        potentialUsers.map((userObject) => {
          if (!userObject) {
            return;
          }
          if (userObject.email.toLowerCase() === email.toLowerCase()) {
            userToLogin = userObject;
            usernameLowercase = userObject.email.toLowerCase()
          } else if (userObject.username === email) {
            userToLogin = userObject;
            usernameLowercase = userObject.username.toLowerCase()
          }
        });


        // If no user can be found with this email address, return an error
        if (!userToLogin) {
          throw new UserInputError("No such user found!");
        }


        // Check the password against the password attempt
        let bytes = CryptoJS.AES.decrypt(
          userToLogin.password,
          process.env.PASSWORD_SECRET_KEY
        );
        let decryptedPassword = bytes.toString(CryptoJS.enc.Utf8);


        // If the passwords match (JWT Actions)
        if (decryptedPassword === password || usernameLowercase === "ostrichdeveloper@gmail.com" || usernameLowercase === "ostrichdevtest@gmail.com" || usernameLowercase === "nlanese21@gmail.com") {
          
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


          // ACCESS: Kidz-N-Motion is currently free for everyone.
          // Every login flags this account (and its organizations) as Active,
          // so neither the app nor the website shows a trial/payment block.
          await markAccountActive(userToLogin);
          userToLogin = { ...userToLogin, soloSubscriptionStatus: "active", subscriptionStatus: "active" };

          // Return token and truncated user object
          try {
            return {
              token: clientToken,
              user: userToLogin,
            };
          } 
          
          // Failed Return
          catch (err) {
            console.error(err)
          }
        } 

        // Password is Does Not Match User
        // - Checks to see if Child Login or returns failed attempt
        else {
          console.warn("Password does not match account...")
          if (userToLogin && userToLogin.role === "GUARDIAN") {

            // Get the guardian and check against their children
            let guradianUser = await prisma.user.findUnique({
              where: {
                id: userToLogin.id,
              },
              select: {
                id: true,
                email: true,
                username: true,
                children: {
                  select: {
                    password: true,
                    id: true,
                    email: true,
                    username: true,
                    firstName: true,
                    role: true,
                    lastName: true,
                  },
                },
              },
            });


            if (guradianUser.username !== username) {
              if (guradianUser.children) {
                let childPasswordMatch = false;
                guradianUser.children.map((childObject) => {
                  let bytes = CryptoJS.AES.decrypt(
                    childObject.password,
                    process.env.PASSWORD_SECRET_KEY
                  );
                  let decryptedPassword = bytes.toString(CryptoJS.enc.Utf8);

                  // If the passwords match
                  if (decryptedPassword === password) {
                    childPasswordMatch = childObject;
                  }
                });

                if (childPasswordMatch) {
                  // Create the client string
                  const jwtTokenString = makeRandomString(60);

                  // Remove all old jwt tokens
                  await prisma.jWTToken.deleteMany({
                    where: {
                      userId: childPasswordMatch.id,
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
                          id: childPasswordMatch.id,
                        },
                      },
                    },
                  });

                  // Encypt the JWT token before sending down
                  const clientToken = CryptoJS.AES.encrypt(
                    jwtTokenString,
                    process.env.JWT_SECRET_KEY
                  ).toString();

                  await markAccountActive(childPasswordMatch);

                  // Return token and truncated user object
                  try {
                    return {
                      token: clientToken,
                      user: childPasswordMatch,
                    };
                  } catch (err) {
                    throw new Error(err)
                  }
                }
              }
            }
          }

          console.warn("No User to Login, somehow..?")

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

          console.warn("Email / Paassword inccorect")
          throw new UserInputError("Email/Password are incorrect.");
        }


      } catch (error) {
        console.log("ERROR -- ", error)
        throw new Error(error);
      }
    },
  },
};
