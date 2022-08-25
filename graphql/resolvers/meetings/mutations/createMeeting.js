/* eslint-disable import/no-anonymous-default-export */
import prisma from "@utils/prismaDB";
import { UserInputError } from "apollo-server-errors";

// Used to to to edit the pateitn notification settings from the Thereapist
export default {
  Mutation: {
    createMeeting: async (
      _,
      { title, meetingDateTime, type, participantIDs },
      context
    ) => {
      if (!context.user) throw new UserInputError("Login required");
      if (context.user.role !== "THERAPIST" && context.user.role !== "GUARDIAN")
        throw new UserInputError(
          "Only therapists or guardians can create meetings"
        );

      // Check to make sure the meeting is not in the past
      if (new Date(meetingDateTime) <= new Date()) {
        throw new UserInputError("Meetings can only be made in the future");
      }

      if (type !== "PHONE" && type !== "IN_PERSON") {
        throw new UserInputError(
          "Meetings can only be made in person or over the phone"
        );
      }

      let prismaConnections = [{id: context.user.id}];
      for (var i = 0; i < participantIDs.length; i++) {
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

      // Create the meeting
      let newMeeting = await prisma.meeting.create({
        data: {
          title: title,
          meetingDateTime: meetingDateTime,
          type: type,
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
          id: newMeeting.id,
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
