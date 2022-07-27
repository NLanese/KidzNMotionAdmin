import GraphQLJSON from 'graphql-type-json';

// GUARDIAN MUTATIONS
import editChildSettings from './mutations/editChildSettings.js';

export default {
    Mutation: {
        // GUARDIAN MUTATIONS
        ...editChildSettings.Mutation,
    },
    JSON: GraphQLJSON,
}