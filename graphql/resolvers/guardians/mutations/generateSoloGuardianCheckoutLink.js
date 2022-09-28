import prisma from "@utils/prismaDB";
import { UserInputError } from "apollo-server-errors";

export default {
  Mutation: {
    generateSoloGuardianCheckoutLink: async (_, {}, context) => {

      const host = "http://localhost:3000"
      
      if (!context.user) throw new UserInputError("Login required");
      if (context.user.role !== "GUARDIAN")
        throw new UserInputError("Only guardians can get checkout links");

      const stripe = require("stripe")(process.env.STRIPE_PRIVATE_KEY);

      if (!context.user.solo)
        throw new UserInputError(
          "Only solo guardians can generate checkout URLs"
        );

      if (context.user.soloStripeSubscriptionID)
        throw new UserInputError("This guardian already has a subscription");

      // Kidz-N-Motion Pro Plan Product ID
      const priceId = "price_1LbnW6GjT1PBxtTZgowXZb4U";

      const session = await stripe.checkout.sessions.create({
        mode: "subscription",
        line_items: [
          {
            price: priceId,
            quantity: 1,
          },
        ],
        success_url: `${host}/account/subscription-success?success=true&session_id={CHECKOUT_SESSION_ID}&user_id=${context.user.id}`,
        cancel_url: `${host}?success=false&session_id={CHECKOUT_SESSION_ID}`,
      });

      return session.url;
    },
  },
};
