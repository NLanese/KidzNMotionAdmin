import GraphQLJSON from 'graphql-type-json';

// NEW RESOLVERS
import userResolvers from './user/userResolvers.js';
import chatRoomResolvers from './chatrooms/chatRoomResolvers.js';
import organizationResolvers from './organization/organizationResolvers.js';

export default {
    Query: {
        ...userResolvers.Query,
        ...chatRoomResolvers.Query,
    },
    Mutation: {
        ...userResolvers.Mutation,
        ...organizationResolvers.Mutation
    },
    JSON: GraphQLJSON,
}