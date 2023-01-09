import { UserInputError } from "apollo-server-errors";
import { getUserObject } from "@helpers/api/auth";

export default {
  Query: {
    getUser: async (_, {}, context) => {
      if (!context.user) throw new UserInputError("Login required");

      // Check the user status and then determine what fields we will allow
      let userObject = await getUserObject(context.user);

      let subscriptionStatus = "trial";
      let daysLeft;
      if (userObject.ownedOrganization) {
        if (!userObject.ownedOrganization.stripeSubscriptionID) {
          daysLeft = parseInt(
            8 -
              (new Date().getTime() -
                new Date(userObject.ownedOrganization.createdAt).getTime()) /
                (1000 * 3600 * 24)
          );
        }

        if (daysLeft <= 0) {
          subscriptionStatus = "expiredOwner";
        } else {
          subscriptionStatus = "trial";
        }
      } else if (userObject.role === "GUARDIAN") {
        if (
          userObject.role === "GUARDIAN" &&
          userObject.soloStripeSubscriptionID
        ) {
          subscriptionStatus = "active";
        } else {
          daysLeft = parseInt(
            8 -
              (new Date().getTime() -
                new Date(userObject.createdAt).getTime()) /
                (1000 * 3600 * 24)
          );
          if (daysLeft <= 0) {
            subscriptionStatus = "expiredOwner";
          } else {
            subscriptionStatus = "trial";
          }
        }
      } else {
      }

      userObject.subscriptionStatus = subscriptionStatus;

      return userObject;
    },
  },
};
