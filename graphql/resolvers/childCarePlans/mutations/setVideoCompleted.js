/* eslint-disable import/no-anonymous-default-export */
import prisma from "@utils/prismaDB";
import { UserInputError } from "apollo-server-errors";
import { getAllMedalTypes } from "@helpers/medals";
import VIDEOS from "@constants/videos";
import makeMedal from "@/helpers/makeMedals";

export default {
  Mutation: {
    setVideoCompleted: async (_, { videoID, medalType, childID }, context) => {
      if (!context.user) throw new UserInputError("Login required");

      let video;
      let child;

      video = VIDEOS[videoID]


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
      if (childID) {

        // Find the child object to determine if the are under the guardian account
        let childUser = await prisma.user.findUnique({
          where: {
            id: childID,
          },
          select: {
            guardianId: true,
            id: true,
          },
        });

        // If they are not, then return user input error
        if (!childUser) {
          throw new UserInputError("Child does not exist");
        }
      }


      ///////////////////
      // CHECKS PASSED //
      ///////////////////
      if (childID && VIDEOS[videoID]) {

      //////////////////////
      // ASSIGNMENT CHECK //
      //////////////////////

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
                    dateState: true,
                    dateDue: true,
                  }
                }
              }
            }
          },
        });

        // Finds 'Video' Instances within this Child's Assignments
        let sameVideos = []
        childUser.childCarePlans[0].assignments.forEach(assignment => {
          console.log(assignment)
          console.log(assignment.videos)
          console.log("...........")
          assignment.videos.forEach(vid => {
            if (vid.contentfulID === video.id){
              sameVideos.push(vid.id)
            }
          })
        });

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

        // Create the medals based on what medal type was passed in
        // let medalObjectsToCreate = [];
        // if (medalType != "none") {
        //   getAllMedalTypes().map((medalObject) => {
        //     if (medalObject.videoID === video.contentfulID) {
        //       if (medalType === "gold") {
        //         medalObjectsToCreate.push(medalObject);
        //       } else if (medalType === "silver") {
        //         if (medalObject.level !== "GOLD") {
        //           medalObjectsToCreate.push(medalObject);
        //         }
        //       } else if (medalType === "bronze") {
        //         if (medalObject.level === "BRONZE") {
        //           medalObjectsToCreate.push(medalObject);
        //         }
        //       }
        //     }
        //   });

        // CREATES MEDALS 
        if (medalType === "GOLD"){
          // await makeMedal("GOLD", video.id, childUser.childCarePlans[0].id)
          // await makeMedal("SILVER", video.id, childUser.childCarePlans[0].id)
          // await makeMedal("BRONZE", video.id, childUser.childCarePlans[0].id)
        }
        else if (medalType === "SILVER"){
          // await makeMedal("SILVER", video.id, childUser.childCarePlans[0].id)
          // await makeMedal("BRONZE", video.id, childUser.childCarePlans[0].id)
        }
        else if (medalType === "BRONZE"){
          // await makeMedal("BRONZE", video.id, childUser.childCarePlans[0].id)
        }



        // Assignment-Video Complete
        await prisma.video.update({
          where: {
            id: video.id,
          },
          data: {
            completed: true,
          },
        });

        // Get the full video object
        let completedVideo = await prisma.video.findUnique({
          where: {
            id: video.id,
          },
          select: {
            id: true,
            completed: true,
            contentfulID: true,
            medals: {
              select: {
                id: true,
                title: true,
                description: true,
                level: true,
              },
            },
          },
        });

        return completedVideo;
        }
    },
  },
};
