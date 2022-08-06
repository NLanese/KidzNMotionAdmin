var CryptoJS = require("crypto-js");
import { changeTimeZone } from "@helpers/common";
import prisma from "@utils/prismaDB";

export const handleAuth = async (clientToken) => {
  try {
    // Decrypt the client side token
    let bytes = CryptoJS.AES.decrypt(clientToken, process.env.JWT_SECRET_KEY);
    let decryptedJWTToken = bytes.toString(CryptoJS.enc.Utf8);

    // Get the list of potential tokens
    const potentialJWTTokens = await prisma.jWTToken.findMany({
      where: {
        token: decryptedJWTToken,
        active: true,
      },
    });

    // Loop through tokens to ensure exact match
    let userJWTToken = null;
    potentialJWTTokens.map((tokenObject) => {
      if (tokenObject.token === decryptedJWTToken) {
        userJWTToken = tokenObject;
      }
    });

    // If there is a vlid token then find the user object and return.
    if (userJWTToken) {
      // Get the specified age range of the tokens
      let ageRange = changeTimeZone(
        new Date(new Date().getTime() - 24 * 10 * 60 * 60 * 1000),
        "America/New_York"
      );
      if (userJWTToken.createdAt <= ageRange) {
        await prisma.jWTToken.update({
          where: {
            id: userJWTToken.id,
          },
          data: {
            active: false,
          },
        });
        return null;
      } else {
        await prisma.jWTToken.update({
          where: {
            id: userJWTToken.id,
          },
          data: {
            createdAt: changeTimeZone(new Date()),
          },
        });
      }

      // Get the user object and return into the apollo context
      const userObject = await prisma.user.findUnique({
        where: {
          id: userJWTToken.userId,
        },
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          role: true,
          ownedOrganization: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      });
      userObject.tokenId = userJWTToken.id;

      return userObject;
    } else {
      // If not then reurn an access denied
      return null;
    }
  } catch {
    return null;
  }
};

export const getUserObject = async (user) => {

  let userObject = {}
  if (user.role === "GUARDIAN") {
    userObject = await prisma.user.findUnique({
      where: {
        id: user.id,
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        role: true,
        email: true,
        phoneNumber: true,
        profilePic: true,
        muteAllAssignments: true,
        muteAllMessages: true,
        children: {
          where: {
            active: true,
          },
          select: {
            id: true,
            firstName: true,
            accessMessages: true,
            accessSettings: true,
            leaveApp: true,
            lastName: true,
            childDateOfBirth: true,
            childCarePlans: {
              where: {
                active: true,
              },
              select: {
                id: true,
                level: true,
                allVideoStatus: true,
                weeklyVideoStatus: true,
                assignments: {
                  select: {
                    id: true,
                    createdAt: true,
                    dateStart: true,
                    dateDue: true,
                    description: true,
                    videos: {
                      select: {
                        id: true,
                        contentfulID: true,
                        medals: {
                          select: {
                            id: true,
                            image: true,
                            description: true,
                            level: true,
                          },
                        },
                      },
                    },
                  },
                },
                therapist: {
                  select: {
                    firstName: true,
                    lastName: true,
                    title: true,
                    email: true,
                  },
                },
              },
            },
          },
        },
        organizations: {
          where: {
            active: true,
          },
          select: {
            organization: {
              select: {
                id: true,
                name: true,
                organizationType: true,
              },
            },
          },
        },
      },
    });
  } else if (user.role === "THERAPIST") {
    userObject = await prisma.user.findUnique({
      where: {
        id: user.id,
      },
      select: {
        id: true,
        title: true,
        firstName: true,
        lastName: true,
        role: true,
        email: true,
        phoneNumber: true,
        profilePic: true,
        muteAllAssignments: true,
        muteAllMessages: true,
        patientCarePlans: {
          where: {
            active: true,
          },
          select: {
            id: true,
            level: true,
            allVideoStatus: true,
            weeklyVideoStatus: true,
            assignments: {
              select: {
                id: true,
                createdAt: true,
                dateStart: true,
                dateDue: true,
                description: true,
                videos: {
                  select: {
                    id: true,
                    contentfulID: true,
                    medals: {
                      select: {
                        id: true,
                        image: true,
                        description: true,
                        level: true,
                      },
                    },
                  },
                },
              },
            },
          },
        },
        ownedOrganization: {
          select: {
            id: true,
            createdAt: true,
            name: true,
            phoneNumber: true,
            organizationType: true,
            stripeSubscriptionID: true,
            stripeSubscriptionID: true,
            active: true,
            organizationUsers: {
              select: {
                id: true,
                active: true,
                user: {
                  select: {
                    id: true,
                    role: true,
                    firstName: true,
                    lastName: true,
                    email: true,
                  },
                },
              },
            },
          },
        },
        organizations: {
          where: {
            active: true,
          },
          select: {
            organization: {
              select: {
                id: true,
                name: true,
                organizationType: true,
              },
            },
          },
        },
      },
    });
  } else if (user.role === "ADMIN") {
    userObject = await prisma.user.findUnique({
      where: {
        id: user.id,
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        role: true,
        email: true,
        phoneNumber: true,
        profilePic: true,
        muteAllAssignments: true,
        muteAllMessages: true,
        ownedOrganization: {
          select: {
            id: true,
            createdAt: true,
            name: true,
            phoneNumber: true,
            organizationType: true,
            stripeSubscriptionID: true,
            stripeSubscriptionID: true,
            active: true,
            organizationUsers: {
              select: {
                id: true,
                active: true,
                user: {
                  select: {
                    id: true,
                    role: true,
                    firstName: true,
                    lastName: true,
                    email: true,
                  },
                },
              },
            },
          },
        },
        organizations: {
          where: {
            active: true,
          },
          select: {
            organization: {
              select: {
                id: true,
                name: true,
                organizationType: true,
                organizationUsers: {
                  select: {
                    id: true,
                    active: true,
                    user: {
                      select: {
                        id: true,
                        role: true,
                        firstName: true,
                        lastName: true,
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    });
  } else if (user.role === "CHILD") {
    userObject = await prisma.user.findUnique({
      where: {
        id: user.id,
      },
      select: {
        id: true,
        firstName: true,
        accessMessages: true,
        accessSettings: true,
        leaveApp: true,
        lastName: true,
        childDateOfBirth: true,
        profilePic: true,
        muteAllAssignments: true,
        muteAllMessages: true,
        childCarePlans: {
          where: {
            active: true,
          },
          select: {
            id: true,
            level: true,
            allVideoStatus: true,
            weeklyVideoStatus: true,
            assignments: {
              select: {
                id: true,
                createdAt: true,
                dateStart: true,
                dateDue: true,
                description: true,
                videos: {
                  select: {
                    id: true,
                    contentfulID: true,
                    medals: {
                      select: {
                        id: true,
                        image: true,
                        description: true,
                        level: true,
                      },
                    },
                  },
                },
              },
            },
            therapist: {
              select: {
                firstName: true,
                lastName: true,
                email: true,
                title: true,
              },
            },
          },
        },
      },
    });
  } else {
    return null;
  }
  return userObject
};
