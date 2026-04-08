import prisma from "@utils/prismaDB"
import createParentAndChild from "./createParentAndChild";

const allVideos = await prisma.video.findMany;

export default async function createUserAndConnections(
    email, encryptedPassword, username,
    role, title, phoneNumber, firstName, lastName,
    organizationInviteKey
){
    var guardianUser;
    var childUser;

    if (role === "GUARDIAN"){
        if (!organizationInviteKey){
            var responseFromCreation = await createParentAndChild(
                email, encryptedPassword, username,
                role, title, phoneNumber, firstName, lastName,
                organizationInviteKey, true
            )
            guardianUser = responseFromCreation.guardian
            childUser = responseFromCreation.childUser
        }
        else{
            
        }
    }
}
