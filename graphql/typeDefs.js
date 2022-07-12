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
    role: String
    createdAt: Date
    active: Boolean

    dateOfBirth: Date
    phoneNumber: String

    children: [User]
    guardian: User
    ownedOrganization: Organization
    organizations: [OrganizationUser]
    chatRooms: [ChatRoom]

    childCarePlans: [ChildCarePlan]
    patientCarePlans: [ChildCarePlan]
  }

  type OrganizationUser {
    id: ID
    active: Boolean
    createdAt: Date
    organization: Organization
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
    sentAt: JSON
    sentBy: JSON
    chatRoom: ChatRoom
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
    signUpUser(
      email: String!
      password: String!
      firstName: String!
      lastName: String!
      role: String!

      childFirstName: String
      childLastName: String
      childDateOfBirth: Date

      organizationName: String
      organizationType: String
      phoneNumber: String

      organizationInviteKey: String
    ): UserPayLoad
    logoutUser: String
    ##########################
  }
  # ---------------------------------------- END MUTATIONS ----------------------------------------
`;

export default typeDefs;
