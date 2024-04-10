import prisma from "@utils/prismaDB";
import { UserInputError } from "apollo-server-errors";


export default {
    Mutation: {
        superSetTherapist: async (_, {childCarePlanID, childID, guardianID, therapistID, superUserKey}, context) => {


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


            // IF NO CHILD CARE PLAN
            if (childCarePlanID === "false"){


              ////////////////////////////////////////
              // CREATE NEW PLAN AND ORG CONNECTION //
              ////////////////////////////////////////

                // Finds Care Plan and updates the connected Therapist
                let newPlan = await prisma.childCarePlan.create({
                  data: {
                    active: true,
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

                let newChild = await prisma.user.update({
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

                
                let newTher = await prisma.user.update({
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

                let fullNewThre = await prisma.user.findUnique({
                  where: {
                    id: therapistID
                  },
                  select: {
                    patientCarePlans: {
                      select: {
                        id: true,
                      }
                    },
                    organizations: {
                      select: {
                        id: true,
                        organization: {
                          select: {
                            id: true
                          }
                        }
                      }
                    }
                  }
                })

                let newOrgUser = await prisma.organizationUser.create({
                  data: {
                    active: true,
                    user: {
                      connect: {
                        id: childID,
                      },
                    },
                    organization: {
                      connect: {
                        id: fullNewThre.organizations[0].organization.id
                      }
                    },
                  },
                });

                let newOrg = await prisma.organization.update({
                  where: {
                    id: fullNewThre.organizations[0].organization.id
                  },
                  data: {
                    organizationUsers: {
                      connect: {
                        id: newOrgUser.id
                      }
                    }
                  }
                })

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
                  active: true
                },
            })

            let childToReassign = await prisma.user.findUnique({
              where: {
                id: childID
              },
              select: {
                id: true,
                firstName: true,
                lastName: true,
                organizations: {
                  select: {
                    id: true,
                    organization: {
                      select: {
                        id: true
                      }
                    }
                  }
                }
              } 
            })

            let fullNewThre = await prisma.user.findUnique({
              where: {
                id: therapistID
              },
              select: {
                patientCarePlans: {
                  select: {
                    id: true,
                  }
                },
                organizations: {
                  select: {
                    id: true,
                    organization: {
                      select: {
                        id: true
                      }
                    }
                  }
                }
              }
            })

            // Checks to see if ChildCarePlan has the same organization of the Therapist 
            if (childToReassign.organizations[0].organization.id === fullNewThre.organizations[0].organization.id){

              // Return now if they are the same
              return childPlanToBeReAssigned
            }

            let newOrgUser = await prisma.organizationUser.update({
              where: {
                id: childToReassign.organizations[0].id
              },
              data: {
                active: true,
                organization: {
                  connect: {
                    id: fullNewThre.organizations[0].organization.id
                  }
                },
              },
            });

            return childPlanToBeReAssigned

        }
    }
}