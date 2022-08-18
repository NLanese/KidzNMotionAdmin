import GraphQLJSON from 'graphql-type-json';

// CHILD CARE PLAN MUTATIONS
import toggleAssignmentSeen from './mutations/toggleAssignmentSeen';
import editChildCarePlan from './mutations/editChildCarePlan';
import setVideoCompleted from './mutations/setVideoCompleted';


export default {
    Mutation: {
        // CHILD CARE PLAN MUTATIONS
        ...toggleAssignmentSeen.Mutation,
        ...editChildCarePlan.Mutation,
        ...setVideoCompleted.Mutation
      
    },
    JSON: GraphQLJSON,
}