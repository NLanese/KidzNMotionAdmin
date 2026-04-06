import prisma from "@utils/prismaDB"

export default async function IsConflictingEmails(email){
    // Check for conflicting user
    let potentialUsers = await findUsersByEmail(email)

    let conflict = false;
    potentialUsers.map((userObject) => {
        if (userObject.email.toLowerCase() === email.toLowerCase()) {
            conflict = userObject;
        }
    });
    return conflict
}