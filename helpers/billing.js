import axios from "axios";

// Calls the Stripe api and gets the checkout urls
export const getCheckoutURL = async () => {
  return await axios({
    method: "post",
    url: "/api/billing/get-checkout-url",
    data: {
      host: window.location.protocol + "//" + window.location.host + "/" + window.location.pathname,
    },
  })
    .then(({ data }) => {
      return data;
    })
    .catch(({ response }) => {
      return null;
    });
};

// Retrives the user session url and subscriptoin information
export const getBillingInformation = async (stripeCustomerID) => {
  return await axios({
    method: "post",
    url: "/api/billing/get-billing-information",
    data: {
      host: window.location.protocol + "//" + window.location.host + "/account/billing",
      sessionID: stripeCustomerID,
    },
  })
    .then(({ data }) => {
      return data;
    })
    .catch(({ response }) => {
      return null;
    });
};
