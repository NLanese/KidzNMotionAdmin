import GraphQLJSON from 'graphql-type-json';

// GUARDIAN MUTATIONS
import editChildSettings from './mutations/editChildSettings.js';
import swapToChildAccount from './mutations/swapToChildAccount.js';
import addChild from './mutations/addChild';

export default {
    Mutation: {
        // GUARDIAN MUTATIONS
        ...editChildSettings.Mutation,
        ...swapToChildAccount.Mutation,
        ...addChild.Mutation,
    },
    JSON: GraphQLJSON,
}