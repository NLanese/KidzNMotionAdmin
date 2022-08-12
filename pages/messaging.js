import React, { useState, useEffect } from "react";
import styled from "styled-components";

import PageHeader from "@common/PageHeader";

import { Row, Col } from "antd";
import ContentCard from "@common/content/ContentCard";

import { userState, chatRoomState } from "@atoms";

import { NextSeo } from "next-seo";
import { useRecoilValue, useRecoilState } from "recoil";

import LoadingBlock from "@common/LoadingBlock";
import { withRouter } from "next/router";

import { GET_USER_CHAT_ROOMS } from "@graphql/operations";
import client from "@utils/apolloClient";

const MessagingWrapper = styled.div`
  max-width: ${(props) => props.theme.contentSize.standard};
  margin: auto;
`;

function Messaging({ router }) {
  const user = useRecoilValue(userState);
  const [chatRooms, setChatRooms] = useRecoilState(chatRoomState);

  const getUserChatRooms = async () => {
    const token = localStorage.getItem("token");

    if (token) {
      await client
      .query({
        query: GET_USER_CHAT_ROOMS,
        fetchPolicy: 'network-only'
      })
      .then(async (resolved) => {
        setChatRooms(resolved.data.getUserChatRooms)
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


  return (
    <MessagingWrapper>
      <NextSeo title="Messaging" />
      <PageHeader title="Messaging" />
      {
          chatRooms && chatRooms.loading && (
              <LoadingBlock />
          )
      }
      {
          chatRooms && !chatRooms.loading && (
              <h1>sdf</h1>
          )
      }
    </MessagingWrapper>
  );
}

export default withRouter(Messaging);
