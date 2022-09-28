/* eslint-disable import/no-anonymous-default-export */
import prisma from "@utils/prismaDB";
import { UserInputError } from "apollo-server-errors";

// Used to to to edit the pateitn notification settings from the Thereapist
export default {
  Mutation: {
    editMeeting: async (
      _,
      {
        title,
        meetingDateTime,
        type,
        participantIDs,
        meetingID,
        cancelled,
        completed,
      },
      context
    ) => {
      console.log(completed, cancelled)
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
        },
      });

      // Check the user meetings to make sure they are not overlapping
      const userMeetings = await prisma.meeting.findMany({
        where: {
          meetingOwnerID: context.user.id,
          completed: false,
          canceled: false,
        },
        select: {
          meetingDateTime: true,
          id: true,
        },
      });

      let overlap = false;

      if (!cancelled && !completed) {
        userMeetings.map((meetingObject) => {
          if (meetingID !== meetingObject.id) {
            let delta =
              meetingObject.meetingDateTime - new Date(meetingDateTime);
            delta = delta / (60 * 1000);
            if (Math.abs(delta) <= 5) {
              throw new UserInputError(
                "Meetings cannot be made within 5 minutes of eachother"
              );
            }
          }
          return meetingObject;
        });
      }

      // If they are not, then return user input error
      if (!meetingToEdit) {
        throw new UserInputError("Meeting does not exist");
      }

      // If they are not, then return user input error
      if (meetingToEdit.meetingOwnerID !== context.user.id) {
        throw new UserInputError("Access denied");
      }

      if (!cancelled && !completed) {
        // Check to make sure the meeting is not in the past
        if (new Date(meetingDateTime) <= new Date()) {
          throw new UserInputError("Meetings can only be made in the future");
        }
      }

      if (type !== "PHONE" && type !== "IN_PERSON") {
        throw new UserInputError(
          "Meetings can only be made in person or over the phone"
        );
      }

      let prismaConnections = [{ id: context.user.id }];
      for (var i = 0; i < participantIDs.length; i++) {
        if (participantIDs[i]) {
          prismaConnections.push({
            id: participantIDs[i],
          });
          // Find the child object to determine if the are under the guardian account
          let participantUser = await prisma.user.findUnique({
            where: {
              id: participantIDs[i],
            },
            select: {
              id: true,
            },
          });

          if (!participantUser) {
            throw new UserInputError("Invalid paricipant user id");
          }
        }
      }

      // Create the meeting
      let editedMeeting = await prisma.meeting.update({
        where: {
          id: meetingID,
        },
        data: {
          title: title,
          meetingDateTime: meetingDateTime,
          type: type,
          canceled: cancelled,
          canceled: completed,
          meetingOwnerID: context.user.id,
          pendingApproval: context.user.role !== "THERAPIST",
          approved: context.user.role === "THERAPIST",
          users: {
            connect: prismaConnections,
          },
        },
      });

      let meeting = await prisma.meeting.findUnique({
        where: {
          id: editedMeeting.id,
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
