import prisma from "@utils/prismaDB"
import createChatroom from "./createChatroom";

export default async function addUserWithTherapistToOrgByInvite(orgCode, userId, childId){

    // Finds all Org Invites that are Active (Should be an array of length 1)
    organizationInvite = await prisma.organizationInviteKey.findUnqiue({
        where: {
            id: orgCode,
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

            let therapistId = organizationInvite[0].additionalInformation.childTherapistID

            // Creates Care Plan linked with Therapist
            await prisma.childCarePlan.create({
                data: {
                  child: {
                    connect: {
                      id: childUser.id,
                    },
                  },
                  therapist: {
                    connect: {
                      id: therapistId,
                    },
                  },
                  level: parseInt(
                    organizationInvite[0].additionalInformation.childLevel
                  ),
                },
            });

            // Creates Chatrooms
            await createChatroom(childId, therapistId)
            await createChatroom(userId, therapistId)
        }

        // Deactivates Invite
        await prisma.organizationInviteKey.update({
            where: {
              id: organizationInviteKey,
            },
            data: {
              active: false,
            },
          });
    }


    // NO ACTIVE INVITES
    else{
        
        // Creates Care Plan linked with Therapist
        await prisma.childCarePlan.create({
            data: {
              child: {
                connect: {
                  id: childUser.id,
                },
              },
              level: 2
            },
        });
    }
}