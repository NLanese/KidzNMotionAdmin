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


/////////////////////////////
///                       ///
///        Refresh        ///
///                       ///
/////////////////////////////
const OWNER_REFRESH = gql`
  mutation Mutation($role: String!, $token: String!) {
    refreshOwner(role: $role, token: $token) {
      id
      role
      token
      firstname
      lastname
      signUpToken
      email

      dsp {
        id
        paid
        subscriptionToken
        stripeCustomerId
        createdAt
        accountStanding
      }
    }
  }
`;

const MANAGER_REFRESH = gql`
  mutation Mutation($role: String!, $token: String!) {
    refreshManager(role: $role, token: $token) {
      id
      role
      token
      firstname
      lastname
      email
      dsp {
        id
        createdAt
      }
    }
  }
`;

/////////////////////////////
///                       ///
///  COMPANY PREF (OWNER) ///
///                       ///
/////////////////////////////
const GET_COMPANY_PREFERENCES = gql`
  mutation Mutation($role: String!, $token: String!) {
    refreshOwner(role: $role, token: $token) {
      dsp {
        id
        createdAt
        name
        shortcode
        timeZone
        ficoLimits
        seatbeltLimits
        speedingLimits
        distractionLimits
        followLimits
        signalLimits
        deliveryCompletionRateLimits
        deliveryNotRecievedLimits
        photoOnDeliveryLimits
        topCardLimits
        smallCardLimits
        feedbackNotifications
        autoSend
      }
    }
  }
`;
const CREATE_COMPANY_PREFERENCES = gql`
  mutation Mutation(
    $token: String!
    $name: String!
    $shortcode: String!
    $timeZone: String!
    $ficoLimits: JSON!
    $seatbeltLimits: JSON!
    $speedingLimits: JSON!
    $distractionLimits: JSON!
    $followLimits: JSON!
    $signalLimits: JSON!
    $deliveryCompletionRateLimits: JSON!
    $deliveryNotRecievedLimits: JSON!
    $photoOnDeliveryLimits: JSON!
    $topCardLimits: Int!
    $smallCardLimits: Int!
    $feedbackNotifications: JSON!
    $autoSend: JSON!
  ) {
    ownerCreateDsp(
      token: $token
      name: $name
      shortcode: $shortcode
      timeZone: $timeZone
      ficoLimits: $ficoLimits
      seatbeltLimits: $seatbeltLimits
      speedingLimits: $speedingLimits
      distractionLimits: $distractionLimits
      followLimits: $followLimits
      signalLimits: $signalLimits
      deliveryCompletionRateLimits: $deliveryCompletionRateLimits
      deliveryNotRecievedLimits: $deliveryNotRecievedLimits
      photoOnDeliveryLimits: $photoOnDeliveryLimits
      topCardLimits: $topCardLimits
      smallCardLimits: $smallCardLimits
      feedbackNotifications: $feedbackNotifications
      autoSend: $autoSend
    ) {
      id
      createdAt
      name
      shortcode
      ficoLimits
      timeZone
      seatbeltLimits
      distractionLimits
      speedingLimits
      followLimits
      signalLimits
      deliveryCompletionRateLimits
      deliveryNotRecievedLimits
      photoOnDeliveryLimits
      topCardLimits
      smallCardLimits
      autoSend
      feedbackNotifications
      accountStanding
    }
  }
`;
const UPDATE_COMPANY_PREFERENCES = gql`
  mutation Mutation(
    $token: String!
    $name: String!
    $shortcode: String!
    $timeZone: String!
    $ficoLimits: JSON!
    $seatbeltLimits: JSON!
    $speedingLimits: JSON!
    $distractionLimits: JSON!
    $followLimits: JSON!
    $signalLimits: JSON!
    $deliveryCompletionRateLimits: JSON!
    $deliveryNotRecievedLimits: JSON!
    $photoOnDeliveryLimits: JSON!
    $topCardLimits: Int!
    $smallCardLimits: Int!
    $feedbackNotifications: JSON!
    $autoSend: JSON!
  ) {
    ownerUpdateDsp(
      token: $token
      name: $name
      shortcode: $shortcode
      timeZone: $timeZone
      ficoLimits: $ficoLimits
      seatbeltLimits: $seatbeltLimits
      speedingLimits: $speedingLimits
      distractionLimits: $distractionLimits
      followLimits: $followLimits
      signalLimits: $signalLimits
      deliveryCompletionRateLimits: $deliveryCompletionRateLimits
      deliveryNotRecievedLimits: $deliveryNotRecievedLimits
      photoOnDeliveryLimits: $photoOnDeliveryLimits
      topCardLimits: $topCardLimits
      smallCardLimits: $smallCardLimits
      feedbackNotifications: $feedbackNotifications
      autoSend: $autoSend
    ) {
      id
      createdAt
      id
      name
      shortcode
      ficoLimits
      timeZone
      seatbeltLimits
      distractionLimits
      speedingLimits
      followLimits
      signalLimits
      deliveryCompletionRateLimits
      deliveryNotRecievedLimits
      photoOnDeliveryLimits
      topCardLimits
      smallCardLimits
      autoSend
      feedbackNotifications
    }
  }
`;

/////////////////////////////
///                       ///
///  COMPANY PREF (OWNER) ///
///                       ///
/////////////////////////////
const CREATE_DRIVER_ACCOUNT = gql`
  mutation Mutation(
    $token: String
    $email: String
    $firstname: String
    $lastname: String
    $phoneNumber: String
    $password: String
    $transporterId: String
    $role: String
    $dspId: String
  ) {
    scorecardToolCreateDriverAccounts(
      token: $token
      email: $email
      firstname: $firstname
      lastname: $lastname
      phoneNumber: $phoneNumber
      password: $password
      transporterId: $transporterId
      role: $role
      dspId: $dspId
    ) {
      id
      firstname
      lastname
      email
      phoneNumber
      transporterId
    }
  }
`;

/////////////////////////////
///                       ///
///        ASSETS        ///
///                       ///
/////////////////////////////
const BASE_ASSET_QUERY = `
  id
  number
  name
  type
  deviceIndex
`;

const OWNER_GET_ASSETS = gql`
  mutation Mutation($role: String!, $token: String!) {
    refreshOwner(role: $role, token: $token) {
      dsp {
        devices {
          ${BASE_ASSET_QUERY}
        }
      }
    }
  }
`;
const MANAGER_GET_ASSETS = gql`
  mutation Mutation($role: String!, $token: String!) {
    refreshManager(role: $role, token: $token) {
      dsp {
        devices {
          ${BASE_ASSET_QUERY}
        }
      }
    }
  }
`;

const DYNAMIC_CREATE_ASSET = gql`
  mutation Mutation(
    $token: String
    $role: String
    $name: String
    $number: String
    $type: String
    $dspId: String
    $deviceIndex: Int
    $id: Int
  ) {
    dynamicCreateOrUpdateDevice(
      token: $token
      role: $role
      name: $name
      number: $number
      type: $type
      dspId: $dspId
      deviceIndex: $deviceIndex
      id: $id
    ) {
      ${BASE_ASSET_QUERY}
    }
  }
`;

const DELETE_ASSET = gql`
  mutation Mutation($token: String, $role: String, $id: Int) {
    deleteDevice(token: $token, role: $role, id: $id) {
      id
      name
    }
  }
`;

const DYNAMIC_UPDATE_ASSET = gql`
  mutation Mutation(
    $token: String
    $role: String
    $name: String
    $number: String
    $type: String
    $dspId: String
    $deviceIndex: Int
    $id: Int
  ) {
    dynamicCreateOrUpdateDevice(
      token: $token
      role: $role
      name: $name
      number: $number
      type: $type
      dspId: $dspId
      deviceIndex: $deviceIndex
      id: $id
    ) {
      ${BASE_ASSET_QUERY}
    }
  }
`;

/////////////////////////////
///                       ///
///        DRIVERS        ///
///                       ///
/////////////////////////////
const BASE_OWNER_DRIVER_QUERY = `
    drivers {
      id
      createdAt
      role
      token
      firstname
      lastname
      email
      phoneNumber
      profilePick
      transporterId
      globallyMuted
      locked
      deleted
      notified
      dsp {
        id
      }
      weeklyReport {
        id
        createdAt
        date
        hadAccident
        feedbackMessage
        feedbackMessageSent
        feedbackStatus
        acknowledged
        acknowledgedAt
        tier
        delivered
        keyFocusArea
        fico
        speedingEventRate
        seatbeltOffRate
        distractionsRate
        followingDistanceRate
        signalViolationsRate
        deliveryCompletionRate
        deliveredAndRecieved
        photoOnDelivery
        netradyne
        defects
        customerDeliveryFeedback
        hasManyAccidents
        attendence
      }
    }
`;
const BASE_MANAGER_DRIVER_QUERY = `
    drivers {
      id
      createdAt
      role
      token
      firstname
      lastname
      email
      phoneNumber
      profilePick
      transporterId
      globallyMuted
      locked
      deleted
      notified
      dsp {
        id
      }
    }
`;

const OWNER_GET_DRIVERS = gql`
  mutation Mutation($role: String!, $token: String!) {
    refreshOwner(role: $role, token: $token) {
      ${BASE_OWNER_DRIVER_QUERY}
      
    }
  }
`;

const MANAGER_GET_DRIVERS = gql`
  mutation Mutation($role: String!, $token: String!) {
    refreshManager(role: $role, token: $token) {
      ${BASE_MANAGER_DRIVER_QUERY}
    }
  }
`;

const DYNAMIC_UPDATE_DRIVER = gql`
  mutation Mutation(
    $role: String!
    $token: String
    $driverId: String!
    $email: String
    $firstname: String
    $lastname: String
    $phoneNumber: String
    $password: String
  ) {
    dynamicUpdateDriver(
      role: $role
      token: $token
      driverId: $driverId
      email: $email
      firstname: $firstname
      lastname: $lastname
      phoneNumber: $phoneNumber
      password: $password
    ) {
      id
    }
  }
`;

/////////////////////////////////
///                           ///
///        SCORE CARDS        ///
///                           ///
/////////////////////////////////
const SCORECARD_TOOL_CREATE_WEEKLY_REPORTS = gql`
  mutation Mutation(
    $token: String
    $dspId: String
    $role: String
    $transporterId: String
    $date: String
    $sentAt: String
    $feedbackStatus: String
    $rank: Int
    $tier: String
    $delivered: Int
    $keyFocusArea: String
    $fico: String
    $seatbeltOffRate: String
    $speedingEventRate: String
    $distractionsRate: String
    $followingDistanceRate: String
    $signalViolationsRate: String
    $customerDeliveryFeedback: String
    $deliveryCompletionRate: String
    $deliveredAndRecieved: String
    $photoOnDelivery: String
    $attendedDeliveryAccuracy: Int
    $dnr: Int
    $podOpps: Int
    $ccOpps: Int
    $feedbackMessage: String
    $feedbackMessageSent: Boolean
  ) {
    scorecardToolCreateWeeklyReports(
      token: $token
      dspId: $dspId
      role: $role
      transporterId: $transporterId
      date: $date
      sentAt: $sentAt
      feedbackStatus: $feedbackStatus
      rank: $rank
      tier: $tier
      delivered: $delivered
      keyFocusArea: $keyFocusArea
      fico: $fico
      seatbeltOffRate: $seatbeltOffRate
      speedingEventRate: $speedingEventRate
      distractionsRate: $distractionsRate
      followingDistanceRate: $followingDistanceRate
      signalViolationsRate: $signalViolationsRate
      deliveryCompletionRate: $deliveryCompletionRate
      deliveredAndRecieved: $deliveredAndRecieved
      photoOnDelivery: $photoOnDelivery
      customerDeliveryFeedback: $customerDeliveryFeedback
      attendedDeliveryAccuracy: $attendedDeliveryAccuracy
      dnr: $dnr
      podOpps: $podOpps
      ccOpps: $ccOpps
      feedbackMessage: $feedbackMessage
      feedbackMessageSent: $feedbackMessageSent
    ) {
      id
      createdAt
      date
      hadAccident
      feedbackMessage
      feedbackMessageSent
      feedbackStatus
      acknowledged
      acknowledgedAt
      rank
      tier
      delivered
      keyFocusArea
      fico
      seatbeltOffRate
      speedingEventRate
      distractionsRate
      followingDistanceRate
      signalViolationsRate
      deliveryCompletionRate
      deliveredAndRecieved
      photoOnDelivery
      attendedDeliveryAccuracy
      dnr
      podOpps
      ccOpps
    }
  }
`;

/////////////////////////////
///                       ///
///  Shift Quers and Muts ///
///                       ///
/////////////////////////////
const BASE_SHIFT_QUERY = `
  dsp {
    shifts {
      id
      date
      allDriverShifts
    }
  }
`;

const OWNER_GET_SHIFTS = gql`
  query Query($id: String) {
    getOwner(id: $id) {
      ${BASE_SHIFT_QUERY}
    }
  }
`;

const MANAGER_GET_SHIFTS = gql`
  query Query($id: String) {
    getManager(id: $id) {
      ${BASE_SHIFT_QUERY}
    }
  }
`;

const DYNAMIC_CREATE_OR_UPDATE_SHIFT = gql`
  mutation Mutation(
    $token: String
    $role: String
    $date: String
    $allDriverShifts: [JSON]
    $dspId: String
  ) {
    dynamicCreateOrUpdateShift(
      token: $token
      role: $role
      date: $date
      allDriverShifts: $allDriverShifts
      dspId: $dspId
    ) {
      id
      date
      allDriverShifts
      dspId
    }
  }
`;

/////////////////////////////
///                       ///
///  MESSAGING            ///
///                       ///
/////////////////////////////
const BASE_CHAT_ROOM_QUERY = `
    chatrooms {
      createdAt
      id
      chatroomName
      guests
      chatroomOwner
  
    }
`;

const OWNER_GET_CHATS = gql`
  query Query($id: String) {
    getOwner(id: $id) {
      ${BASE_CHAT_ROOM_QUERY}
    }
  }
`;

const MANAGER_GET_CHATS = gql`
  mutation Mutation($role: String!, $token: String!) {
    getManager(role: $role, token: $token) {
      ${BASE_CHAT_ROOM_QUERY}
    }
  }
`;

const DYNAMIC_GET_CHATROOM_BY_ID = gql`
  query Query($role: String!, $chatroomId: String!, $token: String!) {
    dynamicGetChatroomById(
      role: $role
      chatroomId: $chatroomId
      token: $token
    ) {
      createdAt
      id
      chatroomName
      guests
      chatroomOwner
      mutedIds
      managers {
        id
        firstname
        lastname
        phoneNumber
      }
      drivers {
        id
        firstname
        lastname
        phoneNumber
        shifts
      }
      messages {
        id
        createdAt
        content
        from
        sentAt
        visable
        reported
        reportedBy
      }
    }
  }
`;

const DYNAMIC_SEND_MESSAGE = gql`
  mutation Mutation(
    $role: String!
    $chatroomId: String!
    $content: String!
    $token: String!
    $sentAt: String!
  ) {
    dynamicSendMessage(
      role: $role
      chatroomId: $chatroomId
      content: $content
      token: $token
      sentAt: $sentAt
    ) {
      messages {
        id
        createdAt
        content
        from
        sentAt
        visable
        reported
        reportedBy
      }
      mutedIds
      chatroomName
      chatroomOwner
      guests
      createdAt
      id
    }
  }
`;

const DYNAMIC_CREATE_CHATROOM = gql`
  mutation Mutation(
    $role: String!
    $guests: [JSON]
    $chatroomName: String!
    $token: String!
  ) {
    dynamicCreateChatroom(
      role: $role
      guests: $guests
      chatroomName: $chatroomName
      token: $token
    ) {
      id
      createdAt
      chatroomName
      guests
      chatroomOwner
      mutedIds
      driverJoinOnSignUp
      managerJoinOnSignUp
      messages {
        id
        createdAt
        content
        from
        sentAt
        visable
        reported
        reportedBy
      }
    }
  }
`;

const DYNAMIC_UPDATE_CHAT = gql`
  mutation Mutation(
    $role: String!
    $chatroomId: String!
    $name: String!
    $token: String
    $guests: JSON!
  ) {
    dynamicUpdateChatroom(
      role: $role
      chatroomId: $chatroomId
      name: $name
      token: $token
      guests: $guests
    ) {
      id
      createdAt
      chatroomName
      guests
      chatroomOwner
      mutedIds
      driverJoinOnSignUp
      managerJoinOnSignUp
      messages {
        id
        createdAt
        content
        from
        sentAt
        visable
        reported
        reportedBy
      }
    }
  }
`;

/////////////////////////////
///                       ///
///  MANAGERS            ///
///                       ///
/////////////////////////////
const BASE_MANAGER_QUERY = `
    managers {
      id
      firstname
      lastname
      email
      phoneNumber
    }
`;

const OWNER_GET_MANAGERS = gql`
  query Query($id: String) {
    getOwner(id: $id) {
      ${BASE_MANAGER_QUERY}
    }
  }
`;

const MANAGER_GET_MANAGERS = gql`
  mutation Mutation($role: String!, $token: String!) {
    getManager(role: $role, token: $token) {
      ${BASE_CHAT_ROOM_QUERY}
    }
  }
`;

/////////////////////////////
///                       ///
///  ACCIDENTS            ///
///                       ///
/////////////////////////////
const DYNAMIC_GET_ALL_ACCIDENTS = gql`
  query Query($role: String, $token: String) {
    dynamicGetAllAccidents(role: $role, token: $token) {
      id
      name
      createdAt
      accident_report
      has_logo
      police_report
      before_accident_report
      weather_and_distractions
      selfDamage
      date
      time
      location
      filled
      driver {
        id
        firstname
        lastname
        email
        transporterId
        phoneNumber
        profilePick
        accidents {
          name
        }
      }
      collisionAccidents {
        id
        specific_pictures
        contact_info
        collision_report
        extra_info
      }
      injuryAccidents {
        id
        contact_info
        extra_info
        injury_report
        injured_areas
        pain_level
        specific_pictures
      }
      propertyAccidents {
        id
        contact_info
        damage_report
        specific_pictures
        defective_equip
        safety_equip
        extra_info
        package_report
        types_of_damage
      }
      selfInjuryAccidents {
        id
        animal_report
        injuries
        extra_info
        injury_report
        specific_pictures
      }
    }
  }
`;

/////////////////////////////
///                       ///
///  PAYMENT              ///
///                       ///
/////////////////////////////
const CHANGE_OWNER_PAYMENT_STATUS = gql`
  mutation Mutation(
    $token: String!
    $subscriptionToken: String!
    $subscriptionStartDate: String!
    $subscriptionEndDate: String!
    $stripeCustomerId: String!
  ) {
    ownerChangePaymentStatus(
      token: $token
      subscriptionToken: $subscriptionToken
      subscriptionStartDate: $subscriptionStartDate
      subscriptionEndDate: $subscriptionEndDate
      stripeCustomerId: $stripeCustomerId
    ) {
      id
      subscriptionToken
      subscriptionStartDate
      subscriptionEndDate
      stripeCustomerId
    }
  }
`;

export {
  // Sign Up / Sign In
  DYNAMIC_SIGN_IN,
  MANAGER_SIGN_UP,
  OWNER_SIGN_UP,
  REQUEST_PASSWORD_RESET,
  RESET_PASSWORD,
  // Refreshes
  OWNER_REFRESH,
  MANAGER_REFRESH,
  // DSP Related
  GET_COMPANY_PREFERENCES,
  CREATE_COMPANY_PREFERENCES,
  UPDATE_COMPANY_PREFERENCES,
  // Drivers
  CREATE_DRIVER_ACCOUNT,
  OWNER_GET_DRIVERS,
  MANAGER_GET_DRIVERS,
  DYNAMIC_UPDATE_DRIVER,
  // Devices / Assets
  OWNER_GET_ASSETS,
  MANAGER_GET_ASSETS,
  DYNAMIC_CREATE_ASSET,
  DELETE_ASSET,
  DYNAMIC_UPDATE_ASSET,
  // Score cards
  SCORECARD_TOOL_CREATE_WEEKLY_REPORTS,
  // Shifts
  DYNAMIC_CREATE_OR_UPDATE_SHIFT,
  OWNER_GET_SHIFTS,
  MANAGER_GET_SHIFTS,
  // Chat
  MANAGER_GET_CHATS,
  OWNER_GET_CHATS,
  DYNAMIC_GET_CHATROOM_BY_ID,
  DYNAMIC_SEND_MESSAGE,
  DYNAMIC_CREATE_CHATROOM,
  DYNAMIC_UPDATE_CHAT,
  // Managers
  OWNER_GET_MANAGERS,
  MANAGER_GET_MANAGERS,
  // Accidents
  DYNAMIC_GET_ALL_ACCIDENTS,
  // Payment
  CHANGE_OWNER_PAYMENT_STATUS,
};
