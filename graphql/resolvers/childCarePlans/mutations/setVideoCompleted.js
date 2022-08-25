/* eslint-disable import/no-anonymous-default-export */
import prisma from "@utils/prismaDB";
import { UserInputError } from "apollo-server-errors";
import { getAllMedalTypes } from "@helpers/medals";
import VIDEOS from "@constants/videos";

export default {
  Mutation: {
    setVideoCompleted: async (_, { videoID, medalType }, context) => {
      if (!context.user) throw new UserInputError("Login required");

      // Find the video based on the videoID
      let video = await prisma.video.findUnique({
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
      if (!video) {
        throw new UserInputError("Video does not exist");
      }

      if (!video.contentfulID) {
        throw new UserInputError("Video file id needs to be filled in.");
      }

      if (!VIDEOS[video.contentfulID]) {
        throw new UserInputError("Video file id needs to match a video.");
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

      if (medalType != "none"){

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
          id: videoID,
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
              level: true
            },
          },
        },
      });

      return completedVideo;
    },
  },
};
