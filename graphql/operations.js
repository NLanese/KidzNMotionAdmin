import { gql } from "@apollo/client";

/////////////////////////////
///                       ///
///     Landing Page      ///
///                       ///
/////////////////////////////
const LOGIN_USER = gql`
  mutation Mutation($username: String!, $password: String!) {
    loginUser(username: $username, password: $password) {
      token
    }
  }
`;

const GET_USER = gql`
  query Query {
    getUser {
      id
      firstName
      lastName
      role
      email
      phoneNumber
      children {
        id
        firstName
        lastName
        childDateOfBirth
      }
    }
  }
`;

const REQUEST_PASSWORD_RESET = gql`
  mutation Mutation($email: String!) {
    requestResetPassword(email: $email)
  }
`; 

const RESET_PASSWORD_FROM_KEY = gql`
  mutation Mutation(
    $password: String!
    $resetPasswordKeyID: String!
  ) {
    resetPasswordFromKey(
      password: $password
      resetPasswordKeyID: $resetPasswordKeyID
    )
  }
`; 



const OWNER_SIGN_UP = gql`
  mutation OwnerSignUp(
    $email: String!
    $password: String!
    $firstname: String!
    $lastname: String!
    $phoneNumber: String!
  ) {
    ownerSignUp(
      email: $email
      password: $password
      firstname: $firstname
      lastname: $lastname
      phoneNumber: $phoneNumber
    ) {
      id
      role
      signUpToken
      token
      firstname
      lastname
      email
    }
  }
`;
const MANAGER_SIGN_UP = gql`
  mutation Mutation(
    $email: String!
    $password: String!
    $firstname: String!
    $lastname: String!
    $phoneNumber: String!
    $signupToken: String!
  ) {
    managerSignUp(
      email: $email
      password: $password
      firstname: $firstname
      lastname: $lastname
      phoneNumber: $phoneNumber
      signupToken: $signupToken
    ) {
      id
      role
      token
      firstname
      lastname
      email
    }
  }
`; 







export {
  // Sign Up / Sign In
  LOGIN_USER,
  GET_USER,
  MANAGER_SIGN_UP,
  OWNER_SIGN_UP,
  REQUEST_PASSWORD_RESET,
  RESET_PASSWORD_FROM_KEY,

};