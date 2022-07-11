import { message } from "antd";

import { OWNER_GET_ASSETS, MANAGER_GET_ASSETS } from "@graphql/operations";
import client from "@utils/apolloClient";

// Global function to get user drivers
export const getAssets = async (role) => {
  const assets = await client
    .mutate({
      mutation: role === "OWNER" ? OWNER_GET_ASSETS : MANAGER_GET_ASSETS,
      variables: {
        token: localStorage.getItem("token"),
        role: role,
      },
    })
    .then(async (resolved) => {
      if (role === "OWNER") {
        return resolved.data.refreshOwner.dsp.devices;
      } else if (role === "MANAGER") {
        return resolved.data.refreshManager.dsp.devices;
      }
    })
    .catch((error) => {
      message.error("Sorry, there was an error getting this information");
    });
  return assets;
};
