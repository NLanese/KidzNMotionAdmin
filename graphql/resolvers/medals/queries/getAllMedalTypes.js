// import { getAllMedalTypes } from "@helpers/medals";

export default {
  Query: {
    getAllMedalTypes: async (_, {}, context) => {
     
      // let allMedalTypes = getAllMedalTypes()
      // return allMedalTypes;
      let MEDAL_IMAGES = {
        gold: "https://res.cloudinary.com/king-willy-studios/image/upload/v1660599577/Medals/Gold_yd3wo9.png",
        silver: "https://res.cloudinary.com/king-willy-studios/image/upload/v1660599577/Medals/Silver_sivwww.png",
        bronze: "https://res.cloudinary.com/king-willy-studios/image/upload/v1660599577/Medals/Bronze_x4j583.png"
      }
      for (var key in MEDAL_IMAGES) {
        videoFilesArray.map((videoFileObject) => {
          allMedalTypes.push({
            id: `${videoFileObject.id}_${key}`,
            videoID: videoFileObject.id,
            pictureURL: MEDAL_IMAGES[key],
            title: `${videoFileObject.title}`,
            level: key.toUpperCase()
          })
        })
      }
    
      return allMedalTypes;
    },
  },
};
