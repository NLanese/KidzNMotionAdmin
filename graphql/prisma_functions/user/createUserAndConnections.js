import { UserInputError } from "apollo-server-errors";

import createParentAndChild from "./createParentAndChild";
import addUserToOrgByIds from "../organizations/addUserToOrgByIds";
import addUserWithTherapistToOrgByInvite from "../organizations/addUserWithTherapistToOrgByInvite";


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
        else{
            addUserWithTherapistToOrgByInvite(organizationInviteKey, guardianUser.id, childUser.id)
        }
    }
}
