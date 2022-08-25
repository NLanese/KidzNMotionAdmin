/* eslint-disable import/no-anonymous-default-export */
import prisma from "@utils/prismaDB";
import { UserInputError } from "apollo-server-errors";

// Used to to to edit the pateitn notification settings from the Thereapist
export default {
  Mutation: {
    approveMeeting: async (
      _,
      { meetingID, approveMeeting },
      context
    ) => {
      if (!context.user) throw new UserInputError("Login required");
      if (context.user.role !== "THERAPIST" && context.user.role !== "GUARDIAN")
        throw new UserInputError(
          "Only therapists or guardians can create meetings"
        );

      // Find the meeting object to determine if the are under the account
      let meetingToEdit = await prisma.meeting.findUnique({
        where: {
          id: meetingID,
        },
        select: {
          meetingOwnerID: true,
          id: true,
          meetingDateTime: true
        },
      });

      // If they are not, then return user input error
      if (!meetingToEdit) {
        throw new UserInputError("Meeting does not exist");
      }


      // Check to make sure the meeting is not in the past
      if (new Date(meetingToEdit.meetingDateTime) <= new Date()) {
        throw new UserInputError("Meetings can only be approved or not in the future");
      }

      // Update the meetings approval or not
      await prisma.meeting.update({
        where: {
          id: meetingID,
        },
        data: {
          pendingApproval: !approveMeeting,
          approved: approveMeeting,
        },
      });


      // REturn the meeting object
      let meeting = await prisma.meeting.findUnique({
        where: {
          id: meetingID,
        },
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
          users: true,
          meetingOwnerID: true,
        },
      });

      return meeting;
    },
  },
};
