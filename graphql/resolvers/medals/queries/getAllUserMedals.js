import prisma from "@utils/prismaDB";
import { UserInputError } from "apollo-server-errors";

export default {
  Query: {
    getAllUserMedals: async (_, { childCareID }, context) => {

        if (!context.user) throw new UserInputError("Login required");

        let existingCarePlan = await prisma.childCarePlan.findUnique({
            where: {
                id: childCareID
            },
            select: {
                id: true,
                therapistId: true,
                child: { select: { id: true, guardianId: true } },
            }
        })

        if (!existingCarePlan || !existingCarePlan.id){
            throw new UserInputError("No Child Care Plan Found! Cannot retrieve medals.")
        }

        // Only the child, their parent, or their therapist may see these medals.
        const me = context.user.id;
        const allowed =
            context.user.role === "ADMIN" ||
            existingCarePlan.therapistId === me ||
            existingCarePlan.child?.id === me ||
            existingCarePlan.child?.guardianId === me;
        if (!allowed) throw new UserInputError("Access denied");

        // Get all user meetings
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
