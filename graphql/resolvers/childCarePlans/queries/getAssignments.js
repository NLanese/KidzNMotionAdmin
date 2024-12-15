    import prisma from "@utils/prismaDB";
    import { UserInputError } from "apollo-server-errors";

    
    const resolvers = {
    Query: {
        getAssignments: async (_, __, context) => {
        // Ensure the user is authenticated
        if (!context.user) throw new UserInputError("Login required");

        // Fetch the user along with nested relationships
        const user = await prisma.user.findUnique({
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
                            lastName: true,
                            },
                        },
                        },
                    },
                    videos: {
                        select: {
                        completed: true,
                        contentfulID: true,
                        title: true,
                        id: true,
                        },
                    },
                    },
                },
                },
            },
            children: {
                select: {
                firstName: true,
                lastName: true,
                id: true,
                childCarePlans: {
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
                                lastName: true,
                                },
                            },
                            },
                        },
                        videos: {
                            select: {
                            completed: true,
                            contentfulID: true,
                            title: true,
                            id: true,
                            },
                        },
                        },
                    },
                    },
                },
                },
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
                            lastName: true,
                            },
                        },
                        },
                    },
                    videos: {
                        select: {
                        completed: true,
                        contentfulID: true,
                        title: true,
                        id: true,
                        },
                    },
                    },
                },
                },
            },
            },
        });

        // Check the user's role and return assignments based on it
        if (!user) throw new UserInputError("User not found");

        if (user.role === "GUARDIAN") {
            // For Guardian accounts, return children's assignments
            return user.children.flatMap((child) => {
            return child.childCarePlans[0]?.assignments || [];
            });
        } else if (user.role === "CHILD") {
            // For Child accounts, return the child's own assignments
            return user.childCarePlans[0]?.assignments || [];
        } else if (user.role === "THERAPIST") {
            // For Therapist accounts, return patient care plan assignments
            return user.patientCarePlans.flatMap((pcp) => {
            return pcp.assignments || [];
            });
        }

        // Default: Return an empty array if no role matches
        return [];
        },
    },
    };
    export default resolvers;