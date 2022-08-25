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
  let userObject = {};
  if (user.role === "GUARDIAN") {
    userObject = await prisma.user.findUnique({
      where: {
        id: user.id,
      },
      select: {
        id: true,
        firstName: true,
        colorSettings: true,
        lastName: true,
        username: true,
        role: true,
        email: true,
        phoneNumber: true,
        profilePic: true,
        muteAllAssignments: true,
        muteAllMessages: true,
        solo: true,
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
                comments: {
                  select: {
                    id: true,
                    content: true,
                    createdAt: true,
                    therapist: {
                      select: {
                        id: true
                      }
                    },
                    videoId: true,
                    assignmentId: true,

                  }
                },
                child: {
                  select: {
                    role: true,
                    id: true,
                    firstName: true,
                    lastName: true
                  }
                },
                therapist: {
                  select: {
                    id: true,
                    firstName: true,
                    lastName: true,
                    email: true
                  }
                },
                assignments: {
                  select: {
                    id: true,
                    createdAt: true,
                    dateStart: true,
                    dateDue: true,
                    title: true,
                    seen: true,
                    description: true,
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
        chatRooms: {
          select: {
            id: true,
            messages: true,
            users: true
          }
        }
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
        colorSettings: true,
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
            comments: {
              select: {
                id: true,
                content: true,
                createdAt: true,
                therapist: {
                  select: {
                    id: true
                  }
                },
                videoId: true,
                assignmentId: true,

              }
            },
            child: {
              select: {
                role: true,
                id: true,
                firstName: true,
                lastName: true,
                guardian: {
                  select: {
                    role: true,
                    id: true,
                    firstName: true,
                    lastName: true,
                    email: true
                  }
                }
              }
            },
            therapist: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true
              }
            },
            assignments: {
              select: {
                id: true,
                createdAt: true,
                dateStart: true,
                dateDue: true,
                seen: true,
                title: true,
                description: true,
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
                    role: true,
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
                    user: true
                  }
                }
              },
            },
          },
        },
        chatRooms: {
          select: {
            id: true,
            messages: true,
            users: true
          }
        }
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
        colorSettings: true,
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
        colorSettings: true,
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
            therapist: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true
              }
            },
            comments: {
              select: {
                id: true,
                content: true,
                createdAt: true,
                therapist: {
                  select: {
                    id: true
                  }
                },
                videoId: true,
                assignmentId: true,

              }
            },
            assignments: {
              select: {
                id: true,
                createdAt: true,
                dateStart: true,
                dateDue: true,
                seen: true,
                title: true,
                description: true,
               
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
                id: true
              },
            },
          },
        },
      },
    });
  } else {
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
    // console.log("");
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
    // console.log("hi");
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
    // console.log("hi");
  }

  return userObject;
};
