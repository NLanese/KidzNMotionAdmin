import { getAllMedalTypes } from "@helpers/medals";

export default {
  Query: {
    getAllMedalTypes: async (_, {}, context) => {
     
      let allMedalTypes = getAllMedalTypes()
      return allMedalTypes;
    },
  },
};
