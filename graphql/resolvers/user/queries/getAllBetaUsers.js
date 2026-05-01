import prisma from "@utils/prismaDB";
import { UserInputError } from "apollo-server-errors";


const resolvers = {
    Query: {
        getAllBetaUsers: async (_, {}, context) => {
            // LOGIN CHECK
            if (!context.user) throw new UserInputError("Login required");

            let betaTesters = await prisma.user.findMany({
                where: {
                    lastName: "BetaTestLastName",
                },
                select: {
                    id: true,
                    firstName: true,
                    lastName: true
                },
            });
            return betaTesters;
        },
    },
};
export default resolvers;