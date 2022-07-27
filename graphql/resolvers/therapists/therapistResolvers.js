import GraphQLJSON from 'graphql-type-json';

// THERAPIST MUTATIONS
import editNotificationSettings from './mutations/editNotificationSettings.js';

export default {
    Mutation: {
        // THERAPIST MUTATIONS
        ...editNotificationSettings.Mutation,
    },
    JSON: GraphQLJSON,
}