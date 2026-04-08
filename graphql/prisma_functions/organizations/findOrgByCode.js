import prisma from "@utils/prismaDB"

export default async function findOrgByIdOrCode(code){
    return await prisma.organization.findUnique({
        where: {
            id: code
        },
        select: {
            id: true,
            name: true,
            active: true,
            owner: {
                select: {
                    email: true,
                    firstName: true,
                    lastName: true
                }
            }
        }
    })
}