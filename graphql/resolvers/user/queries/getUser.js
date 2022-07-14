import prisma from "@utils/prismaDB";
import { UserInputError } from "apollo-server-errors";

export default {
  Query: {
    getUser: async (_, {}, context) => {
      if (!context.user) throw new UserInputError("Login required");

      // Check the user status and then determine what fields we will allow
      let userObject = {};

      if (context.user.role === "GUARDIAN") {
        userObject = await prisma.user.findUnique({
          where: {
            id: context.user.id,
          },
          select: {
            id: true,
            firstName: true,
            lastName: true,
            role: true,
            email: true,
            phoneNumber: true,
            children: {
              where: {
                active: true,
              },
              select: {
                id: true,
                firstName: true,
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
      } else if (context.user.role === "THERAPIST") {
        userObject = await prisma.user.findUnique({
          where: {
            id: context.user.id,
          },
          select: {
            id: true,
            firstName: true,
            lastName: true,
            role: true,
            email: true,
            phoneNumber: true,
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
                        lastName: true
                      }
                    }
                  }
                }
              }
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
      } else if (context.user.role === "SCHOOL_ADMIN") {
        userObject = await prisma.user.findUnique({
          where: {
            id: context.user.id,
          },
          select: {
            id: true,
            firstName: true,
            lastName: true,
            role: true,
            email: true,
            phoneNumber: true,
            ownedOrganization: {
              select: {
                id: true,
                createdAt: true,
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
                        lastName: true
                      }
                    }
                  }
                }
              }
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
                            lastName: true
                          }
                        }
                      }
                    }
                  },
                },
              },
            },
          },
        });
      } else {
        return null;
      }

      return userObject;
    },
  },
};
