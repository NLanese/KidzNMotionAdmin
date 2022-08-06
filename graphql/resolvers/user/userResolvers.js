import GraphQLJSON from 'graphql-type-json';

// USER QUERIES
import getUser from './queries/getUser.js';

// USER MUTATIONS
import signUpUser from './mutations/signupUser.js';
import devCreateUser from './mutations/devCreateUser.js';
import loginUser from './mutations/loginUser.js';
import logoutUser from './mutations/logoutUser.js';
import requestResetPassword from './mutations/requestResetPassword.js';
import resetPasswordFromKey from './mutations/resetPasswordFromKey.js';
import editUser from './mutations/editUser.js';
import confirmPassword from './mutations/confirmPassword.js';
import changeProfilePicture from './mutations/changeProfilePicture.js';
import editUserNotificationSettings from './mutations/editUserNotificationSettings.js';

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
        ...resetPasswordFromKey.Mutation,
        ...editUser.Mutation,
        ...confirmPassword.Mutation,
        ...changeProfilePicture.Mutation,
        ...editUserNotificationSettings.Mutation,
    },
    JSON: GraphQLJSON,
}