import prisma from "@utils/prismaDB";
import { UserInputError } from "apollo-server-errors";

export default {
  Query: {
    getAssignments: async (_, {}, context) => {
        if (!context.user) throw new UserInputError("Login required");

        // Get all user meetings
        let user = await prisma.user.findUnique({
            where: {
                id: context.user.id,
            },
            select: {
                id: true,
                role: true,
                childCarePlans: {
                    select: {
                        id: true,
                        level: true,
                        assignments: {
                            select: {
                                id: true,
                                dateStart: true,
                                dateDue: true,
                                seen: true,
                                title: true,
                                childCarePlan: {
                                    select: {
                                        id: true,
                                        child: {
                                            select: {
                                                id: true,
                                                firstName: true,
                                                lastName: true
                                            }
                                        }
                                    }
                                },
                                videos: {
                                    select: {
                                        completed: true,
                                        contentfulID: true,
                                        title: true,
                                        id: true,
                                    }
                                }
                            }
                        }
                    }
                },
                                
                children: {
                    select: {
                        firstName: true,
                        lastName: true,
                        id: true,
                        childCarePlans: {
                            select : {
                                id: true,
                                level: true,
                                assignments: {
                                    select: {
                                        id: true,
                                        dateStart: true,
                                        dateDue: true,
                                        title: true,
                                        seen: true,
                                        childCarePlan: {
                                            select: {
                                                id: true,
                                                child: {
                                                    select: {
                                                        id: true,
                                                        firstName: true,
                                                        lastName: true
                                                    }
                                                }
                                            }
                                        },
                                        videos: {
                                            select: {
                                                completed: true,
                                                contentfulID: true,
                                                title: true,
                                                id: true
                                            }
                                        }
                                    }
                                },
                            }
                        }
                    }
                },
                patientCarePlans: {
                    select: {
                        id: true,
                        level: true,
                        assignments: {
                            select: {
                                id: true,
                                dateStart: true,
                                dateDue: true,
                                title: true,
                                seen: true,
                                childCarePlan: {
                                    select: {
                                        id: true,
                                        child: {
                                            select: {
                                                id: true,
                                                firstName: true,
                                                lastName: true
                                            }
                                        }
                                    }
                                },
                                videos: {
                                    select: {
                                        completed: true,
                                        contentfulID: true,
                                        title: true,
                                        id: true,
                                    }
                                }
                            }
                        },
                    }
                }
            }
        });

        // If this is a Guardian Account...
        if (user.role === "GUARDIAN") {
            return user.children.flatMap((child) => {
              return child.childCarePlans[0]?.assignments || [];
            });
          } 
        
        // If this is a Child Account...
        else if (user.role === "CHILD") {
            return user.childCarePlans[0]?.assignments || [];
        }

        // If this is a Therapist Account
        else if (user.role === "THERAPIST") {
            return user.patientCarePlans.flatMap((pcp) => {
              return pcp.assignments || [];
            });
        }

    },
  },
};
