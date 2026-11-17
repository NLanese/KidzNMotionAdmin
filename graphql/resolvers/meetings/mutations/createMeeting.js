/* eslint-disable import/no-anonymous-default-export */
import prisma from "@utils/prismaDB";
import { UserInputError } from "apollo-server-errors";
import { createNotification } from "@helpers/api/notifications";

const MEETING_SELECT = {
  id: true,
  createdAt: true,
  meetingDateTime: true,
  title: true,
  completed: true,
  canceled: true,
  type: true,
  pendingApproval: true,
  approved: true,
  meetingOwnerID: true,
  users: { select: { id: true, firstName: true, lastName: true, role: true } },
};

// Who the signed-in person may invite: a therapist, their clients' parents
// and children; a parent, their children's therapists.
async function allowedParticipantIds(user) {
  const ids = new Set();
  if (user.role === "THERAPIST") {
    const plans = await prisma.childCarePlan.findMany({
      where: { therapistId: user.id, active: true },
      select: { child: { select: { id: true, guardianId: true } } },
    });
    for (const p of plans) {
      if (p.child && p.child.id) ids.add(p.child.id);
      if (p.child && p.child.guardianId) ids.add(p.child.guardianId);
    }
  } else if (user.role === "GUARDIAN") {
    const plans = await prisma.childCarePlan.findMany({
      where: { active: true, child: { guardianId: user.id } },
      select: { therapistId: true },
    });
    for (const p of plans) if (p.therapistId) ids.add(p.therapistId);
  }
  return ids;
}

const TYPE_LABEL = { PHONE: "phone call", IN_PERSON: "in-person meeting" };

// A therapist or parent asks for a meeting. It starts as a request: the
// other person accepts or declines it (approveMeeting).
export default {
  Mutation: {
    createMeeting: async (_, { title, meetingDateTime, type, participantIDs }, context) => {
      if (!context.user) throw new UserInputError("Login required");
      if (context.user.role !== "THERAPIST" && context.user.role !== "GUARDIAN")
        throw new UserInputError("Only therapists or parents can schedule meetings");

      const when = new Date(meetingDateTime);
      if (isNaN(when.getTime())) throw new UserInputError("That meeting time isn't valid");
      if (when <= new Date()) throw new UserInputError("Meetings can only be made in the future");
      if (type !== "PHONE" && type !== "IN_PERSON") {
        throw new UserInputError("Meetings can only be made in person or over the phone");
      }

      const invited = [...new Set((participantIDs || []).filter((id) => id && id !== context.user.id))];
      if (invited.length === 0) throw new UserInputError("Choose who the meeting is with");
      const allowed = await allowedParticipantIds(context.user);
      if (invited.some((id) => !allowed.has(id))) {
        throw new UserInputError("You can only schedule meetings with your own clients or therapists");
      }

      const existing = await prisma.meeting.findMany({
        where: { meetingOwnerID: context.user.id, completed: false, canceled: false },
        select: { meetingDateTime: true },
      });
      const clash = existing.some((m) => Math.abs(new Date(m.meetingDateTime) - when) <= 20 * 60 * 1000);
      if (clash) throw new UserInputError("Meetings cannot be made within 20 minutes of each other");

      const meeting = await prisma.meeting.create({
        data: {
          title: title,
          meetingDateTime: when,
          type: type,
          meetingOwnerID: context.user.id,
          pendingApproval: true,
          approved: false,
          users: { connect: [{ id: context.user.id }, ...invited.map((id) => ({ id }))] },
        },
        select: MEETING_SELECT,
      });

      // Ask each invitee. (The app shows the time in their own time zone.)
      for (const id of invited) {
        await createNotification(
          `${context.user.firstName} asked for a ${TYPE_LABEL[type]}`,
          `${title}. Open Kidz-N-Motion to accept or decline.`,
          "MEETING_REQUEST",
          id,
          context.user.id
        );
      }
      return meeting;
    },
  },
};
