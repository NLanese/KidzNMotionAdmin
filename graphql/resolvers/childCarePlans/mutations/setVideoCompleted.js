/* eslint-disable import/no-anonymous-default-export */
import prisma from "@utils/prismaDB";
import { UserInputError } from "apollo-server-errors";
import { makeMedal } from "@helpers/medals";
import VIDEOS from "@constants/videos";
import determineAssignmentNewlyCompleted from "../../../../functions/AssignmentHelpers/determineAssignmentCompletion";
import markAssignmentComplete from "../../../../functions/AssignmentHelpers/markAssignmentComplete";

export default {
  Mutation: {
    setVideoCompleted: async (_, { videoID, medalType, childID }, context) => {
      if (!context.user) throw new UserInputError("Login required");
      let video = VIDEOS[videoID]


      ////////////
      // CHECKS //
      ////////////

      // If they are not, then return user input error
      if (!video && !VIDEOS[videoID]) {
        throw new UserInputError("Video does not exist");
      }

      // IF the video id does not match
      if (!VIDEOS[videoID] && video) {
        if (!video.contentfulID) {
          throw new UserInputError("Video file id needs to be filled in.");
        }

        if (!VIDEOS[video.contentfulID]) {
          throw new UserInputError("Video file id needs to match a video.");
        }
      }
      // If not Child ID
      if (!childID) {
        throw new UserInputError(
          "If you are creating an indepentent video, you also need to pass in the child ID"
        );
      }

      // Find the child object to determine if the are under the guardian account
      let childUser = await prisma.user.findUnique({
        where: {
          id: childID,
        },
        select: {
            id: true,
            childCarePlans: {
              select: {
                id: true,
                assignments: {
                  select: {
                    id: true, 
                    videos: {
                      select: {
                        id: true,
                        contentfulID: true,
                        completed: true
                      }
                    },
                    dateStart: true,
                    dateDue: true,
                  }
                }
              }
            }
          },
      });

      // If they are not, then return user input error
      if (!childUser) {
        throw new UserInputError("Child does not exist");
      }


      ///////////////////
      // CHECKS PASSED //
      ///////////////////
      
      if (!childID || !VIDEOS[videoID]) {
        return
      }

      //////////////////////
      // ASSIGNMENT CHECK //
      //////////////////////  

        // Finds 'Video' Instances within this Child's Assignments
        let sameVideos = []
        let foundAssignments = childUser.childCarePlans[0].assignments
        foundAssignments.forEach(assignment => {
          if (new Date(assignment.dateStart) < new Date()){
            assignment.videos.forEach(vid => {
              if (vid.contentfulID === video.id){
                "ADDING VIDEO"
                sameVideos.push(vid.id)
              }
            })
          }
        })          

        // Runs the Mutation on each applicable 
        sameVideos.forEach(async (vidID) => {
          await prisma.video.update({
            where: {
              id: vidID
            },
            data: {
              completed: true
            }
          })
        })

        // Sees if Assignment is completed or not
        foundAssignments.forEach(assignment => {
          if (determineAssignmentNewlyCompleted(assignment)){
            markAssignmentComplete(assignment, prisma)
          }
        })



        ////////////////////
        // MEDAL CREATION //
        ////////////////////

        // Checks Valid Medals
        if (
          medalType !== "bronze" &&
          medalType !== "silver" &&
          medalType !== "gold" &&
          medalType !== "none"
        ) {
          throw new UserInputError(
            "Medal types can only be (bronze, silver, or gold)"
          );
        }


        // CREATES MEDALS 
        if (medalType.toUpperCase() === "GOLD"){
          await makeMedal("GOLD", video.id, childUser.childCarePlans[0].id)
          await makeMedal("SILVER", video.id, childUser.childCarePlans[0].id)
          await makeMedal("BRONZE", video.id, childUser.childCarePlans[0].id)
        }
        else if (medalType.toUpperCase() === "SILVER"){
          await makeMedal("SILVER", video.id, childUser.childCarePlans[0].id)
          await makeMedal("BRONZE", video.id, childUser.childCarePlans[0].id)
        }
        else if (medalType.toUpperCase() === "BRONZE"){
          await makeMedal("BRONZE", video.id, childUser.childCarePlans[0].id)
        }

        return true;
    },
  },
};
