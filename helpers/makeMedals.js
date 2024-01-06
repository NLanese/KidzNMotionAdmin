import prisma from "@utils/prismaDB";

export default async function makeMedal(level, videoId, childCareId){
    return await prisma.medal.create({
        data: {
            title: videoId,
            level: level,
            description: "",
            childCarePlan: {
                connect: {
                  id: childCareId,
                },
              },
        }
    })
}