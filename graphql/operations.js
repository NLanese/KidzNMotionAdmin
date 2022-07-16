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
  mutation Mutation($password: String!, $resetPasswordKeyID: String!) {
    resetPasswordFromKey(
      password: $password
      resetPasswordKeyID: $resetPasswordKeyID
    )
  }
`;

const USER_SIGN_UP = gql`
  mutation signUpUser(
    $email: String!
    $password: String!
    $firstName: String!
    $lastName: String!
    $phoneNumber: String!
    $role: String!
    
    $childFirstName: String
    $childLastName: String
    $childDateOfBirth: String

  ) {
    signUpUser(
      email: $email
      password: $password
      firstName: $firstName
      lastName: $lastName
      phoneNumber: $phoneNumber
      role: $role

      childFirstName: $childFirstName
      childLastName: $childLastName
      childDateOfBirth: $childDateOfBirth
    ) {
      token
    }
  }
`;

export {
  // Sign Up / Sign In
  LOGIN_USER,
  GET_USER,
  USER_SIGN_UP,
  REQUEST_PASSWORD_RESET,
  RESET_PASSWORD_FROM_KEY,
};
