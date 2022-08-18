import GraphQLJSON from 'graphql-type-json';

// CHILD CARE PLAN MUTATIONS
import toggleAssignmentSeen from './mutations/toggleAssignmentSeen';

export default {
    Mutation: {
        // CHILD CARE PLAN MUTATIONS
        ...toggleAssignmentSeen.Mutation
      
    },
    JSON: GraphQLJSON,
}