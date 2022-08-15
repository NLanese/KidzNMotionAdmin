import GraphQLJSON from 'graphql-type-json';

// NEW RESOLVERS
import userResolvers from './user/userResolvers.js';
import chatRoomResolvers from './chatrooms/chatRoomResolvers.js';
import organizationResolvers from './organization/organizationResolvers.js';
import guardianResolvers from './guardians/guardianResolvers.js';
import therapistResolvers from './therapists/therapistResolvers.js';
import videoResolvers from './videos/videoResolvers.js';
import medalResolvers from './medals/medalResolvers.js';

export default {
    Query: {
        ...userResolvers.Query,
        ...chatRoomResolvers.Query,
        ...videoResolvers.Query,
        ...medalResolvers.Query,
        
    },
    Mutation: {
        ...userResolvers.Mutation,
        ...organizationResolvers.Mutation,
        ...guardianResolvers.Mutation,
        ...therapistResolvers.Mutation,
        ...chatRoomResolvers.Mutation,
    },
    JSON: GraphQLJSON,
}