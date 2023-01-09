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
          if (daysLeft <= 0) {
            subscriptionStatus = "expiredOwner";
          } else {
            subscriptionStatus = "trial";
          }
        } else {
          subscriptionStatus = "active";
        }
      } else if (
        userObject.role === "GUARDIAN" &&
        userObject.soloStripeSubscriptionID
      ) {
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
        if (userObject.organizations) {
          if (userObject.organizations[0]) {
            const organization = userObject.organizations[0].organization;

            if (!organization.stripeSubscriptionID) {
              daysLeft = parseInt(
                8 -
                  (new Date().getTime() -
                    new Date(organization.createdAt).getTime()) /
                    (1000 * 3600 * 24)
              );
              console.log(daysLeft);
              if (daysLeft <= 0) {
                subscriptionStatus = "expiredNotOwner";
              } else {
                subscriptionStatus = "trial";
              }
            } else {
              subscriptionStatus = "active";
            }
          }
        }
      }

      userObject.subscriptionStatus = subscriptionStatus;

      console.log(subscriptionStatus);
      return userObject;
    },
  },
};
