import GraphQLJSON from 'graphql-type-json';

// NEW RESOLVERS
import userResolvers from './user/userResolvers.js';

export default {
    Query: {
        ...userResolvers.Query,
    },
    Mutation: {
        ...userResolvers.Mutation,
    },
    JSON: GraphQLJSON,
}