import prisma from "@utils/prismaDB";
import { UserInputError } from "apollo-server-errors";

export default {
  Query: {
    getAssignments: async (_, {}, context) => {
        console.log("Getting Assignments...")
        if (!context.user) throw new UserInputError("Login required");

        // Get all user meetings
        console.log("Getting user ", context.user.id + ".")
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
                                title: true,
                                childCarePlan: {
                                    select: {
                                        id: true,
                                        child: {
                                            select: {
                                                firstName: true,
                                                lastName: true
                                            }
                                        }
                                    }
                                },
                                videos: {
                                    select: {
                                        title: true,
                                        completed: true,
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
                                        childCarePlan: {
                                            select: {
                                                id: true,
                                                child: {
                                                    select: {
                                                        firstName: true,
                                                        lastName: true
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
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
                                }
                            }
                        },
                    }
                }
            }
        });

        console.log("User Recieved:::")
        console.log(user)

        // If this is a Guardian Account...
        if (user.role === "GUARDIAN"){
            console.log("Guardian User")
            return user.children.map(child => {
                console.log("CHILD")
                console.log(child)
                console.log("CARE PLAN")
                console.log(child.childCarePlans[0])
                return child.childCarePlans[0].assignments.filter(assign => {
                    if (assign.id){
                        return (assign)
                    }
                })
            })
        }
        
        // If this is a Child Account...
        else if (user.role === "CHILD"){
            console.log("Child User")
            return user.childCarePlans[0].assignments.filter((assign) => {
                if (assign.id){
                    return (assign)
                }
            })
        }

        else if (user.role === "THERAPIST"){
            console.log("Therapist User")
            console.log("Patient Care Plans")
            console.log(user.patientCarePlans)
            return user.patientCarePlans.map((pcp) => {
                console.log("Care Plan " + pcp.id + "'s Assignments")
                console.log(pcp.assignments)
               return pcp.assignments.filter((assign) => {
                if (assign.id){
                    return (assign)
                }
               })
            })
        }

    },
  },
};
