import React from "react";
import styled from "styled-components";
import { Button, Typography, Popover, Space } from "antd";

import { SettingOutlined, EditOutlined } from "@ant-design/icons";
import NakedButton from "@common/NakedButton";
const { Text, Title } = Typography;

const ChatDetailHeader = styled.div`
  display: flex;
  background: rgb(255, 255, 255);
  background: linear-gradient(
    94deg,
    rgba(255, 255, 255, 0.82454919467787116) 0%,
    rgba(255, 255, 255, 0.82454919467787116) 95%
  );

  border-bottom: 1px solid #f0f0f0;
  backdrop-filter: blur(10px) !important;
  position: absolute;
  top: 0px;
  left: 0px;
  width: 100%;
  height: 60px;
  justify-content: space-between;
  align-items: center;
  position: relative;
  text-align: center;
  padding: 10px 20px;
  .ant-typography {
    display: block;
  }
  & h4 {
    text-transform: capitalize;
    position: absolute;
    left: 0 !important;
    right: 0 !important;
    margin-left: auto !important;
    margin-right: auto !important;
    margin-top: 0px !important;
    margin-bottom: 0px !important;
    top: 16px;
    width: fit-content;
  }
  @media (max-width: ${(props) => props.theme.breakPoints.lg}) {
    height: 90px;
    align-items: flex-end;
  }
`;

function ChatHeader({ chatRoomObject, user, setChatOptionsModalOpen }) {
  const getChatDetail = () => {
    return (
      "(" +
      (chatRoomObject.guests.length - 1) +
      ` Member${chatRoomObject.guests.length - 1 !== 1 ? "s" : ""} In Chat)`
    );
  };

  const getChatName = () => {
    return chatRoomObject.chatroomName;
  };

  const getChatMembers = () => {
    return (
      <div style={{ maxHeight: "400px", overflowY: "scroll" }}>
        <Space direction="vertical" size={3}>
          {chatRoomObject.guests.map((guestObject, index) => {
            if (guestObject.id === user.id) return null;
            return (
              <Text key={guestObject.id}>
                 {guestObject.firstname} {guestObject.lastname}
              </Text>
            );
          })}
        </Space>
      </div>
    );
  };

  return (
    <ChatDetailHeader>
      <Popover
        content={getChatMembers()}
        title="Chat Members"
        placement="bottom"
      >
        <Text type="secondary">{getChatDetail()}</Text>
      </Popover>

      <NakedButton
        disabled={chatRoomObject.chatroomOwner.id !== user.id}
        onClick={() => setChatOptionsModalOpen(true)}
      >
        <Title level={4}>
          {getChatName()}{" "}
          {chatRoomObject.chatroomOwner.id === user.id && <EditOutlined />}
        </Title>
      </NakedButton>
      <Button
        type="ghost"
        onClick={() => setChatOptionsModalOpen(true)}
        disabled={chatRoomObject.chatroomOwner.id !== user.id}
      >
        <SettingOutlined /> Options
      </Button>
    </ChatDetailHeader>
  );
}

export default ChatHeader;
