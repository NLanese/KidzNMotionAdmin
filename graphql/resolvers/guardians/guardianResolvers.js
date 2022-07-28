import GraphQLJSON from 'graphql-type-json';

// GUARDIAN MUTATIONS
import editChildSettings from './mutations/editChildSettings.js';
import swapToChildAccount from './mutations/swapToChildAccount.js';

export default {
    Mutation: {
        // GUARDIAN MUTATIONS
        ...editChildSettings.Mutation,
        ...swapToChildAccount.Mutation,
    },
    JSON: GraphQLJSON,
}