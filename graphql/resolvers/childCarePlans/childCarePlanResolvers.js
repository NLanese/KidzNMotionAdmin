import GraphQLJSON from 'graphql-type-json';

// CHILD CARE PLAN QUERIES
import getChildCarePlanVideoStatistics from './queries/getChildCarePlanVideoStatistics';

// CHILD CARE PLAN MUTATIONS
import toggleAssignmentSeen from './mutations/toggleAssignmentSeen';
import editChildCarePlan from './mutations/editChildCarePlan';
import setVideoCompleted from './mutations/setVideoCompleted';
import createComment from './mutations/createComment';
import deleteComment from './mutations/deleteComment';


export default {
    Query: {
        ...getChildCarePlanVideoStatistics.Query,
    },
    Mutation: {
        // CHILD CARE PLAN MUTATIONS
        ...toggleAssignmentSeen.Mutation,
        ...editChildCarePlan.Mutation,
        ...setVideoCompleted.Mutation,
        ...createComment.Mutation,
        ...deleteComment.Mutation
      
    },
    JSON: GraphQLJSON,
}