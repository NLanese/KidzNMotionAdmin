import GraphQLJSON from 'graphql-type-json';

// USER QUERIES
import getUser from './queries/getUser.js';

// USER MUTATIONS
import signUpUser from './mutations/signupUser.js';
import devCreateUser from './mutations/devCreateUser.js';
import loginUser from './mutations/loginUser.js';
import logoutUser from './mutations/logoutUser.js';
import requestResetPassword from './mutations/requestResetPassword.js';

export default {
    Query: {
        // USER QUERIES
        ...getUser.Query,
    },
    Mutation: {
        // USER MUTATIONS
        ...devCreateUser.Mutation,
        ...loginUser.Mutation,
        ...logoutUser.Mutation,
        ...signUpUser.Mutation,
        ...requestResetPassword.Mutation,
    },
    JSON: GraphQLJSON,
}