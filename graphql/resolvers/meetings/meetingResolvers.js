import GraphQLJSON from 'graphql-type-json';


import createMeeting from "./mutations/createMeeting"

export default {
    Query: {
        // MEETING QUERIRES
       
    },
    Mutation: {
        // MEETING MUTATIONS
        ...createMeeting.Mutation,
    },
    JSON: GraphQLJSON,
}