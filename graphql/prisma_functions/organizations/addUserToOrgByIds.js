import prisma from "@utils/prismaDB"

export default async function addUserToOrgByIds(orgId, userId){

    // Raw Invite to Org
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