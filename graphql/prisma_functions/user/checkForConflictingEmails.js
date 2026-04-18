import prisma from "@utils/prismaDB"
import findUsersByEmail from "./findManyByEmail"

export default async function IsConflictingEmails(email){

    // Check for conflicting user
    let potentialUsers = await findUsersByEmail(email)
    console.log("Conflicts? ", potentialUsers)

    let conflict = false;
    potentialUsers.map((userObject) => {
        if (userObject.email.toLowerCase() === email.toLowerCase()) {
            conflict = userObject;
        }
    });
    return (conflict && conflict.length > 0) ? true : false
}