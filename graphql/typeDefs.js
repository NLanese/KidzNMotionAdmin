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

  type UserPayLoad {
    token:String
    user:User
  }
  
  # ---------------------------------------- END SCHEMAS ----------------------------------------
  type Query {
    #### USER QUERIES ####     
    getUser: User
    ##########################
  }
  # ---------------------------------------- END QUERY ----------------------------------------
  type Mutation {
    #### USER MUTATIONS ####     
    devCreateUser(password: String!): User
    loginUser(email: String!, password: String!): UserPayLoad
    logoutUser: String
    ##########################
  }
  # ---------------------------------------- END MUTATIONS ----------------------------------------

`;

export default typeDefs;
