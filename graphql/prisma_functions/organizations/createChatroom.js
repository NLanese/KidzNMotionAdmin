import prisma from "@utils/prismaDB"

export default async function createChatroom(userId, therapistId){
    await prisma.chatroom.create({
        data: {
          users: {
            connect: [
              {
                id: userId
              },
              {
                id: therapistId
              },
            ],
          },
        },
      });
}
