import { handleAuth } from "@helpers/api/auth";
import prisma from "@utils/prismaDB";

export default async function handler(req, res) {
  const body = req.body;

  const stripe = require("stripe")(process.env.STRIPE_PRIVATE_KEY);

  const sessionID = body.stripeSessionID;
  const userID = body.userID;

  // Retrive the stripe session id
  const session = await stripe.checkout.sessions.retrieve(sessionID);
  if (!session) {
    res.status(404).json({});
  }

  // Update the user owned organization with their stripe id
  await prisma.user.update({
    where: {
      id: userID,
    },
    data: {
      soloStripeSubscriptionID: session.customer,
      soloSubscriptionStatus: "Active",
    },
  });

  res.status(200).json({});
}
