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
    soloStripeSubscriptionID: String
    soloSubscriptionStatus: String
    phoneNumber: String
    subscriptionStatus: String
    fcmToken: String
    profilePic: JSON
    role: String
    webAppColorSettings: String
    createdAt: Date

    childDateOfBirth: Date
    diagnosis: String
    colorSettings: String

    msgNotifications: Boolean
    missedDateNotifications: Boolean
    appointmentNotifications: Boolean

    muteAllMessages: Boolean
    muteAllAssignments: Boolean

    messagesMuted: Boolean
    assignMuted: Boolean

    solo: Boolean

    children: [User]
    guardianId: String
    guardian: User

    videos: [Video]

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
    blockedVideos: JSON
    weeklyVideoStatus: JSON
    assignments: [Assignment]
    comments: [Comment]
  }

  type Comment {
    id: ID
    content: String
    createdAt: Date
    therapist: User
    assignmentId: String
    videoId: String
    childCarePlan: ChildCarePlan
  }

  type Assignment {
    id: ID
    createdAt: Date
    dateStart: Date
    dateDue: Date
    seen: Boolean
    notificationSent: Boolean
    title: String
    description: String
    childCarePlan: ChildCarePlan
    videos: [Video]
  }

  type Video {
    id: ID
    contentfulID: String
    completed: Boolean

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
    createdAt: Date
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

  type AvatarPiece {
    id: String
    title: String
    unlocked: Boolean
    pictureURL: String
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

  type MedalType {
    id: String
    videoID: String
    level: String
    title: String
    pictureURL: String
  }

  type Meeting {
    id: String
    createdAt: Date
    meetingDateTime: Date
    title: String
    completed: Boolean
    canceled: Boolean
    type: String
    pendingApproval: Boolean
    approved: Boolean
    users: [User]
    meetingOwnerID: String
  }

  type Notification {
    id: String
    createdAt: Date
    title: String
    description: String
    type: String
    toUserId: String
    fromUserId: String
  }

  # ---------------------------------------- END SCHEMAS ----------------------------------------
  type Query {
    ######################
    #### USER QUERIES ####
    ######################

    getUser: User
    getUserAvatarPieces(childID: String): [AvatarPiece]

    ##########################
    #### CHATROOM QUERIES ####
    ##########################

    getUserChatRooms: [ChatRoom]
    getChatFromId(id: String): ChatRoom

    #########################
    #### VIDEO QUERIES ####
    #########################

    getAllVideoFiles: [VideoFile]

    #########################
    #### MEDAL QUERIES ####
    #########################

    getAllMedalTypes: [MedalType]

    ###################################
    #### CHILD CARE PLAN QUERIES ####
    ###################################

    getChildVideoStatistics(childID: String!): JSON

    ########################################
    #### MEETING AND ASSIGNMENT QUERIES ####
    ########################################

    getAssignments: [Assignment]
    getMeetings: [Meeting]

    ###############################
    #### NOTIFICATION QUERIES ####
    ##############################

    getNotifications: [Notification]

    ############################
    #### SUPER USER QUERIES ####
    ############################

    getAllClients: [User]
    getAllTherapists: [User]

  }

  # ---------------------------------------- END QUERY ----------------------------------------
  type Mutation {
    ########################
    #### USER MUTATIONS ####
    ########################
    devCreateUser(password: String!): User

    editColorSettings(colorSettings: String!): Boolean

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

    requestAccountDeletion(userId: String): Boolean

    updatePhoneToken(token: String!): Boolean

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

    createUserToUserNotification(
      title: String!
      description: String!
      type: String!
      toUserId: String!
    ): Boolean

    ################################
    #### ORGANIZATION MUTATIONS ####
    ################################
    editOrganizationSettings(name: String!, phoneNumber: String!): User

    inviteOrganizationUser(
      email: String!
      role: String!
      additionalInformation: JSON
    ): Boolean

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
      childUsername: String!
      childDateOfBirth: String!
    ): User

    swapToChildAccount(childUserID: String!): UserPayLoad

    changeProfilePicture(profilePic: JSON!): User

    generateSoloGuardianCheckoutLink: String

    generateAnnualSoloGuardianCheckoutLink: String

    generateSoloGuardianPortalLink: String

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

    claimPatient(patientUserID: String!): Boolean

    deletePatient(patientUserID: String!): Boolean

    changeUserNotifications(
      userID: String!
      messagesMuted: Boolean!
      assignMuted: Boolean!
    ): User

    invitePatient(
      email: String!
      guardianFirstName: String!
      guardianLastName: String!
      childFirstName: String!
      childLastName: String!
      childDateOfBirth: String!
      childLevel: String!
      childTherapistID: String!
      diagnosis: String!
    ): String

    ############################
    #### CHATROOM MUTATIONS ####
    ############################
    sendMessage(content: String!, chatRoomID: String!): Boolean

    createChatRoom(otherParticipantID: String!): ChatRoom

    ###################################
    #### CHILD CARE PLAN MUTATIONS ####
    ###################################
    toggleAssignmentSeen(assignmentID: String!, hasSeen: Boolean!): Assignment

    setVideoCompleted(
      videoID: String!
      medalType: String!
      childID: String
    ): Video

    editChildCarePlan(
      childCarePlanID: String!
      level: Int
      diagnosis: String!
      newAssignedTherapistID: String
      blockedVideos: JSON
    ): ChildCarePlan

    createComment(
      childCarePlanID: String!
      commentContent: String!
      videoID: String
      assignmentID: String
    ): ChildCarePlan

    deleteComment(commentID: String!): Boolean

    createAssignment(
      childCarePlanID: String!
      dateStart: String!
      dateDue: String!
      title: String!
      description: String!
      videoIDs: [String]!
    ): Boolean

    ###########################
    #### MEETING MUTATIONS ####
    ###########################
    createMeeting(
      title: String!
      meetingDateTime: Date!
      type: String!
      participantIDs: [String]!
    ): Meeting

    editMeeting(
      title: String!
      meetingID: String!
      completed: Boolean!
      meetingDateTime: Date!
      type: String!
      participantIDs: [String]!
      cancelled: Boolean!
    ): Meeting

    approveMeeting(approveMeeting: Boolean!, meetingID: String!): Meeting

    ################################
    #### NOTIFICATION MUTATIONS ####
    ################################
    dismissNotification(notificationID: String!): Boolean

    #########################
    #### SUPER MUTATIONS ####
    #########################
    superSetTherapist(
      childCarePlanID: String!
      childID: String!
      guardianID: String!
      therapistID: String!
      superUserKey: String!
    ): ChildCarePlan
  }
  # ---------------------------------------- END MUTATIONS ----------------------------------------
`;

export default typeDefs;
