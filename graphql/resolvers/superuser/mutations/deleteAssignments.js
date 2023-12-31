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
                let allAssignments = prisma.assignment.findMany()
                console.log(allAssignments)
            }



            return true
        }
    }
}