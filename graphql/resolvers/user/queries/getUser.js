import prisma from "@utils/prismaDB";

export default {
  Query: {
    getUser: async (_, {}, context) => {
      if (!context.user) throw new UserInputError("Login required");

      const userObject = await prisma.user.findUnique({
        where: {
          id: context.user.id,
        },
        include: {
          ownedOrganization: true,
          patientCarePlans: true,
          chatRooms: true,
          children: {
              include: {
                childCarePlans: true 
              }
          },
      }
      });
      console.log(userObject.children[0].childCarePlans)
      return userObject;
    },
  },
};
