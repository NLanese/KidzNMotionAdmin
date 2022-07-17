import GraphQLJSON from 'graphql-type-json';

// ORGANIZATION MUTATIONS
import editOrganizationSettings from './mutations/editOrganizationSettings.js';

export default {
    Mutation: {
        // ORGANIZATION MUTATIONS
        ...editOrganizationSettings.Mutation,
    },
    JSON: GraphQLJSON,
}