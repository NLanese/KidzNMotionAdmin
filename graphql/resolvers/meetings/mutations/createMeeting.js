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
      
      //////////////
      // Security // 
      //////////////
      if (!context.user) throw new UserInputError("Login required");
      if (context.user.role !== "THERAPIST" && context.user.role !== "GUARDIAN")
        throw new UserInputError(
          "Only therapists or guardians can create meetings"
        );


      ////////////////
      // VALID DATE //
      ////////////////
      if (meetingDateTime <= new Date()) {
        throw new UserInputError("Meetings can only be made in the future");
      }

      if (type !== "PHONE" && type !== "IN_PERSON") {
        throw new UserInputError(
          "Meetings can only be made in person or over the phone"
        );
      }

      ////////////////////
      // CHECKS OVERLAP //
      ////////////////////
      const userMeetings = await prisma.meeting.findMany({
        where: {
          meetingOwnerID: context.user.id,
          completed: false,
          canceled: false,
        },
        select: {
          meetingDateTime: true,
        },
      });
      userMeetings.map((meetingObject) => {
        let delta = meetingObject.meetingDateTime - new Date(meetingDateTime);
        delta = delta / (60 * 1000);
        if (Math.abs(delta) <= 20) {
          throw new UserInputError(
            "Meetings cannot be made within 20 minutes of eachother"
          );
        }
        return meetingObject;
      });

      ///////////////////////////////////
      // CHECKS FOR VALID PARTICIPANTS //
      ///////////////////////////////////
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

      console.log("Valid Params to Create a Meeting")

      ////////////////////////
      // Create the meeting //
      ////////////////////////
      await prisma.meeting.create({
        data: {
          title: title,
          meetingDateTime: meetingDateTime,
          type: type,
          meetingOwnerID: context.user.id,
          pendingApproval: true,
          approved: false,
          users: {
            connect: prismaConnections,
          },
        },
      });

      console.log("Created Meeting")

      let meetings = await prisma.meeting.findMany({
        where: {
          meetingOwnerID: context.user.id,
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

      console.log("Returning meetings")
      console.log(meetings)

      return meetings;
    },
  },
};
