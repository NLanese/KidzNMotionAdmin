import prisma from "@utils/prismaDB"
import findUsersByEmail from "./findManyByEmail"

export default async function IsConflictingEmails(email){

    // Check for conflicting user
    let potentialUsers = await findUsersByEmail(email)
    let conflict = false
    console.log("Conflicts? ", potentialUsers)

    potentialUsers.map((userObject) => {
        if (userObject.email.toLowerCase() === email.toLowerCase()) {
            conflict = userObject;
        }
    });
    if (conflict && conflict.length > 0){
        console.log("Conflict")
        return true
    }
    else 
        console.log("No conflict")
        return false
}