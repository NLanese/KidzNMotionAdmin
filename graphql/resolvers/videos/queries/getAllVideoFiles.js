import VIDEOS from "@constants/videos";

export default {
  Query: {
    getAllVideoFiles: async (_, {}, context) => {
      let videoFilesArray = Object.values(VIDEOS);
    
      // Gets all videos from the main video file and returns array of all v  ideo objects
      return videoFilesArray;
    },
  },
};
