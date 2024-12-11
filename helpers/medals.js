import prisma from "@utils/prismaDB";
import VIDEOS from "@constants/videos";


export function getAllMedalTypes() {
    return    
}

export async function makeMedal(level, videoId, childCareId){
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
    // .then(res => {

    // })
}