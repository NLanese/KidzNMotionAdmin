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
      email
      username
      firstName
      lastName
      title
      phoneNumber
      role
      createdAt

      msgNotifications
      missedDateNotifications
      appointmentNotifications

      ownedOrganization {
        id
        createdAt
        organizationType
        phoneNumber
        name
        name
        stripeSubscriptionID
        subscriptionStatus
        active
      }

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
    $organizationName: String
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

      organizationName: $organizationName
    ) {
      token
    }
  }
`;


const EDIT_ORGANIZATION_SETTINGS = gql`
  mutation editOrganizationSettings(
    $name: String!
    $phoneNumber: String!
  ) {
    editOrganizationSettings(
      name: $name
      phoneNumber: $phoneNumber
    ) {
      id
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
  // Organization
  EDIT_ORGANIZATION_SETTINGS
};
