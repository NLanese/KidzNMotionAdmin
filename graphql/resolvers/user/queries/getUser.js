import { UserInputError } from "apollo-server-errors";
import { getUserObject } from "@helpers/api/auth";

const calculateDaysLeft = (createdAt) => {
  return parseInt(
    8 - (new Date().getTime() - new Date(createdAt).getTime()) / (1000 * 3600 * 24)
  );
};

const getSubscriptionStatusForOwner = (userObject) => {
  if (!userObject.ownedOrganization.stripeSubscriptionID) {
    const daysLeft = calculateDaysLeft(userObject.ownedOrganization.createdAt);
    return daysLeft <= 0 ? "active" : "trial";
  }
  return "active";
};

const getSubscriptionStatusForGuardian = (userObject) => {
  let subscriptionStatus = "trial";
  const daysLeft = calculateDaysLeft(userObject.createdAt);

  // Check solo subscription
  if (userObject.soloStripeSubscriptionID) {
    subscriptionStatus = "active";
  } else if (daysLeft <= 0) {
    subscriptionStatus = "active";
  } else {
    subscriptionStatus = "trial";
  }

  // Check organization subscription
  const orgStatus = userObject.organizations && userObject.organizations[0] && userObject.organizations[0].organization;
  if (orgStatus && orgStatus.stripeSubscriptionID) {
    subscriptionStatus = "active";
  } else if (orgStatus) {
    const orgDaysLeft = calculateDaysLeft(orgStatus.createdAt);
    if (orgDaysLeft <= 0) {
      subscriptionStatus = "active";
    }
  }

  return subscriptionStatus;
};

const getSubscriptionStatusForTherapist = (userObject) => {
  if (userObject.organizations && userObject.organizations[0]) {
    const organization = userObject.organizations[0].organization;
    if (!organization.stripeSubscriptionID) {
      const daysLeft = calculateDaysLeft(organization.createdAt);
      return daysLeft <= 0 ? "active" : "trial";
    }
    return "active";
  }
  return "inactive";  // Assuming therapist should have no subscription without an organization
};

const resolvers = {
  Query: {
    getUser: async (_, {}, context) => {
      // LOGIN CHECK
      if (!context.user) throw new UserInputError("Login required");

      // SELECT ALL USER FIELDS
      let userObject = await getUserObject(context.user);

      // SUBSCRIPTION STATUS CHECK
      let subscriptionStatus;

      // Determine subscription status based on user role
      if (userObject.ownedOrganization) {
        subscriptionStatus = getSubscriptionStatusForOwner(userObject);
      } else if (userObject.role === "GUARDIAN") {
        subscriptionStatus = getSubscriptionStatusForGuardian(userObject);
      } else {
        subscriptionStatus = getSubscriptionStatusForTherapist(userObject);
      }

      // Assign subscription status to the user object
      userObject.subscriptionStatus = subscriptionStatus;

      return userObject;
    },
  },
};
export default resolvers;