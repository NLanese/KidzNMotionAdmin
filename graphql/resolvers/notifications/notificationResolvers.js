import GraphQLJSON from 'graphql-type-json';

// NOTIFICATION QUERIES
import getNotifications from './queries/getNotifications.js';

// NOTIFICATION MUTATIONS
import dismissNotification from './mutations/dismissNotification.js';


export default {
    Query: {
        // NOTIFICATION QUERIES
        ...getNotifications.Query,
    },
    Mutation: {
        // NOTIFICATION MUTATIONS
        ...dismissNotification.Mutation,
    },
    JSON: GraphQLJSON,
}