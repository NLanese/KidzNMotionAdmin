import GraphQLJSON from "graphql-type-json";

// NEW RESOLVERS
import userResolvers from "./user/userResolvers.js";
import chatRoomResolvers from "./chatrooms/chatRoomResolvers.js";
import organizationResolvers from "./organization/organizationResolvers.js";
import guardianResolvers from "./guardians/guardianResolvers.js";
import therapistResolvers from "./therapists/therapistResolvers.js";
import videoResolvers from "./videos/videoResolvers.js";
import medalResolvers from "./medals/medalResolvers.js";
import childCarePlanResolvers from "./childCarePlans/childCarePlanResolvers.js";
import meetingResolvers from "./meetings/meetingResolvers.js";
import notificationResolvers from "./notifications/notificationResolvers.js";
import superuserResolvers from "./superuser/superuserResolvers.js";


// Assign the object to a variable
const resolvers = {
  Query: {
    ...userResolvers.Query,
    ...chatRoomResolvers.Query,
    ...videoResolvers.Query,
    ...medalResolvers.Query,
    ...childCarePlanResolvers.Query,
    ...meetingResolvers.Query,
    ...notificationResolvers.Query,
    ...superuserResolvers.Query,
  },
  Mutation: {
    ...userResolvers.Mutation,
    ...organizationResolvers.Mutation,
    ...guardianResolvers.Mutation,
    ...therapistResolvers.Mutation,
    ...chatRoomResolvers.Mutation,
    ...childCarePlanResolvers.Mutation,
    ...meetingResolvers.Mutation,
    ...notificationResolvers.Mutation,
    ...superuserResolvers.Mutation,
  },
  JSON: GraphQLJSON,
};

// Export the variable
export default resolvers;
