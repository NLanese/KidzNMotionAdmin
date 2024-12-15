import React, { useEffect, useState } from "react";
import Router from "next/router";
import BasicLink from "@common/BasicLink";
import PatientInformation from "./detail/PatientInformation";
import {
  Typography,
  Tabs,
  Button,
  Drawer,
  message,
  Popconfirm,
  Calendar,
} from "antd";

import moment from "moment";
import { GET_USER, GET_ALL_USER_MEDALS } from "@graphql/operations";
import client from "@utils/apolloClient";

import { userState, medals } from "@atoms";
import { useSetRecoilState } from "recoil";
import styled from "styled-components";
const { TabPane } = Tabs;

import EditChildCareDetailsForm from "@forms/patients/EditChildCareDetailsForm";
import CreateCarePlanAssignmentForm from "@forms/patients/CreateCarePlanAssignmentForm";
import CreateCarePlanComment from "@forms/patients/CreateCarePlanComment";
import CarePlanComments from "@pages/patients/CarePlanComments";
import CarePlanAssignments from "@pages/patients/CarePlanAssignments";

const CalenderWrapper = styled.div`
  .ant-popover-message-title {
    padding-left: 0px !important;
  }
`;

function PatientDetail({ patientDetailOpen, patientDetail, user, router }) {
  ///////////
  // State //
  ///////////

  // User
  const setUser = useSetRecoilState(userState);

  // User Medals
  const [medals, setMedals] = useState([]);

  // Loading
  const [loading, setLoading] = useState(true);

  // Current Date
  const [dateToUse, setDateToUse] = React.useState(new moment());

  // Constant Drawer Width
  const getDrawerWidth = () => {
    return 700;
  };

  useEffect(() => {
    if (patientDetail) {
      getChildsMedals();
    }
  }, [patientDetail, getChildsMedals]);

  /////////////
  // Queries //
  /////////////

  // Reset User Function
  const getUser = async () => {
    await client
      .query({
        query: GET_USER,
        fetchPolicy: "network-only",
      })
      .then((resolved) => {
        setUser(resolved.data.getUser);
      })
      .catch(() => {
        message.error("Sorry, there was an error getting this information");
      });
  };

  // Gets all Medals from Relevant Child
  async function getChildsMedals() {
    await client
      .query({
        query: GET_ALL_USER_MEDALS,
        fetchPolicy: "network-only",
        variables: {
          childCareID: patientDetail.carePlan.id,
        },
      })
      .then((resolved) => {
        setMedals(processMedalData(resolved.data.getAllUserMedals));
        setLoading(false);
      })
      .catch(() => {
        console.warn("Error getting the Medals");
        setLoading(false);
      });
  } 

  ///////////////
  // Functions //
  ///////////////

  const getDrawerOpen = () =>
    router.query.editPlan || router.query.createAssignment || router.query.createComment;

  const getDrawerTitle = () => {
    if (router.query.editPlan) return "Edit Care Plan Information";
    if (router.query.createAssignment) return "Create Assignment";
    if (router.query.createComment) return "Create Comment";
    return "-";
  };

  const getDrawerCloseLink = () =>
    Router.push(`/patients/manage?id=${patientDetail.id}`, null, { shallow: true });

  const getDrawerContent = () => {
    if (router.query.editPlan) {
      return (
        <EditChildCareDetailsForm
          getUser={getUser}
          initialValues={{
            childLevel: patientDetail.carePlan.level.toString(),
            childCarePlanID: patientDetail.carePlan.id,
            diagnosis: patientDetail.carePlan.child.diagnosis,
            blockedVideos: patientDetail.carePlan.blockedVideos?.ids || [],
          }}
          returnUrl={`/patients/manage?id=${patientDetail.id}`}
        />
      );
    }
    if (router.query.createAssignment) {
      return (
        <CreateCarePlanAssignmentForm
          getUser={getUser}
          initialValues={{
            childCarePlanID: patientDetail.carePlan.id,
            videoIDs: [],
          }}
          returnUrl={`/patients/manage?id=${patientDetail.id}`}
        />
      );
    }
    if (router.query.createComment) {
      return (
        <CreateCarePlanComment
          getUser={getUser}
          initialValues={{
            childCarePlanID: patientDetail.carePlan.id,
          }}
          returnUrl={`/patients/manage?id=${patientDetail.id}`}
        />
      );
    }
    return <div />;
  };

  const setPDFCalenderDate = (date) => {
    setDateToUse(date);
  };

  function processMedalData(getAllUserMedals) {
    let rObj = {};
    getAllUserMedals.forEach((medal) => {
      rObj = { ...rObj, [medal.title]: addToMedalKey(rObj[medal.title], medal) };
    });
    return rObj;
  }

  function addToMedalKey(obj, medal) {
    return { ...obj, [medal.level]: [medal] };
  }

  /////////////////
  // Main Return //
  /////////////////
  if (loading) return null;

  return (
    <>
      <Drawer
        title={
          patientDetail &&
          `${patientDetail.firstName} ${patientDetail.lastName}`
        }
        placement="right"
        width={1000}
        onClose={() => Router.push("/patients/manage", null, { shallow: true })}
        open={!!patientDetailOpen}
      >
        {patientDetail && (
          <>
            <BasicLink
              href={`/patients/manage?id=${patientDetail.id}&editPlan=true`}
              shallow={true}
            >
              <Button type="ghost" style={{ float: "right" }}>
                Edit Care Plan Information
              </Button>
            </BasicLink>

            <Popconfirm
              placement="bottom"
              okText="Generate PDF"
              cancelText="Cancel"
              onConfirm={() => {
                window.open(
                  `/patients/pdf?id=${patientDetail.id}&date=${dateToUse.format(
                    "MM/DD/YYYY"
                  )}`,
                  "_blank"
                );
              }}
              title={
                <>
                  <p style={{ width: "240px", textAlign: "center" }}>
                    To edit this document, download and edit the PDF.
                  </p>
                  <CalenderWrapper>
                    <Calendar
                      fullscreen={false}
                      onChange={(value) => setPDFCalenderDate(value)}
                    />
                  </CalenderWrapper>
                </>
              }
            >
              <Button type="ghost" style={{ float: "right", marginRight: "10px" }}>
                Generate PDF Document
              </Button>
            </Popconfirm>

            <PatientInformation patientDetail={patientDetail} user={user} />

            <Tabs defaultActiveKey="1">
              <TabPane tab="Assignments" key="1">
                <BasicLink
                  href={`/patients/manage?id=${patientDetail.id}&createAssignment=true`}
                  shallow={true}
                >
                  <Button type="primary" style={{ float: "right" }}>
                    Create New Assignment +
                  </Button>
                </BasicLink>
                <CarePlanAssignments
                  getUser={getUser}
                  patient={patientDetail}
                  comments={patientDetail.carePlan.comments}
                  assignments={patientDetail.carePlan.assignments}
                  medals={medals}
                />
              </TabPane>
              <TabPane tab="Care Plan Comments" key="2">
                <BasicLink
                  href={`/patients/manage?id=${patientDetail.id}&createComment=true`}
                  shallow={true}
                >
                  <Button type="primary" style={{ float: "right" }}>
                    Add New Comment +
                  </Button>
                </BasicLink>
                <CarePlanComments
                  getUser={getUser}
                  comments={patientDetail.carePlan.comments}
                />
              </TabPane>
            </Tabs>

            <Drawer
              title={getDrawerTitle()}
              width={getDrawerWidth()}
              onClose={getDrawerCloseLink}
              open={getDrawerOpen()}
            >
              {getDrawerContent()}
            </Drawer>
          </>
        )}
      </Drawer>
    </>
  );
}

export default PatientDetail;