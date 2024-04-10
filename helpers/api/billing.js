import prisma from "@utils/prismaDB";

export const updateSubscription = async (userId) => {
  const stripe = require("stripe")(process.env.STRIPE_PRIVATE_KEY);
  const fullUserObject = await prisma.user.findUnique({
    where: {
      id: userId,
    },
    select: {
      soloStripeSubscriptionID: true,
      ownedOrganization: {
        select: {
          id: true,
          stripeSubscriptionID: true,
        },
      },
    },
  });

  if (!fullUserObject) return;
  if (!fullUserObject.ownedOrganization) return;

  const subscriptionID = fullUserObject.ownedOrganization.stripeSubscriptionID;
  if (!subscriptionID) return;

  const customer = await stripe.customers.retrieve(subscriptionID, {
    expand: ["subscriptions", "sources"],
  });

  const realSubscriptionId = customer.subscriptions.data[0].id;

  // Get the total users in the account
  let userCount = 0;
  const organization = await prisma.organization.findUnique({
    where: {
      id: fullUserObject.ownedOrganization.id,
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

  if (!organization) return;
  organization.organizationUsers.forEach((user) => {
    if (user.user.role !== "GUARDIAN" && user.user.role !== "CHILD")
      userCount++;
  });

  const subscription = await stripe.subscriptions.update(realSubscriptionId, {
    quantity: userCount,
  });
};
