import React, { useEffect, useState } from "react";
import styled from "styled-components";

import ChatHeader from "./detail/ChatHeader";
import ChatMessages from "./detail/ChatMessages";
import ChatMessageInput from "./detail/ChatMessageInput";

import { message } from "antd";
import { GET_CHAT_ROOM_BY_ID } from "@graphql/operations";
import client from "@utils/apolloClient";

import { userState } from "@atoms";
import { useRecoilValue } from "recoil";

const ChatDetailWrapper = styled.div``;

function ChatDetail({ selectedChatRoom }) {
  const user = useRecoilValue(userState);
  const [chatRoomObject, setChatRoomObject] = useState(null);
  const [chatOptionsModalOpen, setChatOptionsModalOpen] = useState(false);

  const fetchChatDetail = async () => {
    const token = localStorage.getItem("token");

    if (token) {
      await client
        .query({
          query: GET_CHAT_ROOM_BY_ID,
          fetchPolicy: "network-only",
          variables: {
            id: selectedChatRoom.id,
          },
        })
        .then(async (resolved) => {
          console.log(resolved);
          setChatRoomObject(resolved.data.getChatFromId);
        })
        .catch((error) => {
          setChatRoomObject(null);
          message.error("Sorry, there was an error getting this information");
        });
    } else {
      setChatRoomObject(null);
    }
  };

  useEffect(() => {
    fetchChatDetail();

    setChatOptionsModalOpen(false);
  }, [selectedChatRoom.id]);

  return (
    <ChatDetailWrapper>
      {chatRoomObject && (
        <>
          <ChatHeader
            user={user}
            chatRoomObject={chatRoomObject}
            setChatOptionsModalOpen={setChatOptionsModalOpen}
          />
          <ChatMessages user={user} chatRoomObject={chatRoomObject} />
          <ChatMessageInput
            user={user}
            chatRoomObject={chatRoomObject}
            fetchChatDetail={fetchChatDetail}
          />
        </>
      )}
    </ChatDetailWrapper>
  );
}

export default ChatDetail;
