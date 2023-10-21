import prisma from "@utils/prismaDB";
import { UserInputError } from "apollo-server-errors";

export default {
    Query: {
        getAllTherapists: async(_, {}, context) => {
            if (
                context.user.email.toLowerCase() !== "nlanese21@gmail.com" && 
                context.user.email.toLowerCase() !== 'ostrichdeveloper@gmail.com'
            ){
                throw new UserInputError("You do not have Super User Access. Do not try again.")
            }

            // let therapists = await prisma.user.findMany({
            return prisma.user.findMany({
                where: {
                    role: "THERAPIST"
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
                }
            })

            console.log("THERAPIST DATA:::")
            console.log(therapists)

            return therapists
        }
    }
}