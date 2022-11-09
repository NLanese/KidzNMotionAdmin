/* eslint-disable import/no-anonymous-default-export */
import prisma from "@utils/prismaDB";
import { UserInputError } from "apollo-server-errors";
import { getAllMedalTypes } from "@helpers/medals";
import VIDEOS from "@constants/videos";

export default {
  Mutation: {
    setVideoCompleted: async (_, { videoID, medalType, childID }, context) => {
      if (!context.user) throw new UserInputError("Login required");

      let video;
      let child;

      // Find the video based on the videoID
      video = await prisma.video.findUnique({
        where: {
          id: videoID,
        },
        select: {
          id: true,
          completed: true,
          contentfulID: true,
          medals: {
            select: {
              id: true,
            },
          },
        },
      });

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
      } else {
        if (!childID) {
          throw new UserInputError(
            "If you are creating an indepentent video, you also need to pass in the child ID"
          );
        }
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

      if (childID && VIDEOS[videoID]) {
        video = await prisma.video.create({
          data: {
            contentfulID: videoID,
            title: VIDEOS[videoID].title,
            description: "",
            level: VIDEOS[videoID].level,
            users: {
              connect: {
                id: childID,
              },
            },
          },
        });
      }

      // Perform video actions here
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
      let medalObjectsToCreate = [];

      if (medalType != "none") {
        getAllMedalTypes().map((medalObject) => {
          if (medalObject.videoID === video.contentfulID) {
            if (medalType === "gold") {
              medalObjectsToCreate.push(medalObject);
            } else if (medalType === "silver") {
              if (medalObject.level !== "GOLD") {
                medalObjectsToCreate.push(medalObject);
              }
            } else if (medalType === "bronze") {
              if (medalObject.level === "BRONZE") {
                medalObjectsToCreate.push(medalObject);
              }
            }
          }
        });

        for (var i = 0; i < medalObjectsToCreate.length; i++) {
          let medalToCreate = medalObjectsToCreate[i];
          if (medalType.toUpperCase() === medalToCreate.level) {
            let newMedal = await prisma.medal.create({
              data: {
                title: medalToCreate.title,
                level: medalToCreate.level,
                description: medalToCreate.pictureURL,
                video: {
                  connect: {
                    id: video.id,
                  },
                },
              },
            });
          }
        }
      }

      // Update the video
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
    },
  },
};
