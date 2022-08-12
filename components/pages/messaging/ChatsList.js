import React, { useState } from "react";
import styled from "styled-components";

import {
  Avatar,
  Empty,
  Input,
  Button,
  Space,
  Typography,
  Row,
  Col,
} from "antd";
import { SearchOutlined, ArrowRightOutlined } from "@ant-design/icons";

const { Text } = Typography;

import { userState } from "@atoms";
import { useRecoilValue } from "recoil";

import { useMutation } from "@apollo/client";
import { CREATE_CHAT_ROOM } from "@graphql/operations";

import BasicLink from "@common/BasicLink";
import Router from "next/router";
import NakedButton from "@common/NakedButton";

const ChatListWrapper = styled.div`
  max-height: 1000px;
  overflow-y: scroll;
  padding: 60px 0px 10px;
  @media (max-width: ${(props) => props.theme.breakPoints.md}) {
    max-height: 250px;
  }
`;

const ChatListHeader = styled.div`
  background: rgb(255, 255, 255);
  background: linear-gradient(
    94deg,
    rgba(255, 255, 255, 0.82454919467787116) 0%,
    rgba(255, 255, 255, 0.82454919467787116) 95%
  );

  border-bottom: 1px solid #f0f0f0;
  backdrop-filter: blur(10px) !important;
  box-shadow: ${(props) => props.theme.boxShadow.hard};
  position: absolute;
  top: 0px;
  left: 0px;
  width: 100%;
  height: 60px;
  z-index: 9;
  display: flex;
  align-items: center;
  padding: 20px 22px;
  & button {
    margin-left: 10px;
  }
`;

const ChatRowItem = styled.div`
  padding: 14px 24px 14px 20px;
  border-bottom: 1px solid #f0f0f0;
  cursor: pointer;
  transition: ${(props) => props.theme.transitions.standard};
  background-color: ${(props) =>
    props.active ? props.theme.colors.backgroundColor : "white"};
  :hover {
    background-color: ${(props) => props.theme.colors.backgroundColor};
  }

  & strong {
    text-transform: capitalize;
  }
`;

function ChatRowContent({ selectedChatRoom, chatRoomObject, otherUser }) {
  return (
    <ChatRowItem
      active={selectedChatRoom && selectedChatRoom.id === chatRoomObject.id}
    >
      <Row justify="middle" align="middle">
        <Col xs={18}>
          <Space>
            <Avatar
              style={{ backgroundColor: "#f0932b", fontSize: "16px" }}
              size={37}
            >
              {otherUser.firstName[0].toUpperCase()}.
              {otherUser.lastName[1].toUpperCase()}.
            </Avatar>
            <Space direction="vertical" size={3}>
              <Text strong>
                {" "}
                {otherUser.firstName} {otherUser.lastName}
              </Text>
              <Text type="secondary">{otherUser.role}</Text>
            </Space>
          </Space>
        </Col>
        <Col xs={6}>
          <Text
            style={{
              float: "right",
              textAlign: "right",
              fontSize: "12px",
            }}
            type="secondary"
          >
            <ArrowRightOutlined />
          </Text>
        </Col>
      </Row>
    </ChatRowItem>
  );
}

function ChatsList({ chatRooms, selectedChatRoom }) {
  let [search, setSearch] = useState(null);
  const user = useRecoilValue(userState);

  // Mutations
  const [createChatRoom, {}] = useMutation(CREATE_CHAT_ROOM);

  const renderChatRowItems = () => {
    let filteredChatRooms = structuredClone(chatRooms);

    if (chatRooms.length === 0) {
      return (
        <div style={{ padding: "30px", textAlign: "center" }}>
          <Empty description="No chat rooms created yet" />
        </div>
      );
    }

    if (search && search !== "") {
      filteredChatRooms = filteredChatRooms.filter((chatRoom) => {
        let otherUser = chatRoom.users.filter(
          (userObject) => userObject.id !== user.id
        )[0];

        if (!otherUser) {
          return;
        }

        let otherUserName = otherUser.firstName + otherUser.lastName;
        let shouldShow = false;

        if (otherUserName.toLowerCase().includes(search.toLowerCase())) {
          shouldShow = true;
        }

        return shouldShow;
      });
    }

    if (filteredChatRooms.length === 0) {
      return (
        <div style={{ padding: "30px", textAlign: "center" }}>
          <Empty description="No chat rooms for this search" />
          <br />
          <Button
            type="primary"
            shape="round"
            size="large"
            onClick={() => {
              setSearch("");
            }}
          >
            Reset Filters
          </Button>
        </div>
      );
    }

    filteredChatRooms = filteredChatRooms.filter((chatRoomObject) => {
      return chatRoomObject.users.length > 1;
    });

    return filteredChatRooms.map((chatRoomObject) => {
      let otherUser = chatRoomObject.users.filter(
        (userObject) => userObject.id !== user.id
      )[0];
      return (
        <BasicLink
          key={chatRoomObject.id}
          href={`/messaging?chat=${chatRoomObject.id}`}
          shallow={true}
        >
          <ChatRowContent
            chatRoomObject={chatRoomObject}
            selectedChatRoom={selectedChatRoom}
            otherUser={otherUser}
          />
        </BasicLink>
      );
    });
  };

  const createNewChatRoom = async (otherParticipantID) => {
    await createChatRoom({
      variables: {
        otherParticipantID: otherParticipantID,
      },
    })
      .then(async (resolved) => {
        let newChatID = resolved.data.createChatRoom.id
        window.location =
          "/messaging/?chat=" + newChatID
      })
      .catch((error) => {
        message.error(
          "Sorry, there was an error opening this chat room"
        );
      });
  };

  const renderPossibleChats = () => {
    // console.clear()
    console.log(user);
    let possibleUserChats = [];

    if (user.role === "THERAPIST") {
      user.patientCarePlans.map((patientCarePlan) => {
        possibleUserChats.push({
          id: patientCarePlan.child.id,
          firstName: patientCarePlan.child.firstName,
          lastName: patientCarePlan.child.lastName,
          role: "CHILD",
        });
        possibleUserChats.push({
          id: patientCarePlan.child.guardian.id,
          firstName: patientCarePlan.child.guardian.firstName,
          lastName: patientCarePlan.child.guardian.lastName,
          role: "GUARDIAN",
        });
      });
    } else if (user.role === "GUARDIAN") {
      user.children.map((childObject) => {
        childObject.childCarePlans.map((childCarePlanObject) => {
          possibleUserChats.push({
            id: childCarePlanObject.therapist.id,
            firstName: childCarePlanObject.therapist.firstName,
            lastName: childCarePlanObject.therapist.lastName,
            role: "THERAPIST",
          });
        });
      });
    }

    let existingChatRoomUserIds = [];
    chatRooms.map((chatRoomObject) => {
      chatRoomObject.users.map((userObject) => {
        existingChatRoomUserIds.push(userObject.id);
      });
    });

    possibleUserChats = possibleUserChats.filter((possibleChatUser) => {
      return !existingChatRoomUserIds.includes(possibleChatUser.id);
    });

    return possibleUserChats.map((possibleChatUser) => {
      return (
        <div onClick={() => createNewChatRoom(possibleChatUser.id)} key={possibleChatUser.id}>
          <ChatRowContent
            chatRoomObject={{}}
            selectedChatRoom={{ id: "" }}
            otherUser={possibleChatUser}
          />
        </div>
      );
    });
  };

  return (
    <ChatListWrapper>
      <ChatListHeader>
        <Input
          placeholder="Search chats"
          block
          style={{ width: "100%" }}
          size="large"
          allowClear={true}
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          prefix={<SearchOutlined />}
        />
      </ChatListHeader>
      {renderChatRowItems()}
      {renderPossibleChats()}
    </ChatListWrapper>
  );
}

export default ChatsList;
