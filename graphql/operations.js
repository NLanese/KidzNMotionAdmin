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

/////////////
// QUERIES //
/////////////


// GENERAL
const GET_USER = gql`
  query Query {
    getUser {
      id
      email
      username
      firstName
      lastName
      title
      subscriptionStatus
      diagnosis
      phoneNumber
      solo
      profilePic
      webAppColorSettings
      soloStripeSubscriptionID
      role
      createdAt

      msgNotifications
      missedDateNotifications
      appointmentNotifications

      patientCarePlans {
        id
        childId
        therapist {
          id
          email
          firstName
          lastName
        }
        level
        active
        allVideoStatus
        blockedVideos
        weeklyVideoStatus
        assignments {
          id
          createdAt
          dateStart
          dateDue
          seen
          notificationSent
          title
          description
          videos {
            id
            contentfulID
            completed
            file {
              id
              level
              title
              description
              videoURL
              previewPictureURL
            }
            medals {
              id
              title
              image
              description
              createdAt
              level
            }
          }
        }
        comments {
          id
          content
          createdAt
          assignmentId
          videoId
        }
        child {
          id
          firstName
          lastName
          diagnosis
          guardian {
            id
            firstName
            lastName
            phoneNumber
            email
          }
        }
      }

      organizations {
        id
        organization {
          id
          active
          name
          stripeSubscriptionID
          subscriptionStatus
          organizationUsers {
            user {
              role
              firstName
              lastName
              id
              childDateOfBirth
              phoneNumber
              email
              profilePic
              guardianId
              childCarePlans {
                id
              }
            }
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
        diagnosis
        childDateOfBirth
        childCarePlans {
          id
          level
          allVideoStatus
          assignments {
            id
            createdAt
            dateStart
            dateDue
            seen
            title
            description
            videos {
              id
              contentfulID
              completed
              file {
                id
                level
                title
                description
                videoURL
                previewPictureURL
              }
              medals {
                id
                title
                image
                description
                level
              }
            }
          }
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

// CLIENTs
const GET_ALL_CLIENTS = gql`
  query Query {
    getAllClients {
      id
      role
      firstName
      lastName
      email
      username
      phoneNumber
      soloStripeSubscriptionID
      solo
      accessMessages
      accessSettings
      leaveApp
      guardian{
        id
      }
      childCarePlans {
        id 
        level
        allVideoStatus
        weeklyVideoStatus
        comments{
          id
          content
          videoId 
          assignmentId
        }
        child{
          id
        }
        therapist{
          id 
          firstName
          lastName
        }
      }
    }
  }
`;

// THERAPISTS
const GET_ALL_THERAPISTS = gql`
  query Query {
    getAllTherapists {
      id
      email
      username
      firstName
      lastName
      title
      subscriptionStatus
      diagnosis
      phoneNumber
      solo
      profilePic
      webAppColorSettings
      soloStripeSubscriptionID
      role
      createdAt

      msgNotifications
      missedDateNotifications
      appointmentNotifications

      patientCarePlans {
        id
        childId
        therapist {
          id
          email
          firstName
          lastName
        }
        level
        active
        allVideoStatus
        blockedVideos
        weeklyVideoStatus
        assignments {
          id
          createdAt
          dateStart
          dateDue
          seen
          notificationSent
          title
          description
          videos {
            id
            contentfulID
            completed
            file {
              id
              level
              title
              description
              videoURL
              previewPictureURL
            }
            medals {
              id
              title
              image
              description
              createdAt
              level
            }
          }
        }
        comments {
          id
          content
          createdAt
          assignmentId
          videoId
        }
        child {
          id
          firstName
          lastName
          diagnosis
          guardian {
            id
            firstName
            lastName
            phoneNumber
            email
          }
        }
      }

      organizations {
        id
        organization {
          id
          active
          name
          stripeSubscriptionID
          subscriptionStatus
          organizationUsers {
            user {
              role
              firstName
              lastName
              id
              childDateOfBirth
              phoneNumber
              email
              profilePic
              guardianId
              childCarePlans {
                id
              }
            }
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
        diagnosis
        childDateOfBirth
        childCarePlans {
          id
          level
          allVideoStatus
          assignments {
            id
            createdAt
            dateStart
            dateDue
            seen
            title
            description
            videos {
              id
              contentfulID
              completed
              file {
                id
                level
                title
                description
                videoURL
                previewPictureURL
              }
              medals {
                id
                title
                image
                description
                level
              }
            }
          }
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

// VIDEOS
const GET_VIDEO_LIBRARY = gql`
  query Query {
    getAllVideoFiles {
      id
      level
      title
      description
      videoURL
      previewPictureURL
    }
  }
`;

// CHAT QUERIES
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

// MEETINGS
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

// ASSIGNMENTS
const GET_USER_ASSIGNMENTS = gql`
  query Query{
    getAssignments {
      id
      dateStart
      dateDue
      title
      seen
      childCarePlan {
        id
        child {
          id 
          firstName
          lastName
        }
      }
      videos{
        id
        contentfulID
        completed
        title
      }
    }
  }
`

// MEDALS
const GET_CHILD_VIDEO_STATISTICS = gql`
  query Query(
      $childID: String!,
  ){
    getChildVideoStatistics(
      childID: $childID
    )
  }
`


//////////////
// SECURITY //
//////////////

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

/////////////////////
// SUPER MUTATIONS //
/////////////////////

const SUPER_SET_THERAPIST = gql`
  mutation Mutation(
    $childCarePlanID: String!, 
    $childID: String!, 
    $guardianID: String!, 
    $therapistID: String!, 
    $superUserKey: String!
  ){
    superSetTherapist(
      childCarePlanID: $childCarePlanID,
      childID: $childID
      guardianID: $guardianID
      therapistID: $therapistID,
      superUserKey: $superUserKey
    ){
      id
      childId
      active
      therapist{
        id
        firstName
        lastName
      }
    }
  }
`

const SUPER_DELETE_ASSIGNMENTS = gql`
  mutation Mutation(
    $idArray: [String]!,
    $superUserKey: String!
  ){
    superDeleteAssignments(
      idArray: $idArray,
      superUserKey: $superUserKey
    )
  }
`

const SUPER_DELETE_USER = gql`
  mutation Mutation(
    $userId: String!
    $superUserKey: String!
  ){
    requestAccountDeletion(
      userId: $userId,
      superUserKey: $superUserKey
    )
  }
`

const SUPER_CREATE_EXPIRED_ASSIGNMENTS = gql`
mutation Mutation(
  $superUserKey: String!
){
  superCreateExpiredAssignment(
    superUserKey: $superUserKey
  )
}`

const SUPER_ACTIVATE_USERS = gql`
  mutation Mutation(
    $idArray: [String]!,
    $superUserKey: String!
  ){
    superActivateUsers(
      idArray: $idArray,
      superUserKey: $superUserKey
    )
  }
`

/////////////
// EDITORS //
/////////////

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


/////////////////////////
// CARE PLAN MUTATIONS //
/////////////////////////

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

// Approves a pending Meeting
const APPROVE_MEETING = gql`
  mutation Mutation($meetingID: String!, $approveMeeting: Boolean!) {
    approveMeeting(meetingID: $meetingID, approveMeeting: $approveMeeting) {
      id
    }
  }
`;

// Creates Assignment
const CREATE_ASSIGNMENT = gql`
  mutation Mutation(
    $childCarePlanID: String!
    $dateStart: String!
    $dateDue: String!
    $title: String!
    $description: String!
    $videoIDs: [String]!
  ){
    createAssignment(
      childCarePlanID: $childCarePlanID,
      dateStart: $dateStart,
      dateDue: $dateDue,
      title: $title,
      description: $description,
      videoIDs: $videoIDs
    )
  }
`

// Sets Assignment to Seen
const TOGGLE_ASSGINMENT_SEEN = gql`
    mutation Mutation(
      $assignmentID: String!,
      $hasSeen: Boolean!
    ){
      toggleAssignmentSeen(
        assignmentID: $assignmentID,
        hasSeen: $hasSeen
      ){
        id
      }
    }
`


/////////////////////////
// CHAT ROOM MUTATIONS //
/////////////////////////

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




const GENERATE_SOLO_GUARDIAN_CHECKOUT_LINK = gql`
  mutation Mutation {
    generateSoloGuardianCheckoutLink
  }
`;

const GENERATE_ANNUAL_SOLO_GUARDIAN_CHECKOUT_LINK = gql`
  mutation Mutation {
    generateAnnualSoloGuardianCheckoutLink
  }
`;

const GENERATE_SOLO_GUARDIAN_PORTAL_LINK = gql`
  mutation Mutation {
    generateSoloGuardianPortalLink
  }
`;

const EDIT_CHILD_CARE_PLAN_DETAILS = gql`
  mutation Mutation(
    $childCarePlanID: String!
    $diagnosis: String!
    $level: Int!
    $blockedVideos: JSON
  ) {
    editChildCarePlan(
      childCarePlanID: $childCarePlanID
      diagnosis: $diagnosis
      level: $level
      blockedVideos: $blockedVideos
    ) {
      id
    }
  }
`;

const CREATE_CHILD_CARE_PLAN_COMMENT = gql`
  mutation Mutation(
    $childCarePlanID: String!
    $commentContent: String!
    $videoID: String
    $assignmentID: String
  ) {
    createComment(
      childCarePlanID: $childCarePlanID
      commentContent: $commentContent
      videoID: $videoID
      assignmentID: $assignmentID
    ) {
      id
    }
  }
`;

const DELETE_CHILD_CARE_PLAN_COMMENT = gql`
  mutation Mutation($commentID: String!) {
    deleteComment(commentID: $commentID)
  }
`;

const CREATE_CHILD_CARE_PLAN_ASSIGMENT = gql`
  mutation Mutation(
    $childCarePlanID: String!
    $dateStart: String!
    $dateDue: String!
    $title: String!
    $description: String!
    $videoIDs: [String]!
  ) {
    createAssignment(
      childCarePlanID: $childCarePlanID
      dateStart: $dateStart
      dateDue: $dateDue
      title: $title
      description: $description
      videoIDs: $videoIDs
    )
  }
`;

const INVITE_PATIENT = gql`
  mutation Mutation(
    $email: String!
    $guardianFirstName: String!
    $guardianLastName: String!
    $childFirstName: String!
    $childLastName: String!
    $childDateOfBirth: String!
    $childLevel: String!
    $childTherapistID: String!
    $diagnosis: String!
  ) {
    invitePatient(
      email: $email
      guardianFirstName: $guardianFirstName
      guardianLastName: $guardianLastName
      childFirstName: $childFirstName
      childLastName: $childLastName
      childDateOfBirth: $childDateOfBirth
      childLevel: $childLevel
      childTherapistID: $childTherapistID
      diagnosis: $diagnosis
    )
  }
`;

const SET_VIDEO_COMPLETED = gql`
  mutation Mutation($videoID: String!, $medalType: String!) {
    setVideoCompleted(videoID: $videoID, medalType: $medalType) {
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
  EDIT_USER,

  // Super User
  GET_ALL_CLIENTS,
  GET_ALL_THERAPISTS,
  SUPER_SET_THERAPIST,
  SUPER_DELETE_ASSIGNMENTS,
  SUPER_CREATE_EXPIRED_ASSIGNMENTS,
  SUPER_ACTIVATE_USERS,
  SUPER_DELETE_USER,

  // Organization
  EDIT_ORGANIZATION_SETTINGS,
  INVITE_USER,

  // MESSAGING
  GET_USER_CHAT_ROOMS,
  GET_CHAT_ROOM_BY_ID,
  DYNAMIC_SEND_MESSAGE,
  CREATE_CHAT_ROOM,

  // MEETINGS + ASSIGNMENTS
  GET_USER_MEETINGS,
  GET_USER_ASSIGNMENTS,
  CREATE_MEETING,
  CREATE_ASSIGNMENT,
  EDIT_MEETING,
  APPROVE_MEETING,
  TOGGLE_ASSGINMENT_SEEN,

  // GUARDIAN
  GENERATE_SOLO_GUARDIAN_CHECKOUT_LINK,
  GENERATE_ANNUAL_SOLO_GUARDIAN_CHECKOUT_LINK,
  GENERATE_SOLO_GUARDIAN_PORTAL_LINK,

  // VIDEO LIBRARY
  GET_VIDEO_LIBRARY,
  
  // CHILD CARE PLAN
  EDIT_CHILD_CARE_PLAN_DETAILS,
  CREATE_CHILD_CARE_PLAN_COMMENT,
  DELETE_CHILD_CARE_PLAN_COMMENT,
  CREATE_CHILD_CARE_PLAN_ASSIGMENT,
  INVITE_PATIENT,
  SET_VIDEO_COMPLETED,
  GET_CHILD_VIDEO_STATISTICS
};
