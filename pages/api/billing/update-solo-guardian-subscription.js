import { handleAuth } from "@helpers/api/auth";
import prisma from "@utils/prismaDB";

const sgMail = require("@sendgrid/mail");
sgMail.setApiKey(process.env.SEND_GRID_API_KEY);

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
      subscriptionStatus: "Active"
    },
  });

  // Update the user owned organization with the stripe subscription informatio
  const fullUserObject = await prisma.user.findUnique({
    where: {
      id: userID,
    },
    select: {
      firstName: true,
      email: true,
      ownedOrganization: {
        select: {
          id: true,
        },
      },
    },
  });
  const msg = {
    to: fullUserObject.email, // Change to your recipient
    from: "noreply@em9019.kidz-n-motion.app", // Change to your verified sender
    subject: "Welcome To Kidz-N-Motion 😊",

    html: `
        <div style="text-align: center">
        <img src="https://kids-in-motion.vercel.app/logos/Main.png"  width="110px"/>
        </div>
          <br />
        <p>Hi ${fullUserObject.firstName},</p>
        <p>Welcome to the Kidz-N-Motion community. We are delighted that you chose to enhance your physical therapy services. You now have access to an innovative resource via the website as well as the mobile app.</p>
        <br />
        <p>Thank you, </p>
        <p>Team Kidz-N-Motion</p>

    `,
  };
  await sgMail
    .send(msg)
    .then(() => {
    })
    .catch((error) => {
      console.error(error.response.body);
    });
  res.status(200).json({});
}
