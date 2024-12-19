/* eslint-disable import/no-anonymous-default-export */
import prisma from "@utils/prismaDB";
import { UserInputError } from "apollo-server-errors";
import VIDEOS from "@constants/videos";
import { createNotification } from "@helpers/api/notifications";
import dateFormat from "dateformat";

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
      let childCarePlan = await prisma.childCarePlan.findUnique({
        where: {
          id: childCarePlanID,
        },
        select: {
          id: true,
          child: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
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

      /////////////////////
      // Same Date Check //
      if (dateStart === dateDue){
        console.warn("Throwing an Error")
        throw new UserInputError("Assignment Start Date and Due Date must be different from each other");
      }


      let childUser = childCarePlan.child
      let carePlanGuardian = childCarePlan.child.guardian

      ///////////////////////////
      // Valid Care Plan Check //
      if (!childCarePlan) {
        throw new UserInputError("Child care plan does not exist");
      }

      ///////////////////////////
      // Valid Care Plan Check //
      if (childCarePlan.therapist.id !== context.user.id) {
        throw new UserInputError("Access denied, you do not appear to be this User's Therapist");
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
        throw new UserInputError("One of your selected videos is not valid.");
      }


      ////////////////////////
      // Creates Assginment //
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

      ////////////////////////////////////////////////////
      // Creates VIDEO Isnatnce for Each Assigned Video //
      for (var i = 0; i < videoIDs.length; i++) {
        let videoID = videoIDs[i];
        try{
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
          })
        }
        catch(error){
          throw new Error("There was an issue getting the needed values to create an Assignment!")
        }
      }

      await createNotification(
        "You have a New Assignment!",
        `Your New Assignment ${title} Is Due On ${dateFormat(dateDue, "m/dd")}`,
        "NEW_ASSIGNMENT",
        childUser.id,
        context.user.id
      );

      await createNotification(
        `${childUser.firstName} has a New Assignment!`,
        `Due On ${dateFormat(dateDue, "m/dd")}`,
        "NEW_ASSIGNMENT",
        carePlanGuardian.id,
        context.user.id
      );

      return true;
    },
  },
};
