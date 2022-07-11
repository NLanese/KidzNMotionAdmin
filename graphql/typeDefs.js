import { gql } from "apollo-server";

const typeDefs = gql`
  scalar Date
  scalar JSON

  type User {
    id: ID
    email: String
    name: String
    firstName: String
    lastName: String
  }
  
  # ---------------------------------------- END SCHEMAS ----------------------------------------
  type Query {
    getUser: User
  }
  # ---------------------------------------- END QUERY ----------------------------------------
  type Mutation {
    devCreateUser: User
  }
  # ---------------------------------------- END MUTATIONS ----------------------------------------

`;

export default typeDefs;
