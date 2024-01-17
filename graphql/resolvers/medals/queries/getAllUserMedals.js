import prisma from "@utils/prismaDB";
import { UserInputError } from "apollo-server-errors";

export default {
  Query: {
    getAllUserMedals: async (_, { childCareID }, context) => {
        console.log("=====\nINSIDE GET ALL USER MEDALS")

        if (!context.user) throw new UserInputError("Login required");

        console.log("Checking if Care Plan " + childCareID + " Exists")
        let existingCarePlan = await prisma.childCarePlan.findUnique({
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
        console.log("Care Plan Exists")

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
