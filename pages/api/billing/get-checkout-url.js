export default async function handler(req, res) {
  const body = req.body;
  const stripe = require("stripe")(process.env.STRIPE_PRIVATE_KEY);

  // Kidz-N-Motion Pro Plan Product ID
  const priceId = "price_1LMTrNGjT1PBxtTZNrkwpLbf";

  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    line_items: [
      {
        price: priceId,
        quantity: 1,
      },
    ],
    success_url: `${body.host}?success=true&session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${body.host}?success=false&session_id={CHECKOUT_SESSION_ID}`,
  });

  res.status(200).json({ checkoutURL: session.url });
}
