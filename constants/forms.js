import { Tag } from "antd";

export const COMPANY_PREFERENCES_INITIAL_VALUES = {
  companyDetails: {
    name: "",
    shortcode: "",
    timeZone: "",
  },
  layoutSettings: {
    topCardLimits: 5,
    smallCardLimits: 10,
  },
  scoreCard: {
    deliveryCompletionRateLimits: {
      fair: 90,
      good: 95,
      fantastic: 98,
    },
    photoOnDeliveryLimits: {
      fair: 90,
      good: 95,
      fantastic: 98,
    },
    ficoLimits: {
      fair: 650,
      good: 750,
      fantastic: 850,
    },
    seatbeltLimits: {
      fair: 15,
      good: 10,
      fantastic: 5,
    },
    speedingLimits: {
      fair: 15,
      good: 10,
      fantastic: 5,
    },
    distractionLimits: {
      fair: 15,
      good: 10,
      fantastic: 5,
    },
    signalLimits: {
      fair: 15,
      good: 10,
      fantastic: 5,
    },
    followLimits: {
      fair: 15,
      good: 10,
      fantastic: 5,
    },
    deliveryNotRecievedLimits: {
      fair: 15,
      good: 10,
      fantastic: 5,
    },
  },
  feedbackNotifications: {
    subpar: {
      message:
        "WARNING: Your overall score is below the acceptable threshold. Please be mindful of that fact during this next week and attempt to rectify it.",
      autoSend: false,
    },
    fair: {
      message:
        "Your performance this past week has been Fair. We commend you on keeping your driving stats with the acceptable thresholds and urge you to make it to Great status next week! Safe Driving!",
      autoSend: false,
    },
    great: {
      message:
        "Congratulations! You've achieved Great status this past week and we commend you for it! Keep up the great work!",
      autoSend: false,
    },
  },
};

export const scoreCardDataColumns = [
  {
    title: "Rank",
    dataIndex: "rank",
    key: "rank",
    width: 55,
    fixed: "left",
  },
  {
    title: "Employee ID",
    dataIndex: "employeeId",
    key: "employeeId",
    width: 160,
    fixed: "left",
  },
  {
    title: "Driver In System",
    dataIndex: "driverInSystem",
    key: "driverInSystem",
    width: 160,
    render: (text, record, index) => (
      <span>
        {record.driverInSystem ? (
          <Tag color="green">TRUE</Tag>
        ) : (
          <Tag color="red">FALSE</Tag>
        )}
      </span>
    ),
    filters: [
      {
        text: "Driver In Sytem",
        value: "TRUE",
      },
      {
        text: "Driver NOT In System",
        value: "FALSE",
      },
    ],
    defaultFilteredValue: ["TRUE"],
    onFilter: (value, record) =>
      record.driverInSystem.toString().toUpperCase().indexOf(value) === 0,
  },

  {
    title: "Employee Information",
    children: [
      {
        title: "First Name",
        dataIndex: "firstname",
        key: "firstname",
        width: 120,
      },
      {
        title: "Last Name",
        dataIndex: "lastname",
        key: "lastname",
        width: 120,
      },
      {
        title: "Tier",
        dataIndex: "tier",
        key: "tier",
        width: 100,
      },
      {
        title: "Delivered",
        dataIndex: "delivered",
        key: "delivered",
        width: 120,
      },
      {
        title: "Key Focus Area",
        dataIndex: "keyFocusArea",
        key: "keyFocusArea",
        width: 120,
      },
    ],
  },
  {
    title: "Safety Metrics",
    children: [
     
      {
        title: "FICO Score",
        dataIndex: "fico",
        key: "fico",
        width: 120,
      },
      {
        title: "Seat Belt Off Rate",
        dataIndex: "seatbeltOffRate",
        key: "seatbeltOffRate",
        width: 120,
      },
      {
        title: "Speeding Rate",
        dataIndex: "speedingEventRate",
        key: "speedingEventRate",
        width: 120,
      },
      {
        title: "Distraction Rate",
        dataIndex: "distractionsRate",
        key: "distractionsRate",
        width: 120,
      },
      {
        title: "Following Distance Rate",
        dataIndex: "followingDistanceRate",
        key: "followingDistanceRate",
        width: 120,
      },
      {
        title: "Following Distance Rate",
        dataIndex: "followingDistanceRate",
        key: "followingDistanceRate",
        width: 120,
      },
      {
        title: "Signal Violations Rate",
        dataIndex: "signalViolationsRate",
        key: "signalViolationsRate",
        width: 120,
      },
      {
        title: "Delivery Complete Rate",
        dataIndex: "deliveryCompletionRate",
        key: "deliveryCompletionRate",
        width: 120,
      },
      {
        title: "Delivered & Received Rate",
        dataIndex: "deliveredAndRecieved",
        key: "deliveredAndRecieved",
        width: 120,
      },
      {
        title: "Photo On Delivery Rate",
        dataIndex: "photoOnDelivery",
        key: "photoOnDelivery",
        width: 120,
      },
      {
        title: "Delivery Complete Rate",
        dataIndex: "deliveryCompletionRate",
        key: "deliveryCompletionRate",
        width: 120,
      },
    ],
  },
  {
    title: "Misc",
    children: [
      {
        title: "DNR",
        dataIndex: "dnr",
        key: "dnr",
        width: 120,
      },
      {
        title: "POD OPPS",
        dataIndex: "podOpps",
        key: "podOpps",
        width: 120,
      },
      {
        title: "CC OPPS",
        dataIndex: "ccOpps",
        key: "ccOpps",
        width: 120,
      },
      {
        title: "Admin Email",
        dataIndex: "adminEmail",
        key: "adminEmail",
        width: 180,
      },
 
    ]
  }
];
