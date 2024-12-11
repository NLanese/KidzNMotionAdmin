import prisma from "@utils/prismaDB";
import { handleAuth } from "@helpers/api/auth";

export default async function handler(req, res) {

  const body = req.body;
  const stripe = require("stripe")(process.env.STRIPE_PRIVATE_KEY);

  if (!body) {
    return res.status(400).json({
      error: "Missing body",
    });
  }

  if (!body.token) {
    return res.status(400).json({
      error: "Missing token",
    });
  }

  const user = await handleAuth(body.token);

  // Kidz-N-Motion Pro Plan Product ID
  const priceId =
    process.env.NODE_ENV === "development"
      ? "price_1Onu8EAbL8OcaqqPjg0V3dXJ"
      : "price_1Onu8EAbL8OcaqqPjg0V3dXJ";

  let userCount = 0;

  if (user?.ownedOrganization) {
    const organization = await prisma.organization.findUnique({
      where: {
        id: user?.ownedOrganization?.id,
      },
      select: {
        organizationUsers: {
          select: {
            id: true,
            user: {
              select: {
                role: true,
              },
            },
          },
        },
      },
    });

    if (organization) {
      organization.organizationUsers.forEach((user) => {
        if (user.user.role !== "GUARDIAN" && user.user.role !== "CHILD")
          userCount++;
      });
    } else {
      userCount = 1;
    }
  } else {
    userCount = 1;
  }

  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    line_items: [
      {
        price: priceId,
        quantity: userCount,
      },
    ],
    success_url: `${body.host}?success=true&session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${body.host}?success=false&session_id={CHECKOUT_SESSION_ID}`,
  });

  res.status(200).json({ checkoutURL: session.url });
}
