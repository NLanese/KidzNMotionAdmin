import GraphQLJSON from 'graphql-type-json';

// GUARDIAN MUTATIONS
import editChildSettings from './mutations/editChildSettings.js';
import swapToChildAccount from './mutations/swapToChildAccount.js';
import addChild from './mutations/addChild';
import changeChildPassword from './mutations/changeChildPassword';
import generateSoloGuardianCheckoutLink from './mutations/generateSoloGuardianCheckoutLink';
import generateSoloGuardianPortalLink from './mutations/generateSoloGuardianPortalLink';

export default {
    Mutation: {
        // GUARDIAN MUTATIONS
        ...editChildSettings.Mutation,
        ...swapToChildAccount.Mutation,
        ...addChild.Mutation,
        ...changeChildPassword.Mutation,
        ...generateSoloGuardianCheckoutLink.Mutation,
        ...generateSoloGuardianPortalLink.Mutation,
    },
    JSON: GraphQLJSON,
}