// Message.createdAt is saved as Date.toString() text, e.g.
// "Thu Nov 05 2026 15:58:00 GMT-0700 (Mountain Standard Time)".
// Node can parse that; anything unreadable sorts as oldest.
export function messageTime(message) {
  const fromCreated = Date.parse(message && message.createdAt);
  if (!Number.isNaN(fromCreated)) return fromCreated;
  const stamp = message && message.sentAt && message.sentAt.timeStamp;
  const fromSent = Date.parse(stamp);
  return Number.isNaN(fromSent) ? 0 : fromSent;
}
