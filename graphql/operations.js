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
      solo
      soloStripeSubscriptionID
      soloSubscriptionStatus
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
        childCarePlans {
          id
          level
          allVideoStatus
          therapist {
            id
            firstName
            lastName
          }
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
  mutation editOrganizationSettings($name: String!, $phoneNumber: String!) {
    editOrganizationSettings(name: $name, phoneNumber: $phoneNumber) {
      id
    }
  }
`;

const INVITE_USER = gql`
  mutation Mutation(
    $email: String!
    $role: String!
    $additionalInformation: JSON
  ) {
    inviteOrganizationUser(
      email: $email
      role: $role
      additionalInformation: $additionalInformation
    )
  }
`;

const GET_USER_CHAT_ROOMS = gql`
  query Query {
    getUserChatRooms {
      id
      users {
        id
        firstName
        lastName
        role
      }
    }
  }
`;

const GET_CHAT_ROOM_BY_ID = gql`
  query Query($id: String!) {
    getChatFromId(id: $id) {
      id
      users {
        id
        firstName
        lastName
        role
      }
      messages {
        createdAt
        content
        sentAt
        sentBy
      }
    }
  }
`;

const DYNAMIC_SEND_MESSAGE = gql`
  mutation Mutation($content: String!, $chatRoomID: String!) {
    sendMessage(content: $content, chatRoomID: $chatRoomID)
  }
`;

const CREATE_CHAT_ROOM = gql`
  mutation Mutation($otherParticipantID: String!) {
    createChatRoom(otherParticipantID: $otherParticipantID) {
      id
    }
  }
`;

const GET_USER_MEETINGS = gql`
  query Query {
    getMeetings {
      id
      createdAt
      meetingDateTime
      title
      completed
      type
      canceled
      pendingApproval
      approved
      users {
        id
        firstName
        lastName
        email
        role
      }
      meetingOwnerID
    }
  }
`;

const CREATE_MEETING = gql`
  mutation Mutation(
    $title: String!
    $meetingDateTime: Date!
    $type: String!
    $participantIDs: [String]!
  ) {
    createMeeting(
      title: $title
      meetingDateTime: $meetingDateTime
      type: $type
      participantIDs: $participantIDs
    ) {
      id
    }
  }
`;
const EDIT_MEETING = gql`
  mutation Mutation(
    $title: String!
    $meetingDateTime: Date!
    $cancelled: Boolean!
    $completed: Boolean!
    $meetingID: String!
    $type: String!
    $participantIDs: [String]!
  ) {
    editMeeting(
      title: $title
      meetingDateTime: $meetingDateTime
      type: $type
      participantIDs: $participantIDs
      meetingID: $meetingID
      cancelled: $cancelled
      completed: $completed
    ) {
      id
    }
  }
`;

const APPROVE_MEETING = gql`
  mutation Mutation(
    $meetingID: String!
    $approveMeeting: Boolean!

  ) {
    approveMeeting(
      meetingID: $meetingID
      approveMeeting: $approveMeeting

    ) {
      id
    }
  }
`;

const GENERATE_SOLO_GUARDIAN_CHECKOUT_LINK = gql`
  mutation Mutation {
    generateSoloGuardianCheckoutLink
  }
`;

const GENERATE_SOLO_GUARDIAN_PORTAL_LINK = gql`
  mutation Mutation {
    generateSoloGuardianPortalLink
  }
`;

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
  GET_USER_CHAT_ROOMS,
  GET_CHAT_ROOM_BY_ID,
  DYNAMIC_SEND_MESSAGE,
  CREATE_CHAT_ROOM,
  // MEETINGS
  GET_USER_MEETINGS,
  CREATE_MEETING,
  EDIT_MEETING,
  APPROVE_MEETING,
  // GUARDIAN
  GENERATE_SOLO_GUARDIAN_CHECKOUT_LINK,
  GENERATE_SOLO_GUARDIAN_PORTAL_LINK
};
