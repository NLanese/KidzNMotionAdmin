import { message } from "antd";

import { OWNER_GET_MANAGERS, MANAGER_GET_MANAGERS } from "@graphql/operations";
import client from "@utils/apolloClient";

// Global function to get user drivers
export const getManagers = async (user) => {
  const managers = await client
    .query({
      query: user.role === "OWNER" ? OWNER_GET_MANAGERS : MANAGER_GET_MANAGERS,
      fetchPolicy: "network-only",
      variables: {
        token: localStorage.getItem("token"),
        role: user.role,
        id: user.id
      },
    })
    .then(async (resolved) => {
      if (user.role === "OWNER") {
        return resolved.data.getOwner.managers;
      } else if (role === "MANAGER") {
        return resolved.data.getManager.managers;
      }
    })
    .catch((error) => {
      message.error("Sorry, there was an error getting this information");
    });
  return managers;
};
