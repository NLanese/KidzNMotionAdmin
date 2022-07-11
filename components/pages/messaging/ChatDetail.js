import React, { useEffect, useState } from "react";
import styled from "styled-components";

import ChatHeader from "./detail/ChatHeader";
import ChatMessages from "./detail/ChatMessages";
import ChatMessageInput from "./detail/ChatMessageInput";
import ChatOptions from "./detail/ChatOptions";

import { getChatByID } from "@helpers/chat";

import { userState } from "@atoms";
import { useRecoilValue } from "recoil";

const ChatDetailWrapper = styled.div``;

function ChatDetail({ selectedChatRoom }) {
  const user = useRecoilValue(userState);
  const [chatRoomObject, setChatRoomObject] = useState(null);
  const [chatOptionsModalOpen, setChatOptionsModalOpen] = useState(false);

  const fetchChatDetail = async () => {
    const newChatRoomDetail = await getChatByID(user, selectedChatRoom.id);
    if (newChatRoomDetail) {
      setChatRoomObject(newChatRoomDetail);
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
          <ChatOptions
            user={user}
            setChatRoomObject={setChatRoomObject}
            chatRoomObject={chatRoomObject}
            chatOptionsModalOpen={chatOptionsModalOpen}
            setChatOptionsModalOpen={setChatOptionsModalOpen}
          />
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
