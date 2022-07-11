import GraphQLJSON from 'graphql-type-json';

// USER QUERIES
import getUser from './queries/getUser.js';

// USER MUTATIONS
import devCreateUser from './mutations/devCreateUser.js';

export default {
    Query: {
        // USER QUERIES
        ...getUser.Query,
    },
    Mutation: {
        // MUTING MUTATIONS
        ...devCreateUser.Mutation,
    },
    JSON: GraphQLJSON,
}