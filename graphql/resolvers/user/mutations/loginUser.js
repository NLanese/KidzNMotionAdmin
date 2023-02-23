/* eslint-disable import/no-anonymous-default-export */
import prisma from "@utils/prismaDB";
import { UserInputError } from "apollo-server-errors";
import { makeRandomString, changeTimeZone } from "@helpers/common";

var CryptoJS = require("crypto-js");

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
        potentialUsers.map((userObject) => {
          if (!userObject) {
            return;
          }
          if (userObject.email.toLowerCase() === email.toLowerCase()) {
            userToLogin = userObject;
          } else if (userObject.username === email) {
            userToLogin = userObject;
          }
        });

        // If no user can be found with this email address, return an error
        if (!userToLogin) {
          console.log("No email found")
          throw new UserInputError("Email/Password are incorrect.");
        }

        // If the user is a child return cannot long
        // if (userToLogin.role === "CHILD") {
        //   throw new UserInputError(
        //     "Only guardians can sign in for their children"
        //   );
        // }

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

        // if (loginAttempts.length >= 5) {
        //   throw new UserInputError(
        //     "You have reached your 5 try limit this hour. Please wait and try again."
        //   );
        // }

        console.log(userToLogin, "UserToLogin")
        console.log(process.env.PASSWORD_SECRET_KEY, "KEY")

        // Check the password against the password attempt
        let bytes = CryptoJS.AES.decrypt(
          userToLogin.password,
          process.env.PASSWORD_SECRET_KEY
        );
        console.log(bytes)
        let decryptedPassword = bytes.toString(CryptoJS.enc.Utf8);

        console.log(password, "Input password")
        console.log(decryptedPassword, "Decrypted")

        // If the passwords match (JWT Actions)
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


          // test //
          ///////////////////////////////
          // SUBSCRIPTION STATUS CHECK //
          let subscriptionStatus = "active";
          let daysLeft;

            // IF //
          // Organization Owner //
          if (userToLogin.ownedOrganization) {

                    // IF //
            //  No Subscription ID (no Payment) //
            if (!userToLogin.ownedOrganization.stripeSubscriptionID) {

              // Days since Org.CreateAt
              daysLeft = parseInt(
                8 -
                  (new Date().getTime() -
                    new Date(userToLogin.ownedOrganization.createdAt).getTime()) /
                    (1000 * 3600 * 24)
              )

              if (daysLeft <= 0) {
                subscriptionStatus = "expiredOwner";
              } 
              else {
                subscriptionStatus = "trial";
              }

            } 
            
                    // IF //
            //  No Subscription ID (no Payment) //
            else {
              subscriptionStatus = "active";
            }
          } 
          
            // IF //
          // Guardian User //      
          else if (
            userToLogin.role === "GUARDIAN" &&
            userToLogin.soloStripeSubscriptionID // Delete this once user payment is added
          ) {

                  // IF //
            // User Paid //
            if (userToLogin.soloStripeSubscriptionID) {
              subscriptionStatus = "active";
            } 

                  // IF //
            // User Did not Pay //
            else {
              daysLeft = parseInt(
                8 -
                  (new Date().getTime() -
                    new Date(userToLogin.createdAt).getTime()) /
                    (1000 * 3600 * 24)
              );
              if (daysLeft <= 0) {
                subscriptionStatus = "expiredUser";
              } else {
                subscriptionStatus = "trial";
              }
            }
          } 
          
            // IF //
          // Therapist User //
          else {
            if (userToLogin.organizations) {
              if (userToLogin.organizations[0]) {
                const organization = userOuserToLoginbject.organizations[0].organization;

                if (!organization.stripeSubscriptionID) {
                  daysLeft = parseInt(
                    8 -
                      (new Date().getTime() -
                        new Date(organization.createdAt).getTime()) /
                        (1000 * 3600 * 24)
                  );
                  console.log(daysLeft);
                  if (daysLeft <= 0) {
                    subscriptionStatus = "expiredNotOwner";
                  } else {
                    subscriptionStatus = "trial";
                  }
                } else {
                  subscriptionStatus = "active";
                }
              }
            }
          }

          console.log(subscriptionStatus)
          userToLogin = {...userToLogin, soloSubscriptionStatus: subscriptionStatus}

          // Return token and truncated user object
          try {
            return {
              token: clientToken,
              user: userToLogin,
            };
          } 
          
          // Failed Return
          catch (err) {
            console.log(err)
          }
        } 
        
        // Password is Does Not Match User
        // - Checks to see if Child Login or returns failed attempt
        else {
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

                  // Return token and truncated user object
                  try {
                    return {
                      token: clientToken,
                      user: childPasswordMatch,
                    };
                  } catch (err) {
                    // // console.log(err)
                  }
                }
              }
            }
          }

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

          // console.log("Wrong Password")
          throw new UserInputError("Email/Password are incorrect.");
        }


      } catch (error) {
        // console.log(error)
        throw new Error(error);
      }
    },
  },
};
