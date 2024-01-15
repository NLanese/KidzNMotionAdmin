import prisma from "@utils/prismaDB";
import { UserInputError } from "apollo-server-errors";

export default {
  Query: {
    getUserMedals: async (_, {childCareID}, context) => {
        if (!context.user) throw new UserInputError("Login required");

        let existingCarePlan = prisma.childCarePlan.findUnique({
            where: {
                id: childCareID
            },
            select: {
                id: true
            }
        })

        if (!existingCarePlan.id){
            throw new UserInputError("No Child Care Plan Found! Cannot retrieve medals.")
        }

        // Get all user meetings
        console.log("Getting Medals From ", childCareID + ".")
        let medals = await prisma.medal.findMany({
            where: {
                childCarePlanId: childCareID
            },
            select: {
                id: true,
                title: true,
                description: true,
                createdAt: true,
                level: true,
            }
        });

        return medals

    },
  },
};
