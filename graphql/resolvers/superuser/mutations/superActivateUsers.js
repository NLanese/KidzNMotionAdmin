import prisma from "@utils/prismaDB";
import { UserInputError } from "apollo-server-errors";


export default {
    Mutation: {
        superActivateUsers: async (_, { superUserKey, idArray }, context) => {

          console.log("Inside superSetTherapist")

            //////////////
            // Security // 
            if (!context.user){
              throw new UserInputError("Login required");
            }
            if ( context.user.email.toLowerCase() !== "nlanese21@gmail.com" ){
              throw new UserInputError("Acccess Denied! Super class actions are restricted to Super Users only.")
            }
            if (superUserKey !== `${process.env.SUPER_USER_SECRET_KEY}`){
              throw new UserInputError("Acccess Denied! Super Key was incorrect.")
            }

            if (idArray[0] === "all"){
                const allUsers = await prisma.user.findMany({
                    select: {
                        id: true, 
                        soloSubscriptionStatus: true
                    }
                })
                .then((allUsers) => {
                    console.log(allUsers)
                    allUsers.forEach( async (userID) => {
                        await prisma.user.update({
                            where: {
                                id: userID.id
                            },
                            data: {
                                soloSubscriptionStatus: "active"
                            }
                        })
                    });
                })
            }

            return
        }
    }
}