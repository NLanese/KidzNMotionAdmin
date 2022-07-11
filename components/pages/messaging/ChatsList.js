import React, { useState } from "react";
import styled from "styled-components";

import {
  Avatar,
  Empty,
  Select,
  Input,
  Button,
  Space,
  Typography,
  Popover,
  Row,
  Col,
} from "antd";
import { PlusOutlined, SearchOutlined, ArrowRightOutlined } from "@ant-design/icons";
var dateFormat = require("dateformat");
const { Option } = Select;
const { Text } = Typography;

import { userState } from "@atoms";
import { useRecoilValue } from "recoil";

import CreateChatRoom from "./CreateChatRoom";

import BasicLink from "@common/BasicLink";

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
    props.active ? props.theme.colors.lightPrimary : "white"};
  :hover {
    background-color: ${(props) => props.theme.colors.backgroundColor};
  }

  & strong {
    text-transform: capitalize;
  }
`;

function ChatsList({ chatRooms, selectedChatRoom }) {
  let [search, setSearch] = useState(null);
  const user = useRecoilValue(userState);
  let [createChatOpen, setCreateChatOpen] = useState(null);
  let [chatTypeSearch, setChatTypeSearch] = useState("all");

  const renderChatRowItems = () => {
    let filteredChatRooms = structuredClone(chatRooms);

    if (chatRooms.length === 0) {
      return (
        <div style={{ padding: "30px", textAlign: "center" }}>
          <Empty description="No chat rooms created yet" />
          <br />
          <BasicLink shallow={true} href="/messaging?create=true">
            <Button type="primary" shape="round" size="large">
              Create New Chat +
            </Button>
          </BasicLink>
        </div>
      );
    }

    if (search && search !== "") {
      filteredChatRooms = filteredChatRooms.filter((chatRoom) => {
        let shouldShow = false;

        if (
          chatRoom.chatroomName.toLowerCase().includes(search.toLowerCase())
        ) {
          shouldShow = true;
        }

        let chatString = JSON.stringify(chatRoom.guests);
        if (chatString.toLowerCase().includes(search.toLowerCase())) {
          shouldShow = true;
        }

        return shouldShow;
      });
    }
    if (chatTypeSearch !== "all") {
      filteredChatRooms = filteredChatRooms.filter((chatRoom) => {
        let shouldShow = false;

        if (chatTypeSearch === "driver") {
          if (chatRoom.drivers.length !== 0) {
            return true;
          }
        }
        if (chatTypeSearch === "manager") {
          if (chatRoom.managers.length !== 0) {
            return true;
          }
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
              setChatTypeSearch("all");
            }}
          >
            Reset Filters
          </Button>
        </div>
      );
    }

    return filteredChatRooms.map((chatRoomObject) => {
      let chatName = chatRoomObject.chatroomName;
      let chatInitials = chatRoomObject.chatroomName.slice(0, 2);
      if (chatName === "Unnamed Chat") {
        chatName = "Unnamed";
        chatInitials = "?";
      }

      return (
        <BasicLink
          key={chatRoomObject.id}
          href={`/messaging?chat=${chatRoomObject.id}`}
          shallow={true}
        >
          <ChatRowItem
            active={
              selectedChatRoom && selectedChatRoom.id === chatRoomObject.id
            }
          >
            <Row justify="middle" align="middle">
              <Col xs={18}>
                <Space>
                  <Avatar
                    style={{ backgroundColor: "#2d4499", fontSize: "16px" }}
                    size={37}
                  >
                    {chatName === "Unnamed" ? (
                      <>?</>
                    ) : (
                      <>{chatInitials.toUpperCase()}</>
                    )}
                  </Avatar>
                  <Space direction="vertical" size={3}>
                    <Text strong>{chatName}</Text>
                    <Text type="secondary">
                      ({chatRoomObject.guests.length - 1} Member
                      {chatRoomObject.guests.length - 1 !== 1 ? "s" : ""} In
                      Chat)
                    </Text>
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
        </BasicLink>
      );
    });
  };

  return (
    <ChatListWrapper>
      <CreateChatRoom
        chatRooms={chatRooms}
        createChatOpen={createChatOpen}
        setCreateChatOpen={setCreateChatOpen}
      />
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
        {user.role == "OWNER" && (
          <Popover content={<span>Create New Chat Room</span>}>
            <Button
              shape="circle"
              type="primary"
              size="large"
              onClick={() => setCreateChatOpen(true)}
            >
              <PlusOutlined />
            </Button>
          </Popover>
        )}
      </ChatListHeader>
      {renderChatRowItems()}
    </ChatListWrapper>
  );
}

export default ChatsList;
