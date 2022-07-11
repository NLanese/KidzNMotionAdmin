import React, { useState, useEffect } from "react";
import styled from "styled-components";

import PageHeader from "@common/PageHeader";

import { Row, Col } from "antd";
import ContentCard from "@common/content/ContentCard";

import { userState, driverState, chatState, managerState } from "@atoms";

import { NextSeo } from "next-seo";

import { getUserChats } from "@helpers/chat";
import { getUserDrivers } from "@helpers/drivers";
import { getManagers } from "@helpers/managers";
import { useRecoilValue, useRecoilState } from "recoil";

import LoadingBlock from "@common/LoadingBlock";
import Router from "next/router";
import { withRouter } from "next/router";

import ChatsList from "@pages/messaging/ChatsList";
import ChatDetail from "@pages/messaging/ChatDetail";

const MessagingWrapper = styled.div`
  max-width: ${(props) => props.theme.contentSize.standard};
  margin: auto;
`;

function Messaging({ router }) {
  const user = useRecoilValue(userState);
  const [drivers, setDrivers] = useRecoilState(driverState);
  const [chatRooms, setChatRooms] = useRecoilState(chatState);
  const [managers, setManagers] = useRecoilState(managerState);

  const [initialLoading, setInitialLoading] = useState(false);
  const [selectedChatRoom, setSelectedChatRoom] = useState(null);

  const fetchInitialInformation = async () => {
    setInitialLoading(true);
    if (!drivers) {
      const driverInformation = await getUserDrivers(user.role);
      setDrivers(driverInformation);
    }

    if (!managers) {
      const managerInformation = await getManagers(user);
      setManagers(managerInformation);
    }

    const chatRoomInformation = await getUserChats(user);
    setChatRooms(chatRoomInformation);

    if (router.query && router.query.chat) {
      Router.push("/messaging?chat=" + router.query.chat, null, {
        shallow: true,
      });
    } else {
      if (chatRoomInformation[0]) {
        Router.push("/messaging?chat=" + chatRoomInformation[0].id, null, {
          shallow: true,
        });
      }
    }

    setInitialLoading(false);
  };

  useEffect(() => {
    fetchInitialInformation();
  }, []);

  useEffect(() => {
    if (router.query && router.query.chat) {
      if (chatRooms) {
        let selectedChatRoom = chatRooms.filter(
          (chatRoomObject) => chatRoomObject.id === router.query.chat
        )[0];
        setSelectedChatRoom(selectedChatRoom);
      }
    }
  }, [router]);

  return (
    <MessagingWrapper>
      <NextSeo title="Messaging" />
      <PageHeader title="Messaging" />
      {initialLoading || !chatRooms || !drivers ? (
        <LoadingBlock />
      ) : (
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
