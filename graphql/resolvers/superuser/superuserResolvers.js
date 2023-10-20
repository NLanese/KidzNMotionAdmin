import GraphQLJSON from "graphql-type-json";

import superSetTherapist from "./mutations/setTherapist";
import getAllClients from "./queries/getAllClients";
import getAllTherapists from "./queries/getAllTherapists";

export default {
    Mutation: {
        ...superSetTherapist.Mutation
    },
    Query: {
        ...getAllClients.Query,
        ...getAllTherapists.Query
    },
    JSON: GraphQLJSON
}