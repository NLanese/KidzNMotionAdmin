import { handleAuth } from "@helpers/api/auth";
import prisma from "@utils/prismaDB";

export default async function handler(req, res) {
  const body = req.body;

  const stripe = require("stripe")(process.env.STRIPE_PRIVATE_KEY);

  const sessionID = body.stripeSessionID;
  const returnUrl = body.host;
  const userToken = body.token;

  // Get the user object
  const user = await handleAuth(userToken);
  if (!user) {
    res.status(404).json({});
  }

  // Retrive the stripe session id
  const session = await stripe.checkout.sessions.retrieve(sessionID);
  if (!session) {
    res.status(404).json({});
  }

  // Update the user owned organization with the stripe subscription informatio
  const fullUserObject = await prisma.user.findUnique({
    where: {
      id: user.id,
    },
    select: {
      ownedOrganization: {
        select: {
          id: true,
        },
      },
    },
  });



  // Update the user owned organization with their stripe id
  let organization = await prisma.organization.update({
    where: {
      id: fullUserObject.ownedOrganization.id,
    },
    data: {
      stripeSubscriptionID: session.customer,
      subscriptionStatus: "Active",
    },
  });

  res.status(200).json({});
}
