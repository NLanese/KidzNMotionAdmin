// Therapist notifications for assignments:
//   - "completed": the child finished every video in an assignment
//   - "missed":    the due date passed and not every video was finished
//
// Both are sent at most once per assignment. The database flag is flipped
// with a conditional update first (completed / notificationSent), so two
// requests running at the same time can never both send the notification.

import prisma from "@utils/prismaDB";
import { createNotification } from "@helpers/api/notifications";

const MONTHS = {
  jan: 0, feb: 1, mar: 2, apr: 3, may: 4, jun: 5,
  jul: 6, aug: 7, sep: 8, oct: 9, nov: 10, dec: 11,
};

// Missed assignments that are older than this when first noticed are flagged
// without notifying, so turning this feature on does not flood therapists
// with alerts about old assignments.
export const MISSED_LOOKBACK_DAYS = 7;

// Due dates are stored as text. The apps save them like "Tue Oct 20 2026";
// older records may be "2026-10-20...". Returns { year, month, day } or null.
export function parseDueDay(dateString) {
  if (!dateString) return null;
  const text = String(dateString).trim();

  let m = text.match(/([A-Za-z]{3})[a-z]*\.?\s+(\d{1,2}),?\s+(\d{4})/);
  if (m && MONTHS[m[1].toLowerCase()] !== undefined) {
    return { year: +m[3], month: MONTHS[m[1].toLowerCase()], day: +m[2] };
  }
  m = text.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (m) return { year: +m[1], month: +m[2] - 1, day: +m[3] };

  const d = new Date(text);
  if (isNaN(d.getTime())) return null;
  return { year: d.getFullYear(), month: d.getMonth(), day: d.getDate() };
}

// An assignment counts as missed once its due day is over across the US:
// 12:00 UTC on the day after the due date (6am Denver / 8am New York).
export function missedDeadline(dateString) {
  const due = parseDueDay(dateString);
  if (!due) return null;
  return new Date(Date.UTC(due.year, due.month, due.day + 1, 12, 0, 0));
}

export function allVideosCompleted(videos) {
  return Array.isArray(videos) && videos.length > 0 && videos.every((v) => v.completed);
}

function names(child) {
  const first = (child && child.firstName) || "Your client";
  const full = [child && child.firstName, child && child.lastName].filter(Boolean).join(" ") || first;
  return { first, full };
}

const assignmentDetails = {
  id: true,
  title: true,
  dateDue: true,
  videos: { select: { completed: true } },
  childCarePlan: {
    select: {
      therapistId: true,
      active: true,
      child: { select: { id: true, firstName: true, lastName: true } },
    },
  },
};

// Call when a video in this assignment was just completed and every video is
// now done. Marks the assignment completed and notifies the therapist, once.
export async function notifyAssignmentCompleted(assignmentId) {
  const claimed = await prisma.assignment.updateMany({
    where: { id: assignmentId, completed: false },
    data: { completed: true },
  });
  if (claimed.count !== 1) return false; // already completed / already notified

  try {
    const assignment = await prisma.assignment.findUnique({
      where: { id: assignmentId },
      select: assignmentDetails,
    });
    const plan = assignment && assignment.childCarePlan;
    if (!plan || !plan.therapistId) return true;

    const { first, full } = names(plan.child);
    const count = assignment.videos.length;
    await createNotification(
      `${first} completed an assignment!`,
      `${full} finished all ${count} video${count === 1 ? "" : "s"} in "${assignment.title}".`,
      "ASSIGNMENT_COMPLETED",
      plan.therapistId,
      plan.child ? plan.child.id : null
    );
  } catch (err) {
    console.error("Assignment completed notification failed:", err.message);
  }
  return true;
}

// Run on a schedule. Finds assignments whose due date has passed without every
// video finished and notifies each therapist once per assignment.
export async function notifyMissedAssignments(now = new Date()) {
  const summary = { checked: 0, notified: 0, flaggedOld: 0, markedCompleted: 0, skipped: 0 };

  const candidates = await prisma.assignment.findMany({
    where: { completed: false, notificationSent: false },
    select: assignmentDetails,
  });

  for (const assignment of candidates) {
    const deadline = missedDeadline(assignment.dateDue);
    if (!deadline || deadline > now) continue; // not due yet (or unreadable date)
    summary.checked++;

    // Every video was finished but the assignment was never flagged (older bug):
    // flag it quietly instead of calling it missed.
    if (allVideosCompleted(assignment.videos)) {
      await prisma.assignment.updateMany({
        where: { id: assignment.id, completed: false },
        data: { completed: true },
      });
      summary.markedCompleted++;
      continue;
    }

    const claimed = await prisma.assignment.updateMany({
      where: { id: assignment.id, notificationSent: false },
      data: { notificationSent: true },
    });
    if (claimed.count !== 1) continue; // someone else already sent it

    const plan = assignment.childCarePlan;
    const daysLate = (now - deadline) / (1000 * 60 * 60 * 24);
    if (daysLate > MISSED_LOOKBACK_DAYS) {
      summary.flaggedOld++;
      continue;
    }
    if (!plan || !plan.therapistId || plan.active === false || assignment.videos.length === 0) {
      summary.skipped++;
      continue;
    }

    const { first, full } = names(plan.child);
    const done = assignment.videos.filter((v) => v.completed).length;
    const total = assignment.videos.length;
    try {
      await createNotification(
        `${first} missed an assignment`,
        `${full} did not finish "${assignment.title}" by ${String(assignment.dateDue).trim()} (${done} of ${total} videos completed).`,
        "ASSIGNMENT_MISSED",
        plan.therapistId,
        plan.child ? plan.child.id : null
      );
      summary.notified++;
    } catch (err) {
      console.error("Missed assignment notification failed:", assignment.id, err.message);
    }
  }

  return summary;
}
