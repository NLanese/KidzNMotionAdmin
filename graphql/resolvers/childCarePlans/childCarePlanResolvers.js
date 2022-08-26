import GraphQLJSON from 'graphql-type-json';

// CHILD CARE PLAN QUERIES
import getChildVideoStatistics from './queries/getChildVideoStatistics';

// CHILD CARE PLAN MUTATIONS
import toggleAssignmentSeen from './mutations/toggleAssignmentSeen';
import editChildCarePlan from './mutations/editChildCarePlan';
import setVideoCompleted from './mutations/setVideoCompleted';
import createComment from './mutations/createComment';
import deleteComment from './mutations/deleteComment';
import createAssignment from './mutations/createAssignment';


export default {
    Query: {
        ...getChildVideoStatistics.Query,
    },
    Mutation: {
        // CHILD CARE PLAN MUTATIONS
        ...toggleAssignmentSeen.Mutation,
        ...editChildCarePlan.Mutation,
        ...setVideoCompleted.Mutation,
        ...createComment.Mutation,
        ...deleteComment.Mutation,
        ...createAssignment.Mutation,
      
    },
    JSON: GraphQLJSON,
}