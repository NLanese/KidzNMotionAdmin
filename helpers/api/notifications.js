import prisma from "@utils/prismaDB";
import pusherServer from "@utils/pusherServer";
import admin from "@utils/firebase";

// Creates an in-app notification for a user, then tries to deliver it live:
//   1. saves the Notification row (this is what the app lists)
//   2. sends a phone push through Firebase, if the user has a device token
//   3. pings Pusher so an open app refreshes immediately
// Steps 2 and 3 are best-effort: if Firebase or Pusher is down or not
// configured, the problem is logged and the notification is still saved.
//
// The phone push respects the user's Settings switches:
//   muteAllMessages     -> no push for MESSAGE notifications
//   muteAllAssignments  -> no push for assignment / meeting notifications
// The in-app notification is always saved, so badges still show.
const isMutedFor = (type, user) => {
  const t = String(type || "").toUpperCase();
  if (t === "MESSAGE") return !!user.muteAllMessages;
  if (t.includes("ASSIGNMENT") || t.includes("MEETING")) return !!user.muteAllAssignments;
  return false;
};
export const createNotification = async (
  title,
  description,
  type,
  toUserId,
  fromUserId
) => {
  // 1. Save the notification
  const notification = await prisma.notification.create({
    data: {
      title: title,
      description: description,
      type: type,
      toUserId: toUserId,
      fromUserId: fromUserId,
    },
  });

  // 2. Phone push notification
  try {
    const recipient = await prisma.user.findUnique({
      where: { id: toUserId },
      select: { fcmToken: true, muteAllMessages: true, muteAllAssignments: true },
    });
    if (recipient && recipient.fcmToken && !isMutedFor(type, recipient)) {
      await admin.messaging().send({
        notification: { title: title, body: description },
        token: recipient.fcmToken,
      });
    }
  } catch (err) {
    console.warn("Push notification not sent:", err.message);
  }

  // 3. Live update for an open app
  try {
    await pusherServer.trigger(toUserId, "new-notification", {
      message: "new-notification",
    });
  } catch (err) {
    console.warn("Pusher trigger failed:", err.message);
  }

  return notification;
};
