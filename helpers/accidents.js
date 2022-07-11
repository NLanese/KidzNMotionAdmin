import { message } from "antd";

import { DYNAMIC_GET_ALL_ACCIDENTS } from "@graphql/operations";
import client from "@utils/apolloClient";

// Global function to get user accidents
export const getAccidents = async (role) => {
  const accidents = await client
    .query({
      query: DYNAMIC_GET_ALL_ACCIDENTS,
      variables: {
        token: localStorage.getItem("token"),
        role: role,
      },
    })
    .then(async (resolved) => {
        return resolved.data.dynamicGetAllAccidents;
    })
    .catch((error) => {
      message.error("Sorry, there was an error getting this information");
    });
  return accidents;
};
