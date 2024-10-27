import prisma from "@utils/prismaDB";
import { UserInputError } from "apollo-server-errors";


export default {
    Mutation: {
        superDeleteAssignments: async (_, {idArray, superUserKey}, context) => {

            //////////////
            // Security // 
            if (!context.user){
              throw new UserInputError("Login required");
            }
            if ( context.user.email.toLowerCase() !== "nlanese21@gmail.com" || "ostrichdeveloper@gmail.com"){
              throw new UserInputError("Acccess Denied! Super class actions are restricted to Super Users only.")
            }
            if (superUserKey !== `${process.env.SUPER_USER_SECRET_KEY}`){
              throw new UserInputError("Acccess Denied! Super Key was incorrect.")
            }
            

            ////////////////////////////////
            // if all EXPIRED assignments //
            if (idArray[0] === "EXPIRED"){

              // Finds all Expired Assignments
              let allAssignments = await prisma.assignment.findMany()
              let expired = allAssignments.map(ass => {
                let dateTimeDueDate = new Date(ass.dateDue)
                if (dateTimeDueDate < new Date()){
                  return ass
                }
              })

              expired.forEach( async (ass) => {
                await prisma.assignment.delete({
                  where: {
                    id: ass.id
                  }
                })
                .then( resolved => {
                })
                .catch( error => {
                  console.warn("ERROR")
                  console.warn((error))
                })
              });

            }




            if (idArray[0].includes("BEFOFE")){

            }



            return true
        }
    }
}