import { message } from "antd";

import { MANAGER_GET_CHATS, OWNER_GET_CHATS, DYNAMIC_GET_CHATROOM_BY_ID } from "@graphql/operations";
import client from "@utils/apolloClient";

// Global function to get user chat rooms
export const getUserChats = async (user) => {
  const chatRooms = await client
    .query({
      query: user.role === "OWNER" ? OWNER_GET_CHATS : MANAGER_GET_CHATS,
      fetchPolicy: "network-only",
      variables: {
        token: localStorage.getItem("token"),
        role: user.role,
        id: user.id
      },
    })
    .then(async (resolved) => {
      if (user.role === "OWNER") {
        return resolved.data.getOwner.chatrooms;
      } else if (role === "MANAGER") {
        return resolved.data.getManager.chatrooms;
      }
    })
    .catch((error) => {
      message.error("Sorry, there was an error getting this information");
    });
  return chatRooms;
};


// Global function to get user drivers
export const getChatByID = async (user, chatRoomID) => {
  const chatRoom = await client
    .query({
      query: DYNAMIC_GET_CHATROOM_BY_ID,
      fetchPolicy: "network-only",
      variables: {
        token: localStorage.getItem("token"),
        role: user.role,
        chatroomId: chatRoomID
      },
    })
    .then(async (resolved) => {
      return resolved.data.dynamicGetChatroomById;
    })
    .catch((error) => {
      message.error("Sorry, there was an error getting this information");
    });
  return chatRoom;
};
