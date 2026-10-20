import { UserInputError } from "apollo-server-errors";
import { getUserObject } from "@helpers/api/auth";

const resolvers = {
  Query: {
    getUser: async (_, {}, context) => {
      // LOGIN CHECK
      if (!context.user) throw new UserInputError("Login required");

      // SELECT ALL USER FIELDS
      let userObject = await getUserObject(context.user);

      // Kidz-N-Motion is currently free for everyone, so every user is Active.
      userObject.subscriptionStatus = "Active";

      return userObject;
    },
  },
};
export default resolvers;
