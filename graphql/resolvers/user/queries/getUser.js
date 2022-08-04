
import { UserInputError } from "apollo-server-errors";
import { getUserObject } from "@helpers/api/auth"

export default {
  Query: {
    getUser: async (_, {}, context) => {
      if (!context.user) throw new UserInputError("Login required");

      // Check the user status and then determine what fields we will allow
      let userObject = await getUserObject(context.user);


      return userObject;
    },
  },
};
