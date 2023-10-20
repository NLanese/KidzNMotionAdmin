import prisma from "@utils/prismaDB";
import { UserInputError } from "apollo-server-errors";

export default {
    Query: {
        getAllClients: async(_, {}, context) => {
            console.log("Inside getAllClients Query...")
            if (
                context.user.email.toLowerCase() !== "nlanese21@gmail.com" && 
                context.user.email.toLowerCase() !== 'ostrichdeveloper@gmail.com'
            ){
                throw new UserInputError("You do not have Super User Access. Do not try again.")
            }

            console.log("Securiry pass check")

            let clients = await prisma.user.findMany({
                where: {
                    role: "CHILD"
                }
            })

            console.log("db action complete\nresult...")
            console.log(clients)

            return clients
        }
    }
}