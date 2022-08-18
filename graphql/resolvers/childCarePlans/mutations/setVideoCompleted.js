/* eslint-disable import/no-anonymous-default-export */
import prisma from "@utils/prismaDB";
import { UserInputError } from "apollo-server-errors";

export default {
  Mutation: {
    setVideoCompleted: async (_, { videoID }, context) => {
      if (!context.user) throw new UserInputError("Login required");

      if (context.user.role !== "CHILD")
        throw new UserInputError("Only children can complete videosn");

      // Find the video based on the videoID
      let video = await prisma.video.findUnique({
        where: {
          id: videoID,
        },
        select: {
          id: true,
          
        },
      });

      // If they are not, then return user input error
      if (!video) {
        throw new UserInputError("Video does not exist");
      }

      // Perform video actions here

      return true;
    },
  },
};
