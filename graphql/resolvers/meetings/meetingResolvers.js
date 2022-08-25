import GraphQLJSON from 'graphql-type-json';


import createMeeting from "./mutations/createMeeting"
import editMeeting from "./mutations/editMeeting"
import approveMeeting from "./mutations/approveMeeting"

export default {
    Query: {
        // MEETING QUERIRES
       
    },
    Mutation: {
        // MEETING MUTATIONS
        ...createMeeting.Mutation,
        ...editMeeting.Mutation,
        ...approveMeeting.Mutation,
    },
    JSON: GraphQLJSON,
}