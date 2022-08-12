import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { Button, Input, Popconfirm, message } from "antd";
import { SendOutlined } from "@ant-design/icons";

import { useMutation } from "@apollo/client";
import { DYNAMIC_SEND_MESSAGE } from "@graphql/operations";

const { TextArea } = Input;

const ChatMessageInputWrapper = styled.div`
  padding: 10px;
  display: flex;
  border-top: 1.5px solid #f0f0f0;
  align-items: center;
  & button {
    height: 50px;
    min-width: 200px;
    margin-left: 20px;
  }
  @media (max-width: ${(props) => props.theme.breakPoints.lg}) {
    flex-direction: column;
    width: 100%;
    .ant-popover-disabled-compatible-wrapper {
      width: 100%;

    }
    & button {
      width: 100%;
      margin: 0px;
      transition: ${(props) => props.theme.transitions.standard};
      margin-top: 10px;
    }
  }
`;

function ChatMessageInput({ chatRoomObject, user, fetchChatDetail }) {
  const [messageSending, setMessageSending] = useState(false);
  const [messageText, setMessageText] = useState("");

  // Mutations
  const [dynamicSendMessage, {}] = useMutation(DYNAMIC_SEND_MESSAGE);

  useEffect(() => {
    setMessageText("");
    setMessageSending(false);
  }, [chatRoomObject]);

  const sendMessage = async () => {
    setMessageSending(true);
    await dynamicSendMessage({
      variables: {
        chatRoomID: chatRoomObject.id,
        content: messageText,
      },
    })
      .then(async (resolved) => {
        message.success("Message sent");
        setMessageText("");
        setMessageSending(false);
        await fetchChatDetail();
      })
      .catch((error) => {
        message.error("Unable to send message");
        setMessageSending(false);
      });
  };

  return (
    <ChatMessageInputWrapper>
      <TextArea
        placeholder={"Message"}
        size={"large"}
        onChange={(event) => setMessageText(event.target.value)}
        value={messageText}
        disabled={messageSending}
        allowClear={true}
        style={{ height: "100px" }}
        type="text"
      />
      <Popconfirm
        title="Confirm, I want to send this message"
        onConfirm={() => sendMessage()}
        okText="Yes, Send"
        disabled={messageText.length === 0}
        cancelText="No, Cancel"
      >
        <Button
          type="primary"
          size="large"
          disabled={messageText.length === 0}
          loading={messageSending}
        >
          <SendOutlined /> Send
        </Button>
      </Popconfirm>
    </ChatMessageInputWrapper>
  );
}

export default ChatMessageInput;
