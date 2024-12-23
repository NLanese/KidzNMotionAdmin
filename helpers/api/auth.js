var CryptoJS = require("crypto-js");
import { changeTimeZone } from "@helpers/common";
import prisma from "@utils/prismaDB";
import VIDEOS from "@constants/videos";

const findPath = (ob, key) => {
  const path = [];
  const keyExists = (obj) => {
    if (!obj || (typeof obj !== "object" && !Array.isArray(obj))) {
      return false;
    } else if (obj.hasOwnProperty(key)) {
      return true;
    } else if (Array.isArray(obj)) {
      let parentKey = path.length ? path.pop() : "";

      for (let i = 0; i < obj.length; i++) {
        path.push(`${parentKey}[${i}]`);
        const result = keyExists(obj[i], key);
        if (result) {
          return result;
        }
        path.pop();
      }
    } else {
      for (const k in obj) {
        path.push(k);
        const result = keyExists(obj[k], key);
        if (result) {
          return result;
        }
        path.pop();
      }
    }
    return false;
  };

  keyExists(ob);

  return path.join(".");
};

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

    // If there is a Valid token then find the user object and return.
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
      } 

      else {
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
          solo: true,
          createdAt: true,
          soloStripeSubscriptionID: true,
          soloSubscriptionStatus: true,
          organizations: {
            select: {
              organization: {
                select: {
                  id: true,
                  subscriptionStatus: true
                },
              },
            },
          },
          ownedOrganization: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      })
      .catch(error => {
      });

      userObject.tokenId = userJWTToken.id;

      return userObject;
    } 

    // No Valid Token
    else {
      // If not then reurn an access denied
      return null;
    }
  } catch {
    return null;
  }
};

export const getUserObject = async (user) => {
  let userObject = {};

  // GUARDIAN or CHILD
  if (user.role === "GUARDIAN" || user.role === "CHILD") {
    userObject = await prisma.user.findUnique({
      where: {
        id: user.id,
      },
      select: {
        id: true,
        firstName: true,
        colorSettings: true,
        fcmToken: true,
        webAppColorSettings: true,
        lastName: true,
        username: true,
        role: true,
        createdAt: true,
        email: true,
        phoneNumber: true,
        soloStripeSubscriptionID: true,
        soloSubscriptionStatus: true,
        profilePic: true,
        muteAllAssignments: true,
        muteAllMessages: true,
        solo: true,
        accessMessages: true,
        accessSettings: true,
        leaveApp: true,
        childCarePlans: {
          where: {
            active: true,
          },
          select: {
            id: true,
            level: true,
            allVideoStatus: true,
            weeklyVideoStatus: true,
            comments: {
              orderBy: {
                createdAt: "desc",
              },
              select: {
                id: true,
                content: true,
                createdAt: true,
                therapist: {
                  select: {
                    id: true,
                  },
                },
                videoId: true,
                assignmentId: true,
              },
            },
            child: {
              select: {
                role: true,
                id: true,
                firstName: true,
                lastName: true,
                videos: {
                  select: {
                    id: true,
                    contentfulID: true,
                    completed: true,
                    medals: {
                      select: {
                        id: true,
                        image: true,
                        description: true,
                        createdAt: true,
                        level: true,
                      },
                    },
                  },
                },
              },
            },
            therapist: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
              },
            },
            assignments: {
              select: {
                id: true,
                createdAt: true,
                dateStart: true,
                dateDue: true,
                title: true,
                seen: true,
                notificationSent: true,
                description: true,
                childCarePlan: {
                  select: {
                    id: true,
                    childId: true,
                  },
                },
                videos: {
                  select: {
                    id: true,
                    contentfulID: true,
                    completed: true,
                    medals: {
                      select: {
                        id: true,
                        image: true,
                        description: true,
                        createdAt: true,
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
                id: true,
                lastName: true,
                title: true,
                email: true,
              },
            },
          },
        },
        children: {
          where: {
            active: true,
          },
          select: {
            id: true,
            role: true,
            firstName: true,
            accessMessages: true,
            email: true,
            username: true,
            accessSettings: true,
            leaveApp: true,
            lastName: true,
            childDateOfBirth: true,
            diagnosis: true,
            childCarePlans: {
              where: {
                active: true,
              },
              select: {
                id: true,
                level: true,
                blockedVideos: true,
                allVideoStatus: true,
                weeklyVideoStatus: true,
                comments: {
                  orderBy: {
                    createdAt: "desc",
                  },
                  select: {
                    id: true,
                    content: true,
                    createdAt: true,
                    therapist: {
                      select: {
                        id: true,
                      },
                    },
                    videoId: true,
                    assignmentId: true,
                  },
                },
                child: {
                  select: {
                    role: true,
                    id: true,
                    firstName: true,
                    lastName: true,
                    videos: {
                      select: {
                        id: true,
                        contentfulID: true,
                        completed: true,
                        medals: {
                          select: {
                            id: true,
                            image: true,
                            description: true,
                            level: true,

                            createdAt: true,
                          },
                        },
                      },
                    },
                  },
                },
                therapist: {
                  select: {
                    id: true,
                    firstName: true,
                    lastName: true,
                    email: true,
                    profilePic: true,
                  },
                },
                assignments: {
                  select: {
                    id: true,
                    createdAt: true,
                    dateStart: true,
                    dateDue: true,
                    title: true,
                    seen: true,
                    notificationSent: true,
                    description: true,
                    childCarePlan: {
                      select: {
                        childId: true,
                      },
                    },
                    videos: {
                      select: {
                        id: true,
                        contentfulID: true,
                        completed: true,
                        medals: {
                          select: {
                            id: true,
                            image: true,
                            description: true,
                            level: true,
                            createdAt: true,
                          },
                        },
                      },
                    },
                  },
                },
                therapist: {
                  select: {
                    firstName: true,
                    id: true,
                    lastName: true,
                    title: true,
                    email: true,
                  },
                },
              },
            },
            chatRooms: {
              select: {
                id: true,
                messages: {
                  orderBy: {
                    createdAt: "asc",
                  },
                  select: {
                    id: true,
                    content: true,
                    sentAt: true,
                    sentBy: true,
                    createdAt: true,
                    chatroomId: true,
                  },
                },
                active: true,
                createdAt: true,
                users: true,
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
                stripeSubscriptionID: true,
                subscriptionStatus: true,
                phoneNumber: true,
                createdAt: true,
              },
            },
          },
        },
        chatRooms: {
          select: {
            id: true,
            messages: {
              orderBy: {
                createdAt: "asc",
              },
              select: {
                id: true,
                content: true,
                sentAt: true,
                sentBy: true,
                createdAt: true,
                chatroomId: true,
              },
            },
            active: true,
            createdAt: true,
            users: true,
          },
        },
        guardian: {
          select: {
            firstName: true,
            role: true,
            lastName: true,
            username: true,
            email: true,
            id: true,
          },
        },
      },
    });
  }

  // THERAPIST
  else if (user.role === "THERAPIST") {
    userObject = await prisma.user.findUnique({
      where: {
        id: user.id,
      },
      select: {
        id: true,
        title: true,
        firstName: true,
        fcmToken: true,
        lastName: true,
        colorSettings: true,
        webAppColorSettings: true,
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
            blockedVideos: true,
            comments: {
              orderBy: {
                createdAt: "desc",
              },
              select: {
                id: true,
                content: true,
                createdAt: true,
                therapist: {
                  select: {
                    id: true,
                  },
                },
                videoId: true,
                assignmentId: true,
              },
            },
            child: {
              select: {
                role: true,
                id: true,
                firstName: true,
                lastName: true,
                profilePic: true,
                childDateOfBirth: true,
                diagnosis: true,
                assignMuted: true,
                messagesMuted: true,
                videos: {
                  select: {
                    id: true,
                    contentfulID: true,
                    completed: true,
                    medals: {
                      select: {
                        id: true,
                        image: true,
                        description: true,
                        level: true,
                        createdAt: true,
                      },
                    },
                  },
                },
                guardian: {
                  select: {
                    role: true,
                    id: true,
                    firstName: true,
                    lastName: true,
                    phoneNumber: true,
                    email: true,
                    messagesMuted: true,
                    assignMuted: true,
                  },
                },
                childCarePlans: {
                  select: {
                    id: true,
                  },
                },
              },
            },
            therapist: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
              },
            },
            assignments: {
              select: {
                id: true,
                createdAt: true,
                dateStart: true,
                dateDue: true,
                seen: true,
                notificationSent: true,
                title: true,
                description: true,
                childCarePlan: {
                  select: {
                    childId: true,
                  },
                },
                videos: {
                  select: {
                    id: true,
                    contentfulID: true,
                    completed: true,
                    medals: {
                      select: {
                        id: true,
                        image: true,
                        description: true,
                        createdAt: true,
                        level: true,
                      },
                    },
                  },
                },
                childCarePlan: {
                  select: {
                    child: {
                      select: {
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
        ownedOrganization: {
          select: {
            id: true,
            createdAt: true,
            name: true,
            phoneNumber: true,
            organizationType: true,
            stripeSubscriptionID: true,
            subscriptionStatus: true,
            active: true,
            organizationUsers: {
              select: {
                id: true,
                active: true,
                user: {
                  select: {
                    role: true,
                    id: true,
                    role: true,
                    firstName: true,
                    lastName: true,
                    email: true,
                    guardianId: true,
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
                stripeSubscriptionID: true,
                subscriptionStatus: true,
                phoneNumber: true,
                organizationUsers: {
                  select: {
                    id: true,
                    active: true,

                    user: {
                      select: {
                        role: true,
                        firstName: true,
                        lastName: true,
                        id: true,
                        childDateOfBirth: true,
                        diagnosis: true,
                        phoneNumber: true,
                        email: true,
                        profilePic: true,
                        guardianId: true,
                        children: {
                          select: {
                            childCarePlans: {
                              where: {
                                active: true,
                              },
                              select: {
                                id: true,
                                therapist: {
                                  select: {
                                    id: true,
                                  },
                                },
                              },
                            },
                          },
                        },
                      },
                    },
                  },
                },
                organizationInviteKeys: {
                  where: {
                    active: true,
                  },
                  select: {
                    id: true,
                  },
                },
              },
            },
          },
        },
        chatRooms: {
          select: {
            id: true,
            messages: {
              orderBy: {
                createdAt: "asc",
              },
              select: {
                id: true,
                content: true,
                sentAt: true,
                sentBy: true,
                createdAt: true,
                chatroomId: true,
              },
            },
            active: true,
            createdAt: true,
            users: true,
          },
        },
      },
    });
  }

  // ADMIN
  else if (user.role === "ADMIN") {
    userObject = await prisma.user.findUnique({
      where: {
        id: user.id,
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        role: true,
        fcmToken: true,
        email: true,
        colorSettings: true,
        phoneNumber: true,
        profilePic: true,
        webAppColorSettings: true,
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
                    guardianId: true,
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
                stripeSubscriptionID: true,
                subscriptionStatus: true,
                phoneNumber: true,
                organizationUsers: {
                  select: {
                    id: true,
                    active: true,
                    user: {
                      select: {
                        id: true,
                        role: true,
                        firstName: true,
                        guardianId: true,
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
  }
  else {
    return null;
  }

  // THERAPIST
  try {
    // Loop through and add the video files into all requests
    if (userObject.patientCarePlans) {
      // Loop through patient care plans
      for (
        var patientCarePlanIndex = 0;
        patientCarePlanIndex < userObject.patientCarePlans.length;
        patientCarePlanIndex++
      ) {
        for (
          var assignmentIndex = 0;
          assignmentIndex <
          userObject.patientCarePlans[patientCarePlanIndex].assignments.length;
          assignmentIndex++
        ) {
          for (
            var videoIndex = 0;
            videoIndex <
            userObject.patientCarePlans[patientCarePlanIndex].assignments[
              assignmentIndex
            ].videos.length;
            videoIndex++
          ) {
            let videoObjectPath =
              userObject.patientCarePlans[patientCarePlanIndex].assignments[
                assignmentIndex
              ].videos[videoIndex];
            if (VIDEOS[videoObjectPath.contentfulID]) {
              videoObjectPath.file = VIDEOS[videoObjectPath.contentfulID];
            }
          }
        }
      }
    }
  } catch {
  }

  // GUARDIAN
  // Loop through and add the video files into all requests
  try {
    if (userObject.children) {
      for (
        var childIndex = 0;
        childIndex < userObject.children.length;
        childIndex++
      ) {
        for (
          var childCarePlanIndex = 0;
          childCarePlanIndex <
          userObject.children[childIndex].childCarePlans.length;
          childCarePlanIndex++
        ) {
          for (
            var assignmentIndex = 0;
            assignmentIndex <
            userObject.children[childIndex].childCarePlans[childCarePlanIndex]
              .assignments.length;
            assignmentIndex++
          ) {
            for (
              var videoIndex = 0;
              videoIndex <
              userObject.children[childIndex].childCarePlans[childCarePlanIndex]
                .assignments[assignmentIndex].videos.length;
              videoIndex++
            ) {
              let videoObjectPath =
                userObject.children[childIndex].childCarePlans[
                  childCarePlanIndex
                ].assignments[assignmentIndex].videos[videoIndex];
              if (VIDEOS[videoObjectPath.contentfulID]) {
                videoObjectPath.file = VIDEOS[videoObjectPath.contentfulID];
              }
            }
          }
        }
      }
    }
  } catch {
  }

  // CHILD
  // Loop through and add the video files into all requests
  try {
    if (userObject.childCarePlans) {
      for (
        var childCarePlanIndex = 0;
        childCarePlanIndex < userObject.childCarePlans.length;
        childCarePlanIndex++
      ) {
        for (
          var assignmentIndex = 0;
          assignmentIndex <
          userObject.childCarePlans[childCarePlanIndex].assignments.length;
          assignmentIndex++
        ) {
          for (
            var videoIndex = 0;
            videoIndex <
            userObject.childCarePlans[childCarePlanIndex].assignments[
              assignmentIndex
            ].videos.length;
            videoIndex++
          ) {
            let videoObjectPath =
              userObject.childCarePlans[childCarePlanIndex].assignments[
                assignmentIndex
              ].videos[videoIndex];
            if (VIDEOS[videoObjectPath.contentfulID]) {
              videoObjectPath.file = VIDEOS[videoObjectPath.contentfulID];
            }
          }
        }
      }
    }
  } catch {
  }

  // Super User
  // if (
  //   userObject.email.toLowerCase() === "nlanese21@gmail.com" ||
  //   userObject.email.toLowerCase() === "ostrichdeveloper@gmail.com" ||
  //   userObject.email.toLowerCase() === "ostrichtestdev@gmail.com"
  // ){
  //   userObject.subscriptionStatus = "active"
  //   if (userObject.ownedOrganization){
  //     userObject.ownedOrganization.subscriptionStatus = "active"
  //   }
  //   if (userObject.organization){
  //     userObject.organization = "true"
  //   }
  // }

  return userObject;
};
