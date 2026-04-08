import prisma from "@utils/prismaDB"

export default async function addUserToOrgByIds(orgId, userId){

    // Raw Invite to Org
    if (typeof orgId === "string"){
        return await prisma.organizationUser.create({
            data: {
              active: true,
              user: {
                connect: {
                  id: userId,
                },
              },
              organization: {
                connect: {
                  id: orgId,
                },
              },
            }
        })
    }

    // Full Invite to Org with Therapist
    else{
        
    }
}