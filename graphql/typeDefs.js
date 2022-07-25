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
    profilePic: String
    role: String
    createdAt: Date

    childDateOfBirth: Date
    colorSettings: String

    msgNotifications: Boolean
    missedDateNotifications: Boolean
    appointmentNotifications: Boolean

    children: [User]
    guardianId: String
    guardian: User

    ownedOrganization: Organization

    childCarePlans: [ChildCarePlan]
    patientCarePlans: [ChildCarePlan]

    organizations: [OrganizationUser]
    chatRooms: [ChatRoom]
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

    accessSettings: Boolean
    accessMessages: Boolean
    leaveApp: Boolean
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
    #### USER QUERIES ####
    getUser: User
    #########################

    #### CHATROOM QUERIES ####
    getUserChatRooms: [ChatRoom]
    getChatFromId(id: ID): ChatRoom
    #########################
  }
  # ---------------------------------------- END QUERY ----------------------------------------
  type Mutation {
    #### USER MUTATIONS ####
    devCreateUser(password: String!): User
    loginUser(username: String!, password: String!): UserPayLoad
    signUpUser(
      email: String!
      username: String,
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

    resetPasswordFromKey(password: String!, resetPasswordKeyID: String!): Boolean

    editUser(
      email: String, 
      firstName: String,
      lastName: String,
      phoneNumber: String,
    ): Boolean

    #### ORGANIZATION MUTATIONS ####
    editOrganizationSettings(name: String!, phoneNumber: String!): User
    inviteOrganizationUser(email: String!, role: String!): Boolean
    ##########################
  }
  # ---------------------------------------- END MUTATIONS ----------------------------------------
`;

export default typeDefs;
