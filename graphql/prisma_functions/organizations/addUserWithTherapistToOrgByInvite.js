import prisma from "@utils/prismaDB"

export default async function addUserWithTherapistToOrgByInvite(orgCode, userId, childId){

    // Finds all Org Invites that are Active (Should be an array of length 1)
    organizationInvite = await prisma.organizationInviteKey.findUnqiue({
        where: {
            id: organizationInviteKey,
            active: true,
        },
        select: {
            organizationId: true,
            additionalInformation: true,
            active: true
        },
    });

    // IF FOUND ACTIVE INVITE
    if (organizationInvite[0]) {

        // Creates Guardian Org Connection
        let orgUser = await prisma.organizationUser.create({
            data: {
              active: true,
              user: {
                connect: {
                  id: baseUser.id,
                },
              },
              organization: {
                connect: {
                  id: organizationInvite[0].organizationId,
                },
              },
            },
        });

        // Creates Child Org Connection
        let childOrgUser = await prisma.organizationUser.create({
            data: {
              active: true,
              user: {
                connect: {
                  id: childUser.id,
                },
              },
              organization: {
                connect: {
                  id: organizationInvite[0].organizationId,
                },
              },
            },
        });

        // If There is an Assigned Therapist on the Invite 
        if (organizationInvite[0].additionalInformation.childTherapistID) {
    }


    // NO ACTIVE INVITES
    else{
        
    }
}