import prisma from "@utils/prismaDB"

export default {
  Query: {
    getUser: async (_, {}, context) => {
      if (!context.user) throw new UserInputError("Login required");
        
      const userObject = await prisma.user.findUnique({
        where: {
          id: context.user.id,
        },
        select: {
          id: true,
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
