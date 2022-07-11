export default {
  Query: {
    getUser: async (_, { id }, context) => {
      return {
        id: id,
      };
    },
  },
};
