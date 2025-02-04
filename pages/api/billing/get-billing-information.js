import { handleAuth } from "@helpers/api/auth";
import prisma from "@utils/prismaDB";
import { updateSubscription } from "../../../helpers/api/billing";

export default async function handler(req, res) {
  const body = req.body;

  const stripe = require("stripe")(process.env.STRIPE_PRIVATE_KEY);

  const userToken = body.token;
  const returnUrl = body.host;

  // Get the user object
  const user = await handleAuth(userToken);
  if (!user) {
    res.status(404).json({});
  }
  await updateSubscription(user.id);
  const fullUserObject = await prisma.user.findUnique({
    where: {
      id: user.id,
    },
    select: {
      soloStripeSubscriptionID: true,
      ownedOrganization: {
        select: {
          stripeSubscriptionID: true,
        },
      },
    },
  });

  if (
    !fullUserObject.ownedOrganization &&
    !fullUserObject.soloStripeSubscriptionID
  ) {
    res.status(404).json({});
    return;
  }

  // GEt the customer object from
  const customer = await stripe.customers.retrieve(
    fullUserObject.soloStripeSubscriptionID
      ? fullUserObject.soloStripeSubscriptionID
      : fullUserObject.ownedOrganization.stripeSubscriptionID,
    {
      expand: ["subscriptions", "sources"],
    }
  );

  // Get the portal session for the user to click on the link to edit their payment settings
  const portalSession = await stripe.billingPortal.sessions.create({
    customer: customer.id,
    return_url: returnUrl,
  });

  // Get the customer subscription object
  const subscription = await stripe.subscriptions.retrieve(
    customer.subscriptions.data[0].id,
    {
      expand: ["default_source", "default_payment_method"],
    }
  );

  try {
    const invoices = await stripe.invoices.list({
      subscription: subscription.id,
    });

    let invoiceObjects = [];
    invoices.data.map((stripeInvoiceObject) => {
      invoiceObjects.push({
        amount: stripeInvoiceObject.amount_paid,
        created: new Date(stripeInvoiceObject.created * 1000),
        status: stripeInvoiceObject.status,
        invoiceURL: stripeInvoiceObject.hosted_invoice_url,
      });
      return stripeInvoiceObject;
    });

    let planTotal = subscription.quantity;
    if (planTotal > 15) {
      planTotal = 15 * 30 + (planTotal - 15) * 25;
    } else {
      planTotal = planTotal * 30;
    }
    let response = {
      sessionURL: portalSession.url,
      paymentMethod: subscription.default_payment_method.card,
      subscription: {
        id: subscription.id,
        status: subscription.status,
      },
      bills: {
        cycle: {
          start: new Date(subscription.current_period_start * 1000),
          end: new Date(subscription.current_period_end * 1000),
        },
        planTotal: planTotal * 100,
        planInterval: subscription.plan.interval,
        plantIntervalCount: subscription.plan.interval_count,
        invoices: invoiceObjects,
      },
    };

    res.status(200).json(response);
  } catch {
    res.status(200).json(subscription);
  }
}
