// React
import React, { useState, useEffect } from "react";

// Ant Design
import styled from "styled-components";
import PageHeader from "@common/PageHeader";
import { Row, Col, message, Button, Typography } from "antd";
import { Drawer } from "antd";
import ContentCard from "@common/content/ContentCard";
import LoadingBlock from "@common/LoadingBlock";

// Next
import Router from "next/router";
import { withRouter } from "next/router";
import { NextSeo } from "next-seo";

// Recoil
import { userState, meetingsState } from "@atoms";
import { useRecoilValue, useRecoilState } from "recoil";

// Mutations and Queries
import { GET_USER_MEETINGS, APPROVE_MEETING } from "@graphql/operations";
import client from "@utils/apolloClient";
import { useMutation } from "@apollo/client";

// Components
import MeetingsTable from "@pages/meetings/MeetingsTable";
import MeetingForm from "@components/forms/meetings/MeetingForm";
import EditMeetingForm from "../components/forms/meetings/EditMeetingForm";
import moment from "moment";
import MeetingCalendar from "../components/pages/meetings/MeetingCalendar";

const { Text, Title } = Typography;

const MeetingsWrapper = styled.div`
  max-width: ${(props) => props.theme.contentSize.standard};
  margin: auto;
  .ant-picker-calendar .ant-radio-group {
    display: none;
  }
`;

function Meetings({ router }) {
  const user = useRecoilValue(userState);
  const [meetings, setMeetings] = useRecoilState(meetingsState);
  const [pastMeetings, setPastMeetings] = useState([])

  // Mutations
  const [approveMeeting, {}] = useMutation(APPROVE_MEETING);

  const getUserMeetings = async () => {
    const token = localStorage.getItem("token");

    if (token) {
      await client
        .query({
          query: GET_USER_MEETINGS,
          fetchPolicy: "network-only",
        })
        .then(async (resolved) => {
          const allMeetings = resolved.data.getMeetings;
  
          // Get today's date
          const today = new Date();
          today.setHours(0, 0, 0, 0);
  
          // Filter and sort meetings
          const upcomingMeetings = allMeetings
            .filter((meeting) => new Date(meeting.meetingDateTime) >= today)
            .sort((a, b) => new Date(a.meetingDateTime) - new Date(b.meetingDateTime));
  
          const pastMeetings = allMeetings
            .filter((meeting) => new Date(meeting.meetingDateTime) < today)
            .sort((a, b) => new Date(b.meetingDateTime) - new Date(a.meetingDateTime));
  
          setMeetings(upcomingMeetings);
          setPastMeetings(pastMeetings);
        })
        .catch((error) => {
          setMeetings(null);
          message.error("Sorry, there was an error getting this information");
        });
    } else {
      setMeetings(null);
    }
  };

  const handleApproveMeeting = async (approvedMeeting) => {
    await approveMeeting({
      variables: {
        meetingID: getInitialValues().meetingID,
        approveMeeting: !getInitialValues().approved,
      },
    })
      .then(async (resolved) => {
        message.success("Successfully Approved Meeting");
        Router.push("/meetings");

        // Get the full user object and set that to state
        await client
          .query({
            query: GET_USER_MEETINGS,
            fetchPolicy: "network-only",
          })
          .then(async (resolved) => {
            setMeetings(resolved.data.getMeetings);
          })
          .catch((error) => {
            message.error("Sorry, there was an error getting this information");
          });
      })
      .catch((error) => {
        message.error(error.message);
      });
  };

  useEffect(() => {
    getUserMeetings();
  }, []);

  const getInitialValues = () => {
    let id = router.query.id;
    let intitalValues = {};

    let selectedMeetingObject = null;

    meetings.map((meetingObject) => {
      if (meetingObject.id === id) {
        selectedMeetingObject = meetingObject;
      }
    });

    let guardian = null;
    let child = null;
    selectedMeetingObject.users.map((userObject) => {
      if (userObject.role === "GUARDIAN") {
        guardian = userObject.id;
      }
      if (userObject.role === "CHILD") {
        child = userObject.id;
      }
    });

    if (selectedMeetingObject) {
      intitalValues = {
        type: selectedMeetingObject.type,
        meetingID: selectedMeetingObject.id,
        title: selectedMeetingObject.title,
        meetingDateTime: moment(selectedMeetingObject.meetingDateTime),
        guardian: guardian,
        approved: selectedMeetingObject.approved,
        pendingApproval: selectedMeetingObject.pendingApproval,
        child: child,
        cancelled: selectedMeetingObject.canceled,
        completed: false,
      };
    }

    return intitalValues;
  };

  const renderMeetingApprovalContent = () => {
    if (router.query.id && router.query.approve) {
      if (getInitialValues().pendingApproval) {
        return (
          <>
            <Title level={4}>Approve Meeting</Title>
            <Text>
              This meeting has not been approved yet. Please approve the meeting
              to set it into the guardian's calendar.
            </Text>
            <br />
            <br />
            <Button
              onClick={() => handleApproveMeeting(true)}
              type="primary"
              block
            >
              Approve Meeting
            </Button>
            <br />
            <br />
            <Button
              onClick={() => handleApproveMeeting(false)}
              type="primary"
              block
            >
              Decline Meeting
            </Button>
          </>
        );
      } else {
        if (getInitialValues().approved) {
          return (
            <>
              <Title level={4}>Approve Meeting</Title>
              <Text>
                This meeting has been approved. You can Decline the meeting to
                remove it from the guardian's calendar.
              </Text>
              <br />

              <br />
              <Button
                onClick={() => handleApproveMeeting(false)}
                type="primary"
                block
              >
                Decline Meeting
              </Button>
            </>
          );
        } else {
          return (
            <>
              <Title level={4}>Approve Meeting</Title>
              <Text>
                This meeting has been declined. You can approve the meeting to
                add it from the guardian's calendar.
              </Text>
              <br />

              <br />
              <Button
                onClick={() => handleApproveMeeting(true)}
                type="primary"
                block
              >
                Approve Meeting
              </Button>
            </>
          );
        }
      }
    }

    // {router.query.id && router.query.approve && (
    //   <div>
    //     {getInitialValues().approved ? (
    //       <>
    //         <Title level={4}>Disapprove Meeting</Title>
    //         <Text>
    //           This meeting has been approved. You can disapprove the
    //           meeting to remove it from the guardian's calendar.
    //         </Text>
    //         <br />
    //         <br />
    //       </>
    //     ) : (
    //       <>
    //         <Title level={4}>Approve Meeting</Title>
    //         <Text>
    //           This meeting has not been approved yet. Please approve the
    //           meeting to set it into the guardian's calendar.
    //         </Text>
    //         <br />
    //         <br />
    //       </>
    //     )}

    //     <Button
    //       onClick={() => handleApproveMeeting(true)}
    //       type="primary"
    //       block
    //     >
    //       {!getInitialValues().approved ? "Approve" : "Disapprove"}{" "}
    //       Meeting
    //     </Button>
    //   </div>
    // )}
  };

  return (
    <MeetingsWrapper>
      <NextSeo title="Meetings" />
      <PageHeader
        title="Meetings"
        createURL={"/meetings?create=true"}
        createTitle={
          user.role === "THERAPIST" ? "Create Meeting" : "Request Meeting"
        }
      />
      {meetings && meetings.loading && <LoadingBlock />}
      {meetings && !meetings.loading && (
        <Row gutter={[16, 16]}>
          <Col lg={24} xl={12}>
            <ContentCard>
              <MeetingsTable meetings={meetings} pastMeetings={pastMeetings} userID={user.id} />
            </ContentCard>
          </Col>
          <Col lg={24} xl={12}>
            <ContentCard>
              <MeetingCalendar meetings={meetings} userID={user.id} />
            </ContentCard>
          </Col>
          <Drawer
            placement="right"
            width={500}
            title={
              router.query.create
                ? user.role === "GUARDIAN"
                  ? "Request Meeting"
                  : "Create Meeting"
                : router.query.id && router.query.approve
                ? "Approve Meeting"
                : "Edit Meeting"
            }
            onClose={() => Router.push("/meetings", null, { shallow: true })}
            visible={router.query.create || router.query.id}
          >
            {router.query.create && <MeetingForm />}
            {router.query.id && !router.query.approve && (
              <EditMeetingForm
                initialValues={getInitialValues()}
                createMeeting={router.query.create}
              />
            )}
            {renderMeetingApprovalContent()}
          </Drawer>
        </Row>
      )}
    </MeetingsWrapper>
  );
}

export default withRouter(Meetings);
