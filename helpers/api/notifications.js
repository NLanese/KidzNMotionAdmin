import prisma from "@utils/prismaDB";
import pusherServer from "@utils/pusherServer";

// import { createNotification } from "@helpers/api/notifications"

export const createNotification = async (
  title,
  description,
  type,
  toUserId,
  fromUserId
) => {
  // Create the notification
  await prisma.notification.create({
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
