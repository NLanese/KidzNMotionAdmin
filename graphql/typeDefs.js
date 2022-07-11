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

  type Query {
    getUser(id: String): User
  }

`;

export default typeDefs;
