import prisma from "@utils/prismaDB";
import { UserInputError } from "apollo-server-errors";

export default {
    Query: {
        getAllTherapists: async(_, {}, context) => {
            if (
                context.user.email.toLowerCase() !== "nlanese21@gmail.com" && 
                context.user.email.toLowerCase() !== 'ostrichdeveloper@gmail.com'
            ){
                throw new UserInputError("You do not have Super User Access. Do not try again.")
            }

            // let therapists = await prisma.user.findMany({
            return prisma.user.findMany({
                where: {
                    role: "THERAPIST"
                }
            })

            console.log("THERAPIST DATA:::")
            console.log(therapists)

            return therapists
        }
    }
}