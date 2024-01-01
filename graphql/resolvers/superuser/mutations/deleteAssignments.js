import prisma from "@utils/prismaDB";
import { UserInputError } from "apollo-server-errors";


export default {
    Mutation: {
        superDeleteAssignments: async (_, {idArray, superUserKey}, context) => {

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
            console.log("Passed authorization")
            

            ////////////////////////////////
            // if all EXPIRED assignments //
            if (idArray[0] === "EXPIRED"){
                let allAssignments = await prisma.assignment.findMany()
                let expired = allAssignments.map(ass => {
                  let dateTimeDueDate = new Date(ass.dateDue)
                  console.log(ass.dateDue + " is expired, true or false?")
                  if (dateTimeDueDate < new Date()){
                    console.log("TRUE")
                    return ass
                  }
                })
                
                console.log("Checking Expired")
                console.log(expired)
            }

            if (idArray[0].includes("BEFOFE")){

            }



            return true
        }
    }
}