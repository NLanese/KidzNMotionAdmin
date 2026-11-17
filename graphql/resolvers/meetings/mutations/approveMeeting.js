/* eslint-disable import/no-anonymous-default-export */
import prisma from "@utils/prismaDB";
import { UserInputError } from "apollo-server-errors";
import { createNotification } from "@helpers/api/notifications";

// Someone invited to a meeting accepts (approveMeeting: true) or declines it.
// Only invitees can answer, not the person who asked for it.
export default {
  Mutation: {
    approveMeeting: async (_, { meetingID, approveMeeting }, context) => {
      if (!context.user) throw new UserInputError("Login required");

      const meeting = await prisma.meeting.findUnique({
        where: { id: meetingID },
        select: {
          id: true,
          title: true,
          meetingOwnerID: true,
          meetingDateTime: true,
          canceled: true,
          users: { select: { id: true } },
        },
      });
      if (!meeting) throw new UserInputError("Meeting does not exist");
      const invited = meeting.users.some((u) => u.id === context.user.id);
      if (!invited || meeting.meetingOwnerID === context.user.id) {
        throw new UserInputError("Only the people invited can answer this meeting request");
      }
      if (meeting.canceled) throw new UserInputError("This meeting was canceled");
      if (new Date(meeting.meetingDateTime) <= new Date()) {
        throw new UserInputError("Meetings can only be approved or not in the future");
      }

      const updated = await prisma.meeting.update({
        where: { id: meetingID },
        data: { pendingApproval: false, approved: !!approveMeeting },
        select: {
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
        },
      });

      if (meeting.meetingOwnerID) {
        await createNotification(
          `${context.user.firstName} ${approveMeeting ? "accepted" : "declined"} your meeting`,
          meeting.title || "Meeting",
          "MEETING_RESPONSE",
          meeting.meetingOwnerID,
          context.user.id
        );
      }
      return updated;
    },
  },
};
