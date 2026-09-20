import prisma from "@utils/prismaDB"
import { makeRandomString, changeTimeZone } from "@helpers/common";
import { UserInputError } from "apollo-server-errors";
import IsConflictingEmails from "../../../prisma_functions/user/checkForConflictingEmails";
import findMissingGuardianFields from "../../../prisma_functions/user/checkMissingGuardianFields";

var CryptoJS = require("crypto-js");
var sgMail = require("@sendgrid/mail");
var randomstring = require("randomstring");

sgMail.setApiKey(process.env.SEND_GRID_API_KEY);

export default {
  Mutation: {
    signUpUser: async (
      _,
      {
        // Required
        email, password, firstName, lastName, role,

        // Guardian required
        username, childFirstName, childLastName, childDateOfBirth,
        
        // School Admin / Therapist Practice required
        organizationName, phoneNumber, title,

        // Organization Invite Key
        organizationInviteKey,
      },

      context
    ) => {

      // Define a base child user to user later in create organizatino user
      let childUser;

try {

  //////////////////////////
  // CHECKS FOR CONFLICTS //

    if (context.user) throw new UserInputError("Already logged in");
    if (IsConflictingEmails(email) === true) {
      throw new UserInputError("Email already exists.");
    }

  ////////////////////////////////////////////
  // CHECKS FOR MISSING OR INCORRECT FIELDS //

    // Checks User Role
    if (role !== "GUARDIAN" && role !== "THERAPIST" && role !== "ADMIN" && role != "BETA") {
      throw new UserInputError("Role does not exist.");
    }

    // Encrypt the user password
    const encryptedPassword = CryptoJS.AES.encrypt(
      password,
      process.env.PASSWORD_SECRET_KEY
    ).toString();

    // Validate required fields for each user role
    let missingFields = "";

    // Guardian Check
    if (role === "GUARDIAN") {
      missingFields = findMissingGuardianFields(childFirstName, childLastName, childDateOfBirth)
      if (missingFields.length >= 1) {
        throw new UserInputError(
          `Missing required fields for Guardian: ${missingFields}`
        );
      }
    } 

///////////////////////////////////////////////////
// CREATES BASE USER AND MAKES MODEL CONNECTIONS //


  // Create the base user
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
      soloSubscriptionStatus: "Active",
    },
  });

        // Guardian
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
          
        }
        
        // Therapist or Admin
        else if (role === "THERAPIST" || role == "ADMIN") {
          // If they were not invited and do not have an invite link then create their own organization
          if (!organizationInviteKey) {
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
          }
        }

        // Org Invite
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

        // Add to Org
        if (organizationInvite && organizationInvite[0]) {
          try{
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
          }
          catch(err){
            throw new UserInputError("Failed while connecting to Org via KEY")
          }

          //                                                    //
          // Create the organization user for the child as well //
          //                                                    //
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

        // Beta Testers
        else{
          if (title === "Beta Tester"){
            if (role === "THERAPIST" || role == "ADMIN") {

              // Creates Base Org
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
            }
          }
        }


      /* 
        TOKEN RELATED FUNCTIONS
      */

        // Creates Token
        const jwtTokenString = makeRandomString(60);

        // Create the new JWT token in Database
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


    //                             //
    // FOR BETA TESTING THERAPISTS //
    //                             //

      if (role === "THERAPIST"  && title === "Beta Tester"){

        // Creates Dummy Parent and Child
        let dummyParent
        let childUser
        try{
            // Create a Dummy Parent
            dummyParent = await prisma.user.create({
              data: {
                email: (randomstring.generate(8) + "@knm.net"),
                password: randomstring.generate(12),
                username: randomstring.generate(8),
                role: "GUARDIAN",
                title: "Test",
                phoneNumber: "1234567890",
                firstName: "DummyClient",
                lastName: "DummyLastName",
              },
            });

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
                    id: dummyParent.id,
                  },
                },
              },
            });
        }
        catch(err){
          throw new UserInputError("Failed Creating Child and Parent")
        }

        // Adds User to Org via Key //
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

      // Adds User to Org via Invite //
      if (organizationInvite && organizationInvite[0]) {
        await prisma.organizationUser.create({
          data: {
            active: true,
            user: {
              connect: {
                id: dummyParent.id,
              },
            },
            organization: {
              connect: {
                id: organizationInvite[0].organizationId,
              },
            },
          },
        });

        // Create the organization user for the child as well //
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
      }
      }
          
        return {
          user: baseUser,
          token: clientToken,
        };
      } catch (error) {
        throw new Error(error);
      }
    },
  },
};
