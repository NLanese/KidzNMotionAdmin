import prisma from "@utils/prismaDB";
import { UserInputError } from "apollo-server-errors";

export default {
  Mutation: {
    generateSoloGuardianPortalLink: async (_, {}, context) => {
      const host =
        process.env.NODE_ENV === "development"
          ? "http://localhost:3000"
          : "https://dashboard.kidz-n-motion.app";

      // console.log("hiijijiji")
      if (!context.user) throw new UserInputError("Login required");
      if (context.user.role !== "GUARDIAN")
        throw new UserInputError("Only guardians can get portal links");

      const stripe = require("stripe")(process.env.STRIPE_PRIVATE_KEY);

      if (!context.user.solo)
        throw new UserInputError(
          "Only solo guardians can generate portal URLs"
        );

      if (!context.user.soloStripeSubscriptionID)
        throw new UserInputError("This guardian does not have a subscription");

      // Get the portal session for the user to click on the link to edit their payment settings
      const portalSession = await stripe.billingPortal.sessions.create({
        customer: context.user.soloStripeSubscriptionID,
        return_url: host,
      });

      return portalSession.url;
    },
  },
};
