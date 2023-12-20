import prisma from "@utils/prismaDB";
import { UserInputError } from "apollo-server-errors";

export default {
  Query: {
    getAssignments: async (_, {}, context) => {
        console.error("Getting Assignments...")
        if (!context.user) throw new UserInputError("Login required");

        // Get all user meetings
        let user = await prisma.user.findUnique({
            where: {
            id: context.user.id,
            },
            select: {
            meetings: {
                orderBy: [
                {
                    meetingDateTime: 'asc',
                },
                
                ],
                where: {
                completed: false,
                },
                select: {
                id: true,
                createdAt: true,
                meetingDateTime: true,
                title: true,
                completed: true,
                canceled: true,
                type: true,
                pendingApproval: true,
                approved: true,
                users: true,
                meetingOwnerID: true,
                }
            }
            },
        });

        console.log(user.role)

        // If this is a Guardian Account...
        if (user.role === "GUARDIAN"){
            console.log("Guardian User")
            let assignments = []
            user.children.forEach(child => {
                child.childCarePlans[0].assignments.forEach(assign => {
                    assignments.append(assign)
                })
            })

            console.log("Returning Assignments")
            return assignments
        }
        
        // If this is a Child Account...
        else if (user.role === "CHILD"){
            console.log("Child User")
            let assignments = []
            user.childCarePlans[0].assignments.forEach((assign) => {
                assignments.append(assign)
            })

            console.log("Returning Assignments")
            return assignments
        }

    },
  },
};
