import React from "react";
import styled from "styled-components";
import { Typography } from "antd";
import dateFormat from "dateformat";

const { Text } = Typography;

const OuterMessageWrapper = styled.div`
  display: flex;
  justify-content: ${(props) => (props.fromOther ? "flex-start" : "flex-end")};
  align-items: center;
`;
const MessageWrapper = styled.div`
  padding: 5px 5px;
  display: flex;
  justify-content: ${(props) => (props.fromOther ? "flex-start" : "flex-end")};
  align-items: ${(props) => (props.fromOther ? "flex-start" : "flex-end")};
  flex-direction: column;
  margin-bottom: 5px;
`;

const ChatBubbleWrapper = styled.div`
  background: ${(props) =>
    props.fromOther ? "gray" : props.theme.colors.primary};
  border-top-right-radius: 14px;
  border-top-left-radius: 14px;
  border-bottom-left-radius: ${(props) => (props.fromOther ? "4px" : "14px")};
  border-bottom-right-radius: ${(props) => (props.fromOther ? "14px" : "4px")};
  padding: 12px 20px;
  width: fit-content;
  max-width: 500px;
  .ant-typography {
    color: white;
    font-weight: 600;
    font-size: 15px;
  }
  & strong {
    font-size: 12px !important;
    opacity: 0.8;
  }
`;

function ChatBubble({ message, user }) {
  const userMessage = message.sentBy.userID === user.id;

  if (!userMessage) {
    return (
      <OuterMessageWrapper fromOther={true}>
        <MessageWrapper fromOther={true}>
          <ChatBubbleWrapper fromOther={true}>
            <Text strong>
              {message.sentBy.firstName + " " + message.sentBy.lastName}
            </Text>
            <br />
            <Text>{message.content}</Text>
          </ChatBubbleWrapper>
          <Text type="secondary" style={{ float: "left" }}>
            {dateFormat(message.createdAt, "m/dd hh:MM tt")}{" "}
          </Text>
        </MessageWrapper>
      </OuterMessageWrapper>
    );
  }

  return (
    <OuterMessageWrapper>
      <MessageWrapper>
        <ChatBubbleWrapper>
          <Text>{message.content}</Text>
        </ChatBubbleWrapper>
        <Text type="secondary" style={{ float: "right" }}>
          {dateFormat(message.createdAt, "m/dd hh:MM tt")}{" "}
        </Text>
      </MessageWrapper>
    </OuterMessageWrapper>
  );
}

export default ChatBubble;
