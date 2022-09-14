import GraphQLJSON from 'graphql-type-json';

// THERAPIST MUTATIONS
import editNotificationSettings from './mutations/editNotificationSettings.js';
import claimPatient from './mutations/claimPatient.js';

export default {
    Mutation: {
        // THERAPIST MUTATIONS
        ...editNotificationSettings.Mutation,
        ...claimPatient.Mutation,

    },
    JSON: GraphQLJSON,
}