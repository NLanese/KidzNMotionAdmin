// Daily job (see "crons" in vercel.json): notifies therapists about assignments
// whose due date has passed without every video completed.
//
// Vercel calls this with "Authorization: Bearer <CRON_SECRET>". Set CRON_SECRET
// in the Vercel project's environment variables; anyone without it gets a 401.

import { notifyMissedAssignments } from "../../../functions/AssignmentHelpers/assignmentNotifications";

export default async function handler(req, res) {
  const secret = process.env.CRON_SECRET;
  if (!secret || req.headers.authorization !== `Bearer ${secret}`) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    const summary = await notifyMissedAssignments();
    return res.status(200).json(summary);
  } catch (err) {
    console.error("Missed assignment job failed:", err);
    return res.status(500).json({ error: "Missed assignment job failed" });
  }
}
