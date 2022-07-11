import GraphQLJSON from 'graphql-type-json';

// USER QUERIES
import getUser from './queries/getUser.js';

export default {
    Query: {
        // USER QUERIES
        ...getUser.Query,
    },
    JSON: GraphQLJSON,
}