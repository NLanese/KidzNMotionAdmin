import prisma from "@utils/prismaDB"
import createParentAndChild from "./createParentAndChild";
import findOrgByIdOrCode from "../organizations/findOrgByCode";
import addUserToOrgByIds from "../organizations/addUserToOrgByIds";

const allVideos = await prisma.video.findMany;

export default async function createUserAndConnections(
    email, encryptedPassword, username,
    role, title, phoneNumber, firstName, lastName,
    orgId, organizationInviteKey
){
    var guardianUser;
    var childUser;

    if (role === "GUARDIAN"){
        var responseFromCreation = await createParentAndChild(
            email, encryptedPassword, username,
            role, title, phoneNumber, firstName, lastName,
            (organizationInviteKey ? true : false)
        )
        
        guardianUser = responseFromCreation.guardian
        childUser = responseFromCreation.child

        if (orgId && !organizationInviteKey){
            addUserToOrgByIds(organizationInviteKey, guardianUser.id)
            addUserToOrgByIds(organizationInviteKey, childUser.id)
        }
    }
}
