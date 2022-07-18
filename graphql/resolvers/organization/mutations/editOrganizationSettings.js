import prisma from "@utils/prismaDB";

export default {
  Mutation: {
    editOrganizationSettings: async (_, { name, phoneNumber }, context) => {
      if (!context.user) throw new UserInputError("Login required");

      if (!context.user.ownedOrganization)
        throw new UserInputError("Owner Role required");

      await prisma.organization.update({
        where: {
          id: context.user.ownedOrganization.id,
        },
        data: {
          name: name,
          phoneNumber: phoneNumber,
        },
      });
      return {};
    },
  },
};