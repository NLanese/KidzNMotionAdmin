import GraphQLJSON from 'graphql-type-json';

// ORGANIZATION MUTATIONS
import editOrganizationSettings from './mutations/editOrganizationSettings.js';
import inviteOrganizationUser from './mutations/inviteOrganizationUser.js';

export default {
    Mutation: {
        // ORGANIZATION MUTATIONS
        ...editOrganizationSettings.Mutation,
        ...inviteOrganizationUser.Mutation,
    },
    JSON: GraphQLJSON,
}