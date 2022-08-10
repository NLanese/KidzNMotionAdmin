import VIDEOS from "@constants/videos";

export default {
  Query: {
    getAllVideoFiles: async (_, {}, context) => {
      let videoFilesArray = Object.values(VIDEOS);
      let videoFilesIds = Object.keys(VIDEOS);

      for (var i = 0; i < videoFilesArray.length; i++) {
        videoFilesArray[i].id = videoFilesIds[i]
      }

      // Gets all videos from the main video file and returns array of all v  ideo objects
      return videoFilesArray;
    },
  },
};
