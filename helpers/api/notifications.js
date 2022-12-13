import prisma from "@utils/prismaDB";
import pusherServer from "@utils/pusherServer";
import admin from "@utils/firebase";

// import { createNotification } from "@helpers/api/notifications"

export const createNotification = async (
  title,
  description,
  type,
  toUserId,
  fromUserId
) => {
  // See if we can send a push notificaiotn
  // Find the other user account via the particant id
  let userToSendPushNotification = await prisma.user.findUnique({
    where: {
      id: toUserId,
    },
    select: {
      fcmToken: true,
    },
  });

  if (userToSendPushNotification && userToSendPushNotification.fcmToken) {
    const message = {
      notification: {
        title: title,
        body: description,
      },
      token: userToSendPushNotification.fcmToken,
    };
    await admin
      .messaging()
      .send(message)
      .then((resp) => {
        // console.log("Message sent successfully:", resp);
      })
      .catch((err) => {
        // console.log("Failed to send the message:", err);
      });
  }

  // Create the notification
  let notification = await prisma.notification.create({
    data: {
      title: title,
      description: description,
      type: type,
      toUserId: toUserId,
      fromUserId: fromUserId,
    },
  });

  // Send out the pusher trigger
  pusherServer.trigger(toUserId, "new-notification", {
    message: "new-notification",
  });
};
