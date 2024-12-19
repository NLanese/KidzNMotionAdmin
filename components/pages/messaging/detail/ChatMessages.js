import React, { useEffect, useRef } from "react";
import styled from "styled-components";
import { Empty, Divider } from "antd";
import dateFormat from "dateformat";
import ChatBubble from "./ChatBubble";

const ChatMessagesWrapper = styled.div`
  min-height: 600px;
  max-height: 60vh;
  overflow-y: scroll;
  padding: 20px 40px;
  @media (max-width: ${(props) => props.theme.breakPoints.lg}) {
    max-height: 600px;
  }
  @media (max-width: ${(props) => props.theme.breakPoints.xs}) {
    max-height: 250px;
    min-height: 250px;
  }
`;

function reverseArr(input) {
  var ret = new Array();
  for (var i = input.length - 1; i >= 0; i--) {
    ret.push(input[i]);
  }
  return ret;
}

function ChatMessages({ chatRoomObject, user }) {
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView();
  }, [chatRoomObject]);

  const renderChatMessages = () => {
    if (chatRoomObject.messages.length === 0) {
      return (
        <div style={{ padding: "100px 0px" }}>
          <Empty description="No messages in chat" />
        </div>
      );
    }
    let today = null;
    let messages = chatRoomObject.messages;

    // Sorting the messages array by sentAt values
    let sortedMessages = [...messages].sort((a, b) => {
      const timeA = new Date(a.sentAt.timeStamp).getTime();
      const timeB = new Date(b.sentAt.timeStamp).getTime();
      return timeA - timeB;
    });


    // var messagesReversed = reverseArr(messages);
    var messagesReversed = sortedMessages;

    return messagesReversed.map((message) => {
      let displayMessagSentHeader = false;
      let messageSent = dateFormat(message.createdAt, "dddd (mm/dd)");
      if (today !== messageSent) {
        today = messageSent;
        displayMessagSentHeader = true;
      }

      return (
        <div key={message.id}>
          {displayMessagSentHeader && <Divider>{messageSent}</Divider>}
          <ChatBubble message={message} key={message.id} user={user} />
        </div>
      );
    });
  };

  return (
    <ChatMessagesWrapper>
      {renderChatMessages()}
      <div ref={bottomRef} />
    </ChatMessagesWrapper>
  );
}

export default ChatMessages;
