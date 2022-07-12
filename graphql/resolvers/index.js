import GraphQLJSON from 'graphql-type-json';

// NEW RESOLVERS
import userResolvers from './user/userResolvers.js';
import chatRoomResolvers from './chatrooms/chatRoomResolvers.js';

export default {
    Query: {
        ...userResolvers.Query,
        ...chatRoomResolvers.Query,
    },
    Mutation: {
        ...userResolvers.Mutation,
    },
    JSON: GraphQLJSON,
}