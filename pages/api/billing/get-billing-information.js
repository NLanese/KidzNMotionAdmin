export default async function handler(req, res) {
  const body = req.body;

  const stripe = require("stripe")(process.env.STRIPE_PRIVATE_KEY);

  const sessionID = body.sessionID;
  const returnUrl = body.host;

  // Retrive the stripe session id (DEV ONLY)
  const session = await stripe.checkout.sessions.retrieve(sessionID);

  // GEt the customer object from
  const customer = await stripe.customers.retrieve(session.customer, {
    expand: ["subscriptions", "sources"],
  });

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

  const invoices = await stripe.invoices.list({
    subscription: subscription.id,
  });

  let invoiceObjects = [];
  invoices.data.map((stripeInvoiceObject) => {
    invoiceObjects.push({
      amount: stripeInvoiceObject.amount_paid,
      created: new Date(stripeInvoiceObject.created  * 1000),
      status: stripeInvoiceObject.status,
      invoiceURL: stripeInvoiceObject.hosted_invoice_url,
    });
    return stripeInvoiceObject;
  });

  let response = {
    sessionURL: portalSession.url,
    paymentMethod:subscription.default_payment_method.card,
    subscription: {
      id: subscription.id,
      status: subscription.status,
    },
    bills: {
      cycle: {
        start: new Date(subscription.current_period_start * 1000),
        end: new Date(subscription.current_period_end * 1000),
      },
      planTotal: subscription.plan.amount,
      planInterval: subscription.plan.interval,
      plantIntervalCount: subscription.plan.interval_count,
      invoices: invoiceObjects,
    },
  };

  res.status(200).json(response);
}
