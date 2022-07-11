import prisma from "@utils/prismaDB"

export default {
  Query: {
    getUser: async (_, {}, context) => {
      console.log(context)

      const userObject = await prisma.user.findUnique({
        where: {
          userId: "de4e057c-1ea5-40db-a408-a3c8ffc7be69",
        },
        select: {
          userId: true,
          email: true,
          name: true,
          firstName: true,
          lastName: true,
        },
      });
      return userObject;
    },
  },
};
