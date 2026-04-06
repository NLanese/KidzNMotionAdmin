import prisma from "@utils/prismaDB";

export default async function findUsersByEmail(email){
    let potentialUsers = await prisma.user.findMany({
        where: {
          email: email,
        },
        select: {
          email: true,
        },
    });
    return potentialUsers
}