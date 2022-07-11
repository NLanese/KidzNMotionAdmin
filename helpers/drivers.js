import { message } from "antd";

import { OWNER_GET_DRIVERS, MANAGER_GET_DRIVERS } from "@graphql/operations";
import client from "@utils/apolloClient";

// Global function to get user drivers
export const getUserDrivers = async (role) => {
  const drivers = await client
    .mutate({
      mutation: role === "OWNER" ? OWNER_GET_DRIVERS : MANAGER_GET_DRIVERS,
      variables: {
        token: localStorage.getItem("token"),
        role: role,
      },
    })
    .then(async (resolved) => {
      if (role === "OWNER") {
        return resolved.data.refreshOwner.drivers;
      } else if (role === "MANAGER") {
        return resolved.data.refreshManager.drivers;
      }
    })
    .catch((error) => {
      message.error("Sorry, there was an error getting this information");
    });
  return drivers;
};
