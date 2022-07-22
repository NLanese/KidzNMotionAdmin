import prisma from "@utils/prismaDB";

export default {
    Mutation: {
        sendReferralInvite: async (_, {
            email,
            firstName,
            lastName,
            childFirstName,
            childLastName, 
            childDateOfBirth,
            level, 

        }) => {
            try{
                // Makes sure a user is signed in before attempting mutation
                if (!context.user) throw new UserInputError("Login required");

                // Checks for Conflicting User Emails
                let potentialConflicts = await prisma.user.findMany({
                    where: {
                        email: email
                    }
                })

                if (potentialConflicts.length > 0){
                    throw new Error ("Email is already in use")
                }

                // Validate required fields for each user role
                let missingFields = "";
                if (!childFirstName) {
                    missingFields += "childFirstName, ";
                }
                if (!childLastName) {
                    missingFields += "childLastName, ";
                }
                if (!childDateOfBirth) {
                    missingFields += "childDateOfBirth, ";
                }
                if (!firstName){
                    missingFields += "firstName"
                }
                if (!lastName){
                    missingFields += "lastName"
                }
                if (!level){
                    missingFields += "level"
                }

                if (missingFields.length >= 1){
                    throw new error(`Missing required fields for Therapist / School Admin: (${missingFields}) or organizationInviteKey`)
                }

            }
            catch(err){
                console.log(err)
            }
        }
    }
}