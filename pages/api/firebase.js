import { handleAuth } from "@helpers/api/auth";
import prisma from "@utils/prismaDB";
import admin from "@utils/firebase";

export default async function handler(req, res) {
  const body = req.body;

  const message = {
    notification: {
      title: "EPA fuel economy stats for new Mazda6",
      body: "New turbo charged 2.5L engine does 23/31/36 mpg.",
    },
    token:
      "dA4OEaVfZExsvJCRJ2P8vL:APA91bEwVq32EG_01_uQEEUB3FxY3c1YIrOSt66HBAi4nMgh0HhephLioRfLCnEMO9bSY-K09cXmHw1E0_b1xmADIx4RGY5eL7HkUsOLgcz3XHx0dHOCUv6s6v1wZH8xsoESgOqrjG5F",
  };
  await admin
    .messaging()
    .send(message)
    .then((resp) => {
    })
    .catch((err) => {
      console.warn("Failed to send the message:", err);
    });

  res.status(200).json({});
}
