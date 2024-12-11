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
            if ( context.user.email.toLowerCase() !== "nlanese21@gmail.com" && context.user.email.toLowerCase() !== "ostrichdeveloper@gmail.com"){
              throw new UserInputError("Acccess Denied! Super class actions are restricted to Super Users only. Nice try, ", context.user.email )
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

            ///////////////////////////////
            // if all BEFORE assignments //
            else if (idArray[0].includes("BEFORE")){
            // FORMAT :: 'BEFORE - MM.DD.YYYY' || 'BEFORE - MM.YYYY' || 'BEFORE  - YYYY'


              // Determines the clear date to delete assignments 
              let dataDate
              let BeforeDateString = idArray[0]
              let BeforeDate = BeforeDateString.split(" - ")[1]
              if (!BeforeDate.includes(".")){
                dataDate = BeforeDate
              }
              else{
                if (BeforeDate.split(".").length > 2){
                  dataDate = BeforeDate.replace(".", "-")
                }
                else{
                  let BeforeDateSplit = BeforeDate.split(".")
                  dataDate = `${BeforeDateSplit[0]}-01-${BeforeDateSplit[1]}`
                }
              }
              // Finds all Assignments before the DataDate
              let allAssignments = await prisma.assignment.findMany()
              let beforeAssignments = allAssignments.filter(ass => {
                let dateTimeDueDate = new Date(ass.dateDue)
                if (dateTimeDueDate < new Date(dataDate)){
                  return ass
                }
              })

              // Deletes the Before Date Assignments
              beforeAssignments.forEach( async (ass) => {
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



            return true
        }
    }
}