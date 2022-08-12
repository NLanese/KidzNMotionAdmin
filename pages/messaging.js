import React, { useState, useEffect } from "react";
import styled from "styled-components";

import PageHeader from "@common/PageHeader";

import { Row, Col, message } from "antd";
import ContentCard from "@common/content/ContentCard";

import { userState, chatRoomState } from "@atoms";

import { NextSeo } from "next-seo";
import { useRecoilValue, useRecoilState } from "recoil";

import LoadingBlock from "@common/LoadingBlock";
import { withRouter } from "next/router";

import { GET_USER_CHAT_ROOMS } from "@graphql/operations";
import client from "@utils/apolloClient";

import ChatsList from "@pages/messaging/ChatsList";
import ChatDetail from "@pages/messaging/ChatDetail";

const MessagingWrapper = styled.div`
  max-width: ${(props) => props.theme.contentSize.standard};
  margin: auto;
`;

function Messaging({ router }) {
  const user = useRecoilValue(userState);
  const [chatRooms, setChatRooms] = useRecoilState(chatRoomState);
  const [selectedChatRoom, setSelectedChatRoom] = useState(null);

  const getUserChatRooms = async () => {
    const token = localStorage.getItem("token");

    if (token) {
      await client
        .query({
          query: GET_USER_CHAT_ROOMS,
          fetchPolicy: "network-only",
        })
        .then(async (resolved) => {
          setChatRooms(resolved.data.getUserChatRooms);
        })
        .catch((error) => {
          setChatRooms(null);
          message.error("Sorry, there was an error getting this information");
        });
    } else {
      setChatRooms(null);
    }
  };

  useEffect(() => {
    getUserChatRooms();
  }, []);

  useEffect(() => {
    if (router.query && router.query.chat) {
      if (chatRooms && !chatRooms.loading) {
        let selectedChatRoom = chatRooms.filter(
          (chatRoomObject) => chatRoomObject.id === router.query.chat
        )[0];
        setSelectedChatRoom(selectedChatRoom);
      }
    }
  }, [router, chatRooms]);

  return (
    <MessagingWrapper>
      <NextSeo title="Messaging" />
      <PageHeader title="Messaging" />
      {chatRooms && chatRooms.loading && <LoadingBlock />}
      {chatRooms && !chatRooms.loading && (
        <Row gutter={[16, 16]}>
          <Col xs={24} md={24} lg={11} xl={8}>
            <ContentCard modifiers={["noPadding"]}>
              <ChatsList
                chatRooms={chatRooms}
                selectedChatRoom={selectedChatRoom}
              />
            </ContentCard>
          </Col>
          <Col xs={24} md={24} lg={13} xl={16}>
            <ContentCard modifiers={["noPadding"]}>
              {selectedChatRoom && (
                <ChatDetail selectedChatRoom={selectedChatRoom} />
              )}
            </ContentCard>
          </Col>
        </Row>
      )}
    </MessagingWrapper>
  );
}

export default withRouter(Messaging);
