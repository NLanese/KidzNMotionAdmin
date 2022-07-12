import prisma from "@utils/prismaDB";
import { defaultTypeResolver } from "graphql";

export default {
  Query: {
    dynamicGetUser: async (_, {}, context) => {
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
                dateOfBirth: true,
                childCarePlans: {
                  where: {
                    active: true
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
                                level: true
                              }
                            }
                          }
                        }
                      }
                    },
                    therapist: {
                      select: {
                        firstName: true,
                        lastName: true,
                        email: true
                      }
                    }
                  }
                }
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
      }

      return userObject;
    },
  },
};
