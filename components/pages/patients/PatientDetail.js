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
      if (patientDetail){
        console.log(patientDetail)
        getChildsMedals()
      }
    }, [patientDetail])

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
    async function getChildsMedals(){
      // QUERY
      await client.query({
          query: GET_ALL_USER_MEDALS,
          fetchPolicy: 'network-only',
          variables: {
              childCareID: patientDetail.carePlan.id
          }
      }).then( (resolved) => {
        console.log(resolved)
        setMedals(processMedalData(resolved.data.getAllUserMedals))
        setLoading(false)
        return
      }).catch(err => {
        console.warn("Error getting the Medals")
        setLoading(false)
      })
  }

  ///////////////
  // Functions //
  ///////////////

    // Determines which Drawer is Open
    const getDrawerOpen = () => {
      if (router.query.editPlan) {
        return true;
      }
      if (router.query.createAssignment) {
        return true;
      }
      if (router.query.createComment) {
        return true;
      }
      return false;
    };

    // Gets title of Active Displayed Drawer
    const getDrawerTitle = () => {
      if (router.query.editPlan) {
        return "Edit Care Plan Information";
      }
      if (router.query.createAssignment) {
        return "Create Assignment";
      }
      if (router.query.createComment) {
        return "Create Comment";
      }

      return "-";
    };

    // Handles the Closing of Side Drawer
    const getDrawerCloseLink = () => {
      Router.push(`/patients/manage?id=${patientDetail.id}`, null, {
        shallow: true,
      });
    };

    // Fetches the content for the displayed drawer when active
    const getDrawerContent = () => {
      if (router.query.editPlan) {
        return (
          <EditChildCareDetailsForm
            getUser={getUser}
            initialValues={{
              childLevel: patientDetail.carePlan.level.toString(),
              childCarePlanID: patientDetail.carePlan.id,
              diagnosis: patientDetail.carePlan.child.diagnosis,

              blockedVideos: patientDetail.carePlan.blockedVideos
                ? patientDetail.carePlan.blockedVideos.ids
                : [],
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

    // Sets Calendar Date
    const setPDFCalenderDate = (date) => {
      setDateToUse(date);
    };

    // Processes Medal Query Data
    function processMedalData(getAllUserMedals){
      let rObj = {}
      getAllUserMedals.forEach(medal => {
          rObj = ({...rObj, [medal.title]: addToMedalKey(rObj[medal.title], medal)})
      })
      return rObj
    }

    // Handles Object Data Additionl
    function addToMedalKey(obj, medal){
      return {...obj, [medal.level]: [medal]}
    }
  
  ///////////////
  // Rendering //
  ///////////////

    function renderCalendar(){
      return(
        <CalenderWrapper style={{ maxWidth: "290px" }}>
          <Calendar
            fullscreen={false}
            onChange={(value) => setPDFCalenderDate(value)}
          />
        </CalenderWrapper>
      )
    }

    // Renders Create Assignmnet Button for Menu, as well as Previous Assignments
    function renderCreateNewAssignment(){
      return(
        <TabPane tab="Assignments" key="1">
          <div style={{ display: "flex", justifyContent: "flex-end", alignItems: "flex-end"}}>
            <BasicLink href={`/patients/manage?id=${patientDetail.id}&createAssignment=true`} shallow={true}>
              <Button type="primary" style={{ float: "right" }}>
                Create New Assignment +
              </Button>
            </BasicLink>
          </div>

          <CarePlanAssignments
            getUser={getUser}
            patient={patientDetail}
            comments={patientDetail.carePlan.comments}
            initialValues={{
              childCarePlanID: patientDetail.carePlan.id,
            }}
            returnUrl={`/patients/manage?id=${patientDetail.id}`}
            assignments={patientDetail.carePlan.assignments}
            medals={medals}
          />
      </TabPane>
      )
    }

    // Renders Create Comment Button for Menu, as well as Previous Comments
    function renderCreateNewComment(){
      return(
        <TabPane tab="Care Plan Comments" key="2">
          <div style={{ display: "flex", justifyContent: "flex-end", alignItems: "flex-end"}}>
            <BasicLink href={`/patients/manage?id=${patientDetail.id}&createComment=true`} shallow={true}>
              <Button type="primary" style={{ float: "right" }}>
                Add New Comment +
              </Button>
            </BasicLink>
          </div>
        <CarePlanComments
          getUser={getUser}
          patientDetail={patientDetail}
          initialValues={{childCarePlanID: patientDetail.carePlan.id,}}
          returnUrl={`/patients/manage?id=${patientDetail.id}`}
          comments={patientDetail.carePlan.comments}
        />
      </TabPane>
      )
    }

  /////////////////
  // Main Return //
  /////////////////
  if (loading) return null;

  return (
    <>
      <Drawer
        title={patientDetail ? `${patientDetail.firstName} ${patientDetail.lastName}` : "No Patient Data"}
        placement="right"
        width={1000}
        onClose={() => Router.push("/patients/manage", null, { shallow: true })}
        open={!!patientDetailOpen}
      >
        {patientDetail && (
          <>

            {/* Edit Care Plan Button */}
            <BasicLink href={`/patients/manage?id=${patientDetail.id}&editPlan=true`} shallow={true}>
              <Button type="ghost" style={{ float: "right" }}>
                Edit Care Plan Information
              </Button>
            </BasicLink>

            <Popconfirm
              placement="bottom"
              okText="Generate PDF"
              cancelText="Cancel"
              onConfirm={() => {
                // window.open(
                //   `/patients/pdf?id=${patientDetail.id}&date=${dateToUse.format(
                //     "MM/DD/YYYY"
                //   )}`,
                //   "_blank"
                // );
                Router.push("/patients/comments")
              }}
              title={
                <>
                  <p style={{ width: "240px", textAlign: "center", margin: "auto"}}>
                    To edit this document, please download the PDF and edit it on your computer.
                  </p>
                  {renderCalendar()}
                </>
              }
            >
              <Button type="ghost" style={{ float: "right", marginRight: "10px" }}>
                Generate PDF Document
              </Button>
            </Popconfirm>

            <PatientInformation patientDetail={patientDetail} user={user} />

            <Tabs defaultActiveKey="1">
              {renderCreateNewAssignment()}
              {renderCreateNewComment()}
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