import GraphQLJSON from "graphql-type-json";

import superSetTherapist from "./mutations/setTherapist";
import getAllClients from "./queries/getAllClients";
import getAllTherapists from "./queries/getAllTherapists";
import superDeleteAssignments from "./mutations/deleteAssignments";
import superCreateExpiredAssignment from "./mutations/superCreateExpiredAssignment";

export default {
    Mutation: {
        ...superSetTherapist.Mutation,
        ...superDeleteAssignments.Mutation,
        ...superCreateExpiredAssignment.Mutation,
    },
    Query: {
        ...getAllClients.Query,
        ...getAllTherapists.Query
    },
    JSON: GraphQLJSON
}