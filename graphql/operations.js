import { gql } from "@apollo/client";

/////////////////////////////
///                       ///
///     Landing Page      ///
///                       ///
/////////////////////////////
const DYNAMIC_SIGN_IN = gql`
  mutation Mutation($email: String!, $password: String!) {
    dynamicSignIn(email: $email, password: $password) {
      id
      role
      token
      firstname
      signUpToken
      lastname
      email
      dsp {
        id
        paid
        createdAt
        accountStanding
      }
    }
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


const REQUEST_PASSWORD_RESET = gql`
  mutation Mutation($email: String!) {
    dynamicForgotPassword(email: $email)
  }
`; 

const RESET_PASSWORD = gql`
  mutation Mutation(
    $password: String!
    $token: String!
  ) {
    dynamicResetPassword(
      password: $password
      token: $token
    )
  }
`; 



export {
  // Sign Up / Sign In
  DYNAMIC_SIGN_IN,
  MANAGER_SIGN_UP,
  OWNER_SIGN_UP,
  REQUEST_PASSWORD_RESET,
  RESET_PASSWORD,

};