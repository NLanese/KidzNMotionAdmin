// FIELD RENDER CHECKERS
// Ie email, phone number etc

// Checks to see if an email is valid
export function emailIsValid(email) {
  const re =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
}

// Checks to see if an email is valid
export function passwordIsValid(password) {
  let isValid = true;
  let requirements = {
    specialCharacter: false,
    number: false,
    minLength: false,
    lowerCaseRE: false,
    upperCaseRE: false,
  };

  if (!password) {
    return {
      requirements,
      isValid,
    };
  }

  // Special characters
  var sepcialCharacterRE = /[ `!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/;
  if (sepcialCharacterRE.test(password)) {
    requirements.specialCharacter = true;
  } else {
    isValid = false;
    requirements.specialCharacter = false;
  }

  // Has a number
  var numberRE = /[0-9]/g;
  if (numberRE.test(password)) {
    requirements.number = true;
  } else {
    isValid = false;
    requirements.number = false;
  }

  var minLengthRE = /^.{7,}$/;
  if (minLengthRE.test(password)) {
    requirements.minLength = true;
  } else {
    isValid = false;
    requirements.minLength = false;
  }

  var lowerCaseRE = /[a-z]/g;
  if (lowerCaseRE.test(password)) {
    requirements.lowerCaseRE = true;
  } else {
    isValid = false;
    requirements.lowerCaseRE = false;
  }

  var upperCaseRE = /[A-Z]/g;
  if (upperCaseRE.test(password)) {
    requirements.upperCaseRE = true;
  } else {
    isValid = false;
    requirements.upperCaseRE = false;
  }

  return {
    requirements,
    isValid,
  };
}

// Convert Phone Number to proper formatting
export const normalizePhone = (value) => {
  if (!value) {
    return value;
  }
  var onlyNums = value.replace(/[^\d]/g, "");
  if (onlyNums.length <= 3) {
  } else if (onlyNums.length <= 7) {
    onlyNums = `(${onlyNums.slice(0, 3)}) ${onlyNums.slice(3)}`;
  } else {
    onlyNums = `(${onlyNums.slice(0, 3)}) ${onlyNums.slice(
      3,
      6
    )}-${onlyNums.slice(6, 10)}`;
  }

  return onlyNums;
};

// Quick helper to force the form to be onlyh in upper case
export const parseUpperCase = (value) => {
  return value ? value.toUpperCase() : "";
};

// Convert Zipcode to proper formatting
export const normalizeZipcode = (value) => {
  if (!value) {
    return value;
  }
  const onlyNums = value.replace(/[^\d]/g, "");
  if (onlyNums.length <= 5) {
    return onlyNums;
  }
  return `${onlyNums.slice(0, 5)}-${onlyNums.slice(5, 10)}`;
};

export const STATES_DICT = {
  AL: "Alabama",
  AK: "Alaska",
  AS: "American Samoa",
  AZ: "Arizona",
  AR: "Arkansas",
  CA: "California",
  CO: "Colorado",
  CT: "Connecticut",
  DE: "Delaware",
  FL: "Florida",
  GA: "Georgia",
  GU: "Guam",
  HI: "Hawaii",
  ID: "Idaho",
  IL: "Illinois",
  IN: "Indiana",
  IA: "Iowa",
  KS: "Kansas",
  KY: "Kentucky",
  LA: "Louisiana",
  ME: "Maine",
  MH: "Marshall Islands",
  MD: "Maryland",
  MA: "Massachusetts",
  MI: "Michigan",
  FM: "Micronesia",
  MN: "Minnesota",
  MS: "Mississippi",
  MO: "Missouri",
  MT: "Montana",
  NE: "Nebraska",
  NV: "Nevada",
  NH: "New Hampshire",
  NJ: "New Jersey",
  NM: "New Mexico",
  NY: "New York",
  NC: "North Carolina",
  ND: "North Dakota",
  MP: "Northern Mariana Islands",
  OH: "Ohio",
  OK: "Oklahoma",
  OR: "Oregon",
  PW: "Palau",
  PA: "Pennsylvania",
  PR: "Puerto Rico",
  RI: "Rhode Island",
  SC: "South Carolina",
  SD: "South Dakota",
  TN: "Tennessee",
  TX: "Texas",
  VI: "U.S. Virgin Islands",
  UT: "Utah",
  VT: "Vermont",
  VA: "Virginia",
  WA: "Washington",
  DC: "Washington DC",
  WV: "West Virginia",
  WI: "Wisconsin",
  WY: "Wyoming",
  AA: "Armed Forces Americas",
  AE: "Armed Forces Europe",
  AP: "Armed Forces Pacific",
};

export const STATES_DICT_REVERSE = {
  Alabama: "AL",
  Alaska: "AK",
  "American Samoa": "AS",
  Arizona: "AZ",
  Arkansas: "AR",
  California: "CA",
  Colorado: "CO",
  Connecticut: "CT",
  Delaware: "DE",
  Florida: "FL",
  Georgia: "GA",
  Guam: "GU",
  Hawaii: "HI",
  Idaho: "ID",
  Illinois: "IL",
  Indiana: "IN",
  Iowa: "IA",
  Kansas: "KS",
  Kentucky: "KY",
  Louisiana: "LA",
  Maine: "ME",
  "Marshall Islands": "MH",
  Maryland: "MD",
  Massachusetts: "MA",
  Michigan: "MI",
  Micronesia: "FM",
  Minnesota: "MN",
  Mississippi: "MS",
  Missouri: "MO",
  Montana: "MT",
  Nebraska: "NE",
  Nevada: "NV",
  "New Hampshire": "NH",
  "New Jersey": "NJ",
  "New Mexico": "NM",
  "New York": "NY",
  "North Carolina": "NC",
  "North Dakota": "ND",
  "Northern Mariana Islands": "MP",
  Ohio: "OH",
  Oklahoma: "OK",
  Oregon: "OR",
  Palau: "PW",
  Pennsylvania: "PA",
  "Puerto Rico": "PR",
  "Rhode Island": "RI",
  "South Carolina": "SC",
  "South Dakota": "SD",
  Tennessee: "TN",
  Texas: "TX",
  "U.S. Virgin Islands": "VI",
  Utah: "UT",
  Vermont: "VT",
  Virginia: "VA",
  Washington: "WA",
  "Washington DC": "DC",
  "West Virginia": "WV",
  Wisconsin: "WI",
  Wyoming: "WY",
  "Armed Forces Americas": "AA",
  "Armed Forces Europe": "AE",
  "Armed Forces Pacific": "AP",
};

// All states and regions array
export const STATES = [
  {
    value: "AL",
    text: "Alabama",
  },
  {
    value: "AK",
    text: "Alaska",
  },
  {
    value: "AS",
    text: "American Samoa",
  },
  {
    value: "AZ",
    text: "Arizona",
  },
  {
    value: "AR",
    text: "Arkansas",
  },
  {
    value: "CA",
    text: "California",
  },
  {
    value: "CO",
    text: "Colorado",
  },
  {
    value: "CT",
    text: "Connecticut",
  },
  {
    value: "DE",
    text: "Delaware",
  },
  {
    value: "FL",
    text: "Florida",
  },
  {
    value: "GA",
    text: "Georgia",
  },
  {
    value: "GU",
    text: "Guam",
  },
  {
    value: "HI",
    text: "Hawaii",
  },
  {
    value: "ID",
    text: "Idaho",
  },
  {
    value: "IL",
    text: "Illinois",
  },
  {
    value: "IN",
    text: "Indiana",
  },
  {
    value: "IA",
    text: "Iowa",
  },
  {
    value: "KS",
    text: "Kansas",
  },
  {
    value: "KY",
    text: "Kentucky",
  },
  {
    value: "LA",
    text: "Louisiana",
  },
  {
    value: "ME",
    text: "Maine",
  },
  {
    value: "MH",
    text: "Marshall Islands",
  },
  {
    value: "MD",
    text: "Maryland",
  },
  {
    value: "MA",
    text: "Massachusetts",
  },
  {
    value: "MI",
    text: "Michigan",
  },
  {
    value: "FM",
    text: "Micronesia",
  },
  {
    value: "MN",
    text: "Minnesota",
  },
  {
    value: "MS",
    text: "Mississippi",
  },
  {
    value: "MO",
    text: "Missouri",
  },
  {
    value: "MT",
    text: "Montana",
  },
  {
    value: "NE",
    text: "Nebraska",
  },
  {
    value: "NV",
    text: "Nevada",
  },
  {
    value: "NH",
    text: "New Hampshire",
  },
  {
    value: "NJ",
    text: "New Jersey",
  },
  {
    value: "NM",
    text: "New Mexico",
  },
  {
    value: "NY",
    text: "New York",
  },
  {
    value: "NC",
    text: "North Carolina",
  },
  {
    value: "ND",
    text: "North Dakota",
  },
  {
    value: "MP",
    text: "Northern Mariana Islands",
  },
  {
    value: "OH",
    text: "Ohio",
  },
  {
    value: "OK",
    text: "Oklahoma",
  },
  {
    value: "OR",
    text: "Oregon",
  },
  {
    value: "PW",
    text: "Palau",
  },
  {
    value: "PA",
    text: "Pennsylvania",
  },
  {
    value: "PR",
    text: "Puerto Rico",
  },
  {
    value: "RI",
    text: "Rhode Island",
  },
  {
    value: "SC",
    text: "South Carolina",
  },
  {
    value: "SD",
    text: "South Dakota",
  },
  {
    value: "TN",
    text: "Tennessee",
  },
  {
    value: "TX",
    text: "Texas",
  },
  {
    value: "VI",
    text: "U.S. Virgin Islands",
  },
  {
    value: "UT",
    text: "Utah",
  },
  {
    value: "VT",
    text: "Vermont",
  },
  {
    value: "VA",
    text: "Virginia",
  },
  {
    value: "WA",
    text: "Washington",
  },
  {
    value: "DC",
    text: "Washington DC",
  },
  {
    value: "WV",
    text: "West Virginia",
  },
  {
    value: "WI",
    text: "Wisconsin",
  },
  {
    value: "WY",
    text: "Wyoming",
  },
  {
    value: "AA",
    text: "Armed Forces Americas",
  },
  {
    value: "AE",
    text: "Armed Forces Europe",
  },
  {
    value: "AP",
    text: "Armed Forces Pacific",
  },
];

// This will process all of the values that potentially have run-on decimals. It will shorten them to 2
export const handleDecimalValue = (val) => {
  if (val) {
    val.replace('"','');
    if (val === "Coming Soon" || val === null || val === "ComingSoon") {
      return "Coming Soon";
    } else {
      if (val.toString().length > 2) {
        return parseFloat(val).toString();
      }
      return val;
    }
  } else {
    return "NA";
  }
};

// If a value in the database is a INT but the value could be "Coming Soon"
export const handleNeedsNumber = (val) => {
  if (val) {
    val.replace('"','');
    if (typeof val !== "number") {
      return parseInt(val).toString();
    } else {
      return val;
    }
  } else {
    return "NA";
  }
};
