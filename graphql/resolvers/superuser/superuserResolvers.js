import GraphQLJSON from "graphql-type-json";

import superSetTherapist from "./mutations/setTherapist";

export default {
    Mutation: {
        ...superSetTherapist
    },
    JSON: GraphQLJSON
}