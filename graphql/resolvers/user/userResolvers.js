import GraphQLJSON from 'graphql-type-json';

// USER QUERIES
import getUser from './queries/getUser.js';

// USER MUTATIONS
import signUpUser from './mutations/signUpUser.js'
import devCreateUser from './mutations/devCreateUser.js';
import loginUser from './mutations/loginUser.js';
import logoutUser from './mutations/logoutUser.js';

export default {
    Query: {
        // USER QUERIES
        ...getUser.Query,
    },
    Mutation: {
        // MUTING MUTATIONS
        ...devCreateUser.Mutation,
        ...loginUser.Mutation,
        ...logoutUser.Mutation,
        ...signUpUser.Mutation
    },
    JSON: GraphQLJSON,
}