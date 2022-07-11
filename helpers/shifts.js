import { message } from "antd";

import { OWNER_GET_SHIFTS, MANAGER_GET_SHIFTS } from "@graphql/operations";
import client from "@utils/apolloClient";

// Global function to get user drivers
export const getShiftByDate = async (role, userID, fetchNetwork, date) => {
  const shifts = await client
    .query({
      query: role === "OWNER" ? OWNER_GET_SHIFTS : MANAGER_GET_SHIFTS,
      fetchPolicy: fetchNetwork && "network-only",
      variables: {
        token: localStorage.getItem("token"),
        role: role,
        id: userID,
        date: date
      },
    })
    .then(async (resolved) => {
      if (role === "OWNER") {
        return resolved.data.getOwner.dsp.shifts;
      } else if (role === "MANAGER") {
        return resolved.data.getManager.dsp.shifts;
      }
    })
    .catch((error) => {
      message.error("Sorry, there was an error getting this information");
    });

  return shifts;
};
