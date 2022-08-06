import GraphQLJSON from 'graphql-type-json';

// ORGANIZATION MUTATIONS
import editOrganizationSettings from './mutations/editOrganizationSettings.js';
import inviteOrganizationUser from './mutations/inviteOrganizationUser.js';
import editOrganizationSubscriptionStatus from './mutations/editOrganizationSubscriptionStatus.js';

export default {
    Mutation: {
        // ORGANIZATION MUTATIONS
        ...editOrganizationSettings.Mutation,
        ...inviteOrganizationUser.Mutation,
        ...editOrganizationSubscriptionStatus.Mutation,
    },
    JSON: GraphQLJSON,
}