import { gql } from "apollo-server";

const typeDefs = gql`
  scalar Date
  scalar JSON

  type User {
    id: ID
    email: String
    username: String
    firstName: String
    lastName: String
    title: String
    password: String
    phoneNumber: String
    profilePic: JSON
    role: String
    createdAt: Date

    childDateOfBirth: Date
    colorSettings: String

    msgNotifications: Boolean
    missedDateNotifications: Boolean
    appointmentNotifications: Boolean
    muteAllMessages: Boolean
    muteAllAssignments: Boolean

    children: [User]
    guardianId: String
    guardian: User

    ownedOrganization: Organization

    childCarePlans: [ChildCarePlan]
    patientCarePlans: [ChildCarePlan]

    organizations: [OrganizationUser]
    chatRooms: [ChatRoom]

    accessSettings: Boolean
    accessMessages: Boolean
    leaveApp: Boolean
  }

  type OrganizationUser {
    id: ID
    active: Boolean
    createdAt: Date

    organizationId: String
    organization: Organization

    userId: String
    user: User
  }

  type Organization {
    id: ID
    createdAt: Date
    organizationType: String
    phoneNumber: String
    name: String
    stripeSubscriptionID: String
    subscriptionStatus: String
    active: Boolean
    owner: User
    organizationUsers: [OrganizationUser]
  }

  type ChildCarePlan {
    id: ID
    child: User
    childId: String
    therapist: User
    level: Int
    active: Boolean
    allVideoStatus: JSON
    weeklyVideoStatus: JSON
    assignments: [Assignment]
  }

  type Assignment {
    id: ID
    createdAt: Date
    dateStart: Date
    dateDue: Date
    title: String
    description: String
    childCarePlan: ChildCarePlan
    videos: [Video]
  }

  type Video {
    id: ID
    contentfulID: String

    medals: [Medal]
    assignment: Assignment
    users: [User]

    file: VideoFile
  }

  type Medal {
    id: ID
    title: String
    image: String
    description: String
    level: String
    video: Video
  }

  type UserPayLoad {
    token: String
    user: User
  }

  type VideoFile {
    id: String
    level: Int
    title: String
    description: String
    videoURL: String
    previewPictureURL: String
  }

  type ChatRoom {
    id: ID
    users: [User]
    messages: [Message]
    active: Boolean
  }

  type Message {
    id: ID
    content: String
    createdAt: Date
    sentAt: JSON
    sentBy: JSON
    chatRoom: ChatRoom
  }

  # ---------------------------------------- END SCHEMAS ----------------------------------------
  type Query {
    ######################
    #### USER QUERIES ####
    ######################

    getUser: User

    ##########################
    #### CHATROOM QUERIES ####
    ##########################

    getUserChatRooms: [ChatRoom]
    getChatFromId(id: ID): ChatRoom

    #########################
    #### VIDEO QUERIES ####
    #########################

    getAllVideoFiles: [VideoFile]
  }

  # ---------------------------------------- END QUERY ----------------------------------------
  type Mutation {
    ########################
    #### USER MUTATIONS ####
    ########################
    devCreateUser(password: String!): User

    loginUser(username: String!, password: String!): UserPayLoad

    signUpUser(
      email: String!
      username: String
      password: String!
      firstName: String!
      lastName: String!
      role: String!
      phoneNumber: String
      childFirstName: String
      childLastName: String
      childDateOfBirth: String
      title: String
      organizationName: String
      organizationType: String
      organizationInviteKey: String
    ): UserPayLoad

    logoutUser: String

    requestResetPassword(email: String!): Boolean

    confirmPassword(password: String!): Boolean

    resetPasswordFromKey(
      password: String!
      resetPasswordKeyID: String!
    ): Boolean

    editUser(
      email: String
      firstName: String
      lastName: String
      phoneNumber: String
      title: String
      username: String
    ): Boolean

    ################################
    #### ORGANIZATION MUTATIONS ####
    ################################
    editOrganizationSettings(name: String!, phoneNumber: String!): User

    inviteOrganizationUser(email: String!, role: String!): Boolean

    editOrganizationSubscriptionStatus(cancelled: Boolean!): Boolean

    ############################
    #### GUARDIAN MUTATIONS ####
    ############################
    editChildSettings(
      childUserID: String!
      leaveApp: Boolean!
      accessMessages: Boolean!
      accessSettings: Boolean!
    ): Boolean

    changeChildPassword(childUserID: String!, childPassword: String!): Boolean

    addChild(
      childFirstName: String!
      childLastName: String!
      childDateOfBirth: String!
    ): User

    swapToChildAccount(childUserID: String!): UserPayLoad

    changeProfilePicture(profilePic: JSON!): User

    editUserNotificationSettings(
      muteMessageNotifications: Boolean!
      muteAssignmentNotifications: Boolean!
    ): User

    #############################
    #### THERAPIST MUTATIONS ####
    #############################
    editNotificationSettings(
      patientUserID: String!
      muteMessageNotifications: Boolean!
      muteAssignmentNotifications: Boolean!
    ): Boolean

    ############################
    #### CHATROOM MUTATIONS ####
    ############################
    sendMessage(content: String!, chatRoomID: String!): Boolean

    createChatRoom(otherParticipantID: String!): String
  }
  # ---------------------------------------- END MUTATIONS ----------------------------------------
`;

export default typeDefs;
