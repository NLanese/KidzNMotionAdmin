import prisma from "@utils/prismaDB";
import { UserInputError } from "apollo-server-errors";

export default {
    Query: {
        getAllClients: async(_, {}, context) => {
            if (
                context.user.email.toLowerCase() !== "nlanese21@gmail.com" && 
                context.user.email.toLowerCase() !== 'ostrichdeveloper@gmail.com'
            ){
                throw new UserInputError("You do not have Super User Access. Do not try again.")
            }

            let clients = await prisma.user.findMany({
              where: {
                  role: {
                      in: ["CHILD", "GUARDIAN"] // Correct usage of the `in` operator
                  }
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
                        guardian: {
                            select: {
                                id: true
                            }
                        }
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
              }
            })

            return clients
        }
    }
}