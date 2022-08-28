import React, { useState, useEffect } from "react";
import styled from "styled-components";

import PageHeader from "@common/PageHeader";

import { Row, Col, message } from "antd";
import { Drawer } from "antd";
import ContentCard from "@common/content/ContentCard";
import Router from "next/router";

import { userState, meetingsState } from "@atoms";

import { NextSeo } from "next-seo";
import { useRecoilValue, useRecoilState } from "recoil";

import LoadingBlock from "@common/LoadingBlock";
import MeetingsTable from "@pages/meetings/MeetingsTable";
import { withRouter } from "next/router";

import { GET_USER_MEETINGS } from "@graphql/operations";
import client from "@utils/apolloClient";
import MeetingForm from "@components/forms/meetings/MeetingForm";

const MeetingsWrapper = styled.div`
  max-width: ${(props) => props.theme.contentSize.standard};
  margin: auto;
`;

function Meetings({ router }) {
  const user = useRecoilValue(userState);
  const [meetings, setMeetings] = useRecoilState(meetingsState);
  const [selectedMeeting, setSelectedMeeting] = useState(null);

  const getUserMeetings = async () => {
    const token = localStorage.getItem("token");

    if (token) {
      await client
        .query({
          query: GET_USER_MEETINGS,
          fetchPolicy: "network-only",
        })
        .then(async (resolved) => {
          setMeetings(resolved.data.getMeetings);
          console.log(resolved);
        })
        .catch((error) => {
          setMeetings(null);
          message.error("Sorry, there was an error getting this information");
        });
    } else {
      setMeetings(null);
    }
  };

  useEffect(() => {
    getUserMeetings();
  }, []);

  return (
    <MeetingsWrapper>
      <NextSeo title="Meetings" />
      <PageHeader
        title="Meetings"
        createURL="/meetings?create=true"
        createTitle="Create Meeting"
      />
      {meetings && meetings.loading && <LoadingBlock />}
      {meetings && !meetings.loading && (
        <Row gutter={[16, 16]}>
          <Col xs={24} md={24} lg={13} xl={24}>
            <ContentCard>
              <MeetingsTable meetings={meetings} />
            </ContentCard>
          </Col>

          <Drawer
            title={"Create Meeting"}
            placement="right"
            width={500}
            onClose={() => Router.push("/meetings", null, { shallow: true })}
            visible={router.query.create}
          >
            {
              router.query.create && (

                <MeetingForm/>
              )
            }
          </Drawer>
        </Row>
      )}
    </MeetingsWrapper>
  );
}

export default withRouter(Meetings);
