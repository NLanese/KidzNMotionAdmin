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

      patientCarePlans {
        id
        level
        allVideoStatus
        child {
          id
          firstName
          lastName
          guardian {
            id
            firstName
            lastName
            email
          }
        }
      }

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
     
        organizationUsers {
          id
          active
          user {
            id
            role
            firstName
            lastName
            email
          }
        }
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
    $title: String
    $organizationInviteKey: String
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
      title: $title
      
      organizationName: $organizationName
      organizationInviteKey: $organizationInviteKey
    ) {
      token
    }
  }
`;

const EDIT_USER = gql`
  mutation Mutation(
    $email: String!
    $firstName: String!
    $lastName: String!
    $phoneNumber: String!
    $username: String!
    $title: String
  ) {
    editUser(
      email: $email
      firstName: $firstName
      lastName: $lastName
      phoneNumber: $phoneNumber
      username: $username
      title: $title
    )
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


const INVITE_USER = gql`
  mutation Mutation(
    $email: String!
    $role: String!
  ) {
    inviteOrganizationUser(
      email: $email
      role: $role
    )
  }
`;


const GET_USER_CHAT_ROOMS = gql`
query Query {
  getUserChatRooms {
    id
  }
}`

export {
  // Sign Up / Sign In
  LOGIN_USER,
  GET_USER,
  USER_SIGN_UP,
  REQUEST_PASSWORD_RESET,
  RESET_PASSWORD_FROM_KEY,
  EDIT_USER,
  // Organization
  EDIT_ORGANIZATION_SETTINGS,
  INVITE_USER,
  // MESSAGING
  GET_USER_CHAT_ROOMS
  
};
