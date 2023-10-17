import prisma from "@utils/prismaDB";
import { UserInputError } from "apollo-server-errors";


export default {
    Mutation: {
        superSetTherapist: async (_, {childCarePlanID, therapistID, superUserKey}, context) => {


            // Security //
            if (!context.user) throw new UserInputError("Login required");
            if (
                context.user.email.toLowerCase() !== "nlanese21@gmail.com" ||
                context.user.email.toLowerCase() !== "ostrichdeveloper@gmail.com" 
            ){
                throw new UserInputError("Acccess Denied! Super class actions are restricted to Super Users only.")
            }
            if (superUserKey !== process.env.SUPER_USER_SECRET_KEY){
                throw new UserInputError("Acccess Denied! Super Key was incorrect.")
            }

            // Finds Child
            let childPlanToBeReAssigned = await prisma.childCarePlan.update({
                where: {
                    id: childCarePlanID,
                  },
                  data: {
                    therapist: {
                      connect: {
                        id: therapistID
                      }
                    },
                  },
            })

            return childPlanToBeReAssigned

        }
    }
}