import prisma from "@utils/prismaDB";
import pusherServer from "@utils/pusherServer";
import admin from "@utils/firebase";

// Creates an in-app notification for a user, then tries to deliver it live:
//   1. saves the Notification row (this is what the app lists and badges)
//   2. sends a phone push, if the user has a device token and hasn't muted it
//   3. pings Pusher so an open app refreshes immediately
// Steps 2 and 3 are best-effort: a failure is logged and never thrown.
//
// Device tokens (users.fcmToken) come in two kinds:
//   "ExponentPushToken[...]" from the current app  -> Expo push service
//   anything else, from the older app              -> Firebase Cloud Messaging

// ---------- Muting ----------

// Two switches in Settings: "New messages" and "Assignments and reminders".
// MESSAGE notifications follow the first; every other kind (new assignment,
// completed/missed assignment, meetings, reminders) follows the second.
export const notificationCategory = (type) =>
  String(type || "").toUpperCase() === "MESSAGE" ? "messages" : "assignments";

export const isMutedFor = (type, user) =>
  notificationCategory(type) === "messages" ? !!user.muteAllMessages : !!user.muteAllAssignments;

// A therapist can also mute one client (Clients > client > "Your alerts for
// this client"). Those switches live on the child: messagesMuted /
// assignMuted. They apply when the notification comes from that child or
// from their parent.
export const clientMutedFor = async (type, therapistId, fromUserId) => {
  if (!fromUserId || !therapistId) return false;
  const field = notificationCategory(type) === "messages" ? "messagesMuted" : "assignMuted";
  const kids = await prisma.user.findMany({
    where: {
      role: "CHILD",
      OR: [{ id: fromUserId }, { guardianId: fromUserId }],
      childCarePlans: { some: { therapistId: therapistId, active: true } },
    },
    select: { messagesMuted: true, assignMuted: true },
  });
  return kids.length > 0 && kids.every((k) => !!k[field]);
};

// ---------- Sending ----------

export const isExpoToken = (token) => /^Expo(nent)?PushToken\[.+\]$/.test(String(token || ""));

// Forget a token the phone no longer accepts, so we stop trying it.
async function forgetToken(userId, token) {
  try {
    await prisma.user.updateMany({ where: { id: userId, fcmToken: token }, data: { fcmToken: null } });
  } catch (err) {
    console.warn("Could not clear a dead push token:", err.message);
  }
}

async function sendExpoPush(token, title, body, data) {
  const headers = { "Content-Type": "application/json", Accept: "application/json" };
  // Only needed if "enhanced push security" is turned on in the Expo account.
  if (process.env.EXPO_ACCESS_TOKEN) headers.Authorization = `Bearer ${process.env.EXPO_ACCESS_TOKEN}`;
  const res = await fetch("https://exp.host/--/api/v2/push/send", {
    method: "POST",
    headers,
    body: JSON.stringify({ to: token, title, body, data, sound: "default", channelId: "default", priority: "high" }),
  });
  const json = await res.json().catch(() => ({}));
  const ticket = Array.isArray(json.data) ? json.data[0] : json.data;
  if (!res.ok || !ticket || ticket.status !== "ok") {
    const reason = (ticket && ticket.details && ticket.details.error) || (json.errors && json.errors[0] && json.errors[0].code) || res.status;
    return { ok: false, reason };
  }
  return { ok: true };
}

async function sendFirebasePush(token, title, body, data) {
  try {
    await admin.messaging().send({ notification: { title, body }, data, token });
    return { ok: true };
  } catch (err) {
    return { ok: false, reason: err.code || err.message };
  }
}

const DEAD_TOKEN = new Set([
  "DeviceNotRegistered",
  "messaging/registration-token-not-registered",
  "messaging/invalid-registration-token",
]);

export const createNotification = async (title, description, type, toUserId, fromUserId) => {
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

  // 2. Phone push
  try {
    const recipient = await prisma.user.findUnique({
      where: { id: toUserId },
      select: { fcmToken: true, role: true, muteAllMessages: true, muteAllAssignments: true },
    });
    const muted =
      !recipient ||
      isMutedFor(type, recipient) ||
      (recipient.role === "THERAPIST" && (await clientMutedFor(type, toUserId, fromUserId)));

    if (recipient && recipient.fcmToken && !muted) {
      // Lets the app open the right screen when the push is tapped.
      // (Push data values must all be strings.)
      const data = { type: String(type || ""), fromUserId: String(fromUserId || ""), notificationId: String(notification.id) };
      const token = recipient.fcmToken;
      const result = isExpoToken(token)
        ? await sendExpoPush(token, title, description, data)
        : await sendFirebasePush(token, title, description, data);
      if (!result.ok) {
        console.warn("Push notification not sent:", result.reason);
        if (DEAD_TOKEN.has(result.reason)) await forgetToken(toUserId, token);
      }
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
