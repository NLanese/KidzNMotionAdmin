import prisma from "@utils/prismaDB";
import { UserInputError } from "apollo-server-errors";


export default {
    Mutation: {
        superSetTherapist: async (_, {childCarePlanID, childID, guardianID, therapistID, superUserKey}, context) => {

          console.log("Inside superSetTherapist")

            // // Security //
            // if (!context.user) throw new UserInputError("Login required");
            // if (
            //     context.user.email.toLowerCase() !== "nlanese21@gmail.com" ||
            //     context.user.email.toLowerCase() !== "ostrichdeveloper@gmail.com" 
            // ){
            //     throw new UserInputError("Acccess Denied! Super class actions are restricted to Super Users only.")
            // }
            // if (superUserKey !== process.env.SUPER_USER_SECRET_KEY){
            //     throw new UserInputError("Acccess Denied! Super Key was incorrect.")
            // }

            console.log("Passed authorization")

            // IF NO CHILD CARE PLAN
            if (childCarePlanID === "false"){

              console.log("No current Plan")

              /////////////////////
              // CREATE NEW PLAN //
              /////////////////////

                // Finds Care Plan and updates the connected Therapist
                let newPlan = await prisma.childCarePlan.create({
                  data: {
                    child: {
                      connect: {
                        id: childID
                      },
                    },
                    therapist: {
                      connect: {
                        id: therapistID
                      },
                    },
                    level: parseInt(1),
                  },
                });

                console.log("New Plan Created")

              /////////////////////////
              // CREATE NEW CHATROOM //
              /////////////////////////
        
                // Create the chat room for therapist + guardian
                await prisma.chatroom.create({
                  data: {
                    users: {
                      connect: [
                        {
                          id: guardianID
                        },
                        {
                          id: childID
                        },
                      ],
                    },
                  },
                });

                console.log("First chat made")

                // Create chat rooms for child and therapist
                await prisma.chatroom.create({
                  data: {
                    users: {
                      connect: [
                        {
                          id: therapistID
                        },
                        {
                          id: guardianID
                        },
                      ],
                    },
                  },
                });
              
              //////////////////////
              // UPDATE THE USERS //
              //////////////////////

                await prisma.user.update({
                  where: {
                    id: childID,
                  },
                  data: {
                    childCarePlans: {
                      connect: {
                        id: newPlan.id
                      },
                    },
                  },
                });
                
                await prisma.user.update({
                  where: {
                    id: therapistID,
                  },
                  data: {
                    patientCarePlans: {
                      connect: {
                        id: newPlan.id
                      },
                    },
                  },
                });

              //////////////////////
              // RETURNS NEW PLAN //
              //////////////////////
              return newPlan
          }

            // Finds Care Plan and updates the connected Therapist
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