import GraphQLJSON from "graphql-type-json";

import superSetTherapist from "./mutations/setTherapist";
import getAllClients from "./queries/getAllClients";
import getAllTherapists from "./queries/getAllTherapists";
import superDeleteAssignments from "./mutations/deleteAssignments";
import superCreateExpiredAssignment from "./mutations/superCreateExpiredAssignment";
import superActivateUsers from "./mutations/superActivateUsers";

export default {
    Mutation: {
        ...superSetTherapist.Mutation,
        ...superDeleteAssignments.Mutation,
        ...superCreateExpiredAssignment.Mutation,
        ...superActivateUsers.Mutation
    },
    Query: {
        ...getAllClients.Query,
        ...getAllTherapists.Query
    },
    JSON: GraphQLJSON 
}