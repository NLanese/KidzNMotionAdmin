/* eslint-disable import/no-anonymous-default-export */
import prisma from "@utils/prismaDB";
import { UserInputError } from "apollo-server-errors";
import VIDEOS from "@constants/videos";
import { createNotification } from "@helpers/api/notifications";
var dateFormat = require("dateformat");

export default {
  Mutation: {
    createAssignment: async (
      _,
      { 
        childCarePlanID, 
        dateStart, 
        dateDue, 
        title, 
        description, 
        videoIDs
      },
      context
    ) => {

      /////////////////
      // Login Check //
      if (!context.user) throw new UserInputError("Login required");

      /////////////////////
      // Therapist Check //
      if (context.user.role !== "THERAPIST")
        throw new UserInputError("Only therapists can edit child care plans");

      /////////////////////////////
      // Locates Child Care Plan //
      console.log("Locating Child Care Plan with id " + childCarePlanID)
      let childCarePlan = await prisma.childCarePlan.findUnique({
        where: {
          id: childCarePlanID,
        },
        select: {
          id: true,
          child: {
            select: {
              id: true,
              guardian: {
                select: {
                  id: true,
                },
              },
            },
          },
          therapist: {
            select: {
              id: true,
            },
          },
        },
      });

      ///////////////////////////
      // Valid Care Plan Check //
      if (!childCarePlan) {
        console.log("It wasn't found")
        throw new UserInputError("Child care plan does not exist");
      }

      ///////////////////////////
      // Valid Care Plan Check //
      if (childCarePlan.therapist.id !== context.user.id) {
        console.log("User does not have access to it")
        throw new UserInputError("Access denied");
      }

      //////////////////////////
      // Valid Video ID Check //
      let videoValid = true;
      videoIDs.map((videoID) => {
        if (!VIDEOS[videoID]) {
          videoValid = false;
        }
      });
      if (!videoValid) {
        throw new UserInputError(
          "One of your video ids is not a valid contentful ID"
        );
      }


      ////////////////////////
      // Creates Assginment //
      console.log("Creating Assignment")
      let newAssignment = await prisma.assignment.create({
        data: {
          dateStart: dateStart,
          dateDue: dateDue,
          title: title,
          description: description,
          childCarePlan: {
            connect: {
              id: childCarePlanID,
            },
          },
        },
      });
      console.log("Assignment Created")

      ////////////////////////////////////////////////////
      // Creates VIDEO Isnatnce for Each Assigned Video //
      for (var i = 0; i < videoIDs.length; i++) {
        let videoID = videoIDs[i];
        await prisma.video.create({
          data: {
            contentfulID: videoID,
            title: VIDEOS[videoID].title,
            description: "",
            level: VIDEOS[videoID].level,
            assignments: {
              connect: {
                id: newAssignment.id,
              },
            },
          },
        });
      }

      await createNotification(
        "New Assignment Created By " +
          context.user.firstName +
          " " +
          context.user.lastName,
        `Your New Assignment ${title} Is Due On ${dateFormat(dateDue, "m/dd")}`,
        "NEW_ASSIGNMENT",
        childCarePlan.child.id,
        context.user.id
      );


      return true;
    },
  },
};
