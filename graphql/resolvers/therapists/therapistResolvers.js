import GraphQLJSON from 'graphql-type-json';

// THERAPIST MUTATIONS
import editNotificationSettings from './mutations/editNotificationSettings.js';
import claimPatient from './mutations/claimPatient.js';
import invitePatient from './mutations/invitePatient.js';

export default {
    Mutation: {
        // THERAPIST MUTATIONS
        ...editNotificationSettings.Mutation,
        ...claimPatient.Mutation,
        ...invitePatient.Mutation,

    },
    JSON: GraphQLJSON,
}