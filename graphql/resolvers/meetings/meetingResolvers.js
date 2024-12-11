import GraphQLJSON from 'graphql-type-json';


import createMeeting from "./mutations/createMeeting"
import editMeeting from "./mutations/editMeeting"
import approveMeeting from "./mutations/approveMeeting"

import getMeetings from "./queries/getMeetings"

export default {
    Query: {
        // MEETING QUERIRES
    ...getMeetings.Query
    },
    Mutation: {
        // MEETING MUTATIONS
        ...createMeeting.Mutation,
        ...editMeeting.Mutation,
        ...approveMeeting.Mutation,
    },
    JSON: GraphQLJSON,
}