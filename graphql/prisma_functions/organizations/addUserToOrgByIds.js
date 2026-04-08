import prisma from "@utils/prismaDB"

export default async function addUserToOrgByIds(orgId, userId){

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