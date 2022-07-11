import { message } from "antd";

import { GET_COMPANY_PREFERENCES } from "@graphql/operations";
import client from "@utils/apolloClient";


// Global function to get the current company preferences
export const getCompanyPreferences = async (role) => {
  const companyPreferences = await client
    .mutate({
      mutation: GET_COMPANY_PREFERENCES,
      variables: {
        token: localStorage.getItem("token"),
        role: role,
      },
    })
    .then(async (resolved) => {
      return resolved.data.refreshOwner.dsp;
    })
    .catch((error) => {
      message.error("Sorry, there was an error getting this information");
    });
  return companyPreferences;
};

export const convertCompanyPreferenceFormToGraphQL = (formValues) => {
  const convertedFormValues = {
    variables: {
      token: localStorage.getItem("token"),
      name: formValues.companyDetails.name,
      timeZone: formValues.companyDetails.timeZone,
      shortcode: formValues.companyDetails.shortcode,
      smallCardLimits: formValues.layoutSettings.smallCardLimits,
      topCardLimits: formValues.layoutSettings.topCardLimits,
      ficoLimits: {
        fair: formValues.scoreCard.ficoLimits.fair,
        good: formValues.scoreCard.ficoLimits.good,
        fantastic: formValues.scoreCard.ficoLimits.fantastic,
      },
      deliveryNotRecievedLimits: {
        fair: formValues.scoreCard.deliveryNotRecievedLimits.fair,
        good: formValues.scoreCard.deliveryNotRecievedLimits.good,
        fantastic: formValues.scoreCard.deliveryNotRecievedLimits.fantastic,
      },
      distractionLimits: {
        fair: formValues.scoreCard.distractionLimits.fair,
        good: formValues.scoreCard.distractionLimits.good,
        fantastic: formValues.scoreCard.distractionLimits.fantastic,
      },
      deliveryCompletionRateLimits: {
        fair: formValues.scoreCard.deliveryCompletionRateLimits.fair,
        good: formValues.scoreCard.deliveryCompletionRateLimits.good,
        fantastic:
          formValues.scoreCard.deliveryCompletionRateLimits.fantastic,
      },
      followLimits: {
        fair: formValues.scoreCard.followLimits.fair,
        good: formValues.scoreCard.followLimits.good,
        fantastic: formValues.scoreCard.followLimits.fantastic,
      },
      photoOnDeliveryLimits: {
        fair: formValues.scoreCard.photoOnDeliveryLimits.fair,
        good: formValues.scoreCard.photoOnDeliveryLimits.good,
        fantastic: formValues.scoreCard.photoOnDeliveryLimits.fantastic,
      },
      seatbeltLimits: {
        fair: formValues.scoreCard.seatbeltLimits.fair,
        good: formValues.scoreCard.seatbeltLimits.good,
        fantastic: formValues.scoreCard.seatbeltLimits.fantastic,
      },
      signalLimits: {
        fair: formValues.scoreCard.signalLimits.fair,
        good: formValues.scoreCard.signalLimits.good,
        fantastic: formValues.scoreCard.signalLimits.fantastic,
      },
      speedingLimits: {
        fair: formValues.scoreCard.speedingLimits.fair,
        good: formValues.scoreCard.speedingLimits.good,
        fantastic: formValues.scoreCard.speedingLimits.fantastic,
      },
      autoSend: {
        subpar: formValues.feedbackNotifications.subpar.autoSend,
        fair: formValues.feedbackNotifications.fair.autoSend,
        great: formValues.feedbackNotifications.great.autoSend,
      },
      feedbackNotifications: {
        fair: formValues.feedbackNotifications.fair.message,
        great: formValues.feedbackNotifications.great.message,
        subpar: formValues.feedbackNotifications.subpar.message,
      },
    },
  };

  return convertedFormValues 
}

export const convertGraphQLForCompanyPreferencesForm = (intitalValues) => {
  const FORMATTED_VALUES = {
    companyDetails: {
      name: intitalValues.name,
      shortcode: intitalValues.shortcode,
      timeZone: intitalValues.timeZone,
    },
    layoutSettings: {
      topCardLimits: intitalValues.topCardLimits,
      smallCardLimits: intitalValues.smallCardLimits,
    },
    scoreCard: {
      deliveryCompletionRateLimits: {
        fair: intitalValues.deliveryCompletionRateLimits.fair,
        good: intitalValues.deliveryCompletionRateLimits.good,
        fantastic: intitalValues.deliveryCompletionRateLimits.fantastic,
      },
      photoOnDeliveryLimits: {
        fair: intitalValues.photoOnDeliveryLimits.fair,
        good: intitalValues.photoOnDeliveryLimits.good,
        fantastic: intitalValues.photoOnDeliveryLimits.fantastic,
      },
      ficoLimits: {
        fair: intitalValues.ficoLimits.fair,
        good: intitalValues.ficoLimits.good,
        fantastic: intitalValues.ficoLimits.fantastic,
      },
      seatbeltLimits: {
        fair: intitalValues.seatbeltLimits.fair,
        good: intitalValues.seatbeltLimits.good,
        fantastic: intitalValues.seatbeltLimits.fantastic,
      },
      speedingLimits: {
        fair: intitalValues.speedingLimits.fair,
        good: intitalValues.speedingLimits.good,
        fantastic: intitalValues.speedingLimits.fantastic,
      },
      distractionLimits: {
        fair: intitalValues.distractionLimits.fair,
        good: intitalValues.distractionLimits.good,
        fantastic: intitalValues.distractionLimits.fantastic,
      },
      signalLimits: {
        fair: intitalValues.signalLimits.fair,
        good: intitalValues.signalLimits.good,
        fantastic: intitalValues.signalLimits.fantastic,
      },
      followLimits: {
        fair: intitalValues.followLimits.fair,
        good: intitalValues.followLimits.good,
        fantastic: intitalValues.followLimits.fantastic,
      },
      deliveryNotRecievedLimits: {
        fair: intitalValues.deliveryNotRecievedLimits.fair,
        good: intitalValues.deliveryNotRecievedLimits.good,
        fantastic: intitalValues.deliveryNotRecievedLimits.fantastic,
      },
    },
    feedbackNotifications: {
      subpar: {
        message: intitalValues.feedbackNotifications.subpar,
        autoSend: intitalValues.autoSend.subpar,
      },
      fair: {
        message: intitalValues.feedbackNotifications.fair,
        autoSend: intitalValues.autoSend.fair,
      },
      great: {
        message: intitalValues.feedbackNotifications.great,
        autoSend: intitalValues.autoSend.great,
      },
    },
  };
  return FORMATTED_VALUES;
};
