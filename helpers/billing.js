import axios from "axios";

// Calls the Stripe api and gets the checkout urls
export const getCheckoutURL = async (annual, promo = "") => {
  let url
  if (annual){
    if (promo.toUpperCase() === "FOUNDER50"){
      url = "/api/billing/get-annual-checkout-url?discount=true"
    }
    else{
      url = "/api/billing/get-annual-checkout-url?discount=false"
    }
  }
  else{
    if (promo.toUpperCase() === "FOUNDER50"){
     url = "/api/billing/get-checkout-url?discount=true"
    }
    else{
      url = "/api/billing/get-checkout-url?discount=false"
    }
  }
  return await axios({
    method: "post",
    url: url,
    data: {
      host:
        window.location.protocol +
        "//" +
        window.location.host +
        "/account/billing",
      token: localStorage.getItem("token"),
    },
  })
    .then(({ data }) => {
      return data;
    })
    .catch(({ response }) => {
      return null;
    });
};

// Rest function to update a users stripe subscription id
export const updateOrganizationSubscription = async (stripeSessionID) => {
  return await axios({
    method: "post",
    url: "/api/billing/update-organization-subscription",
    data: {
      host:
        window.location.protocol +
        "//" +
        window.location.host +
        "/" +
        window.location.pathname,
      token: localStorage.getItem("token"),
      stripeSessionID: stripeSessionID,
    },
  })
    .then(({ data }) => {
      // window.location = "/account/billing?activated=true";
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
      host:
        window.location.protocol +
        "//" +
        window.location.host +
        "/account/billing",
      token: localStorage.getItem("token"),
    },
  })
    .then(({ data }) => {
      return data;
    })
    .catch(({ response }) => {
      return null;
    });
};

// Rest function to update a users stripe subscription id
export const updateSoloGuardianSubscription = async (
  userID,
  stripeSessionID
) => {
  return await axios({
    method: "post",
    url: "/api/billing/update-solo-guardian-subscription",
    data: {
      stripeSessionID: stripeSessionID,
      userID: userID,
    },
  })
    .then(({ data }) => {
      // window.location = "/account/billing?activated=true";
    })
    .catch(({ response }) => {
      return null;
    });
};
