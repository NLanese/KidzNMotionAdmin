import prisma from "@utils/prismaDB";
import { UserInputError } from "apollo-server-errors";

export default {
    Query: {
        getAllClients: async(_, {}, context) => {
            if (
                context.user.email.toLowerCase() !== "nlanese21@gmail.com" && 
                context.user.email.toLowerCase() !== 'ostrichdeveloper@gmail.com'
            ){
                throw new UserInputError("You do not have Super User Access. Do not try again.")
            }

            let clients = await prisma.user.findAll({
                where: {
                    role: "CHILD"
                }
            })

            return clients
        }
    }
}