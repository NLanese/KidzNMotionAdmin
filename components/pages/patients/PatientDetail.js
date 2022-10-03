import React from "react";
import Router from "next/router";
import BasicLink from "@common/BasicLink";
import PatientInformation from "./detail/PatientInformation";
import { Typography, Tabs, Button, Drawer, message } from "antd";

import { GET_USER } from "@graphql/operations";
import client from "@utils/apolloClient";

import { userState } from "@atoms";
import { useSetRecoilState } from "recoil";

const { TabPane } = Tabs;

import EditChildCareDetailsForm from "@forms/patients/EditChildCareDetailsForm";
import CreateCarePlanAssignmentForm from "@forms/patients/CreateCarePlanAssignmentForm";
import CreateCarePlanComment from "@forms/patients/CreateCarePlanComment";
import CarePlanComments from "@pages/patients/CarePlanComments";
import CarePlanAssignments from "@pages/patients/CarePlanAssignments";


function PatientDetail({ patientDetailOpen, patientDetail, user, router }) {
  const setUser = useSetRecoilState(userState);

  // Reset User Function
  const getUser = async () => {
    await client
      .query({
        query: GET_USER,
        fetchPolicy: "network-only",
      })
      .then(async (resolved) => {
        console.clear();
        // console.log(resolved);
        setUser(resolved.data.getUser);
      })
      .catch((error) => {
        message.error("Sorry, there was an error getting this information");
      });
  };

  // Drawer Information
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

  const getDrawerWidth = () => {
    return 700;
  };

  const getDrawerCloseLink = () => {
    Router.push(`/patients/manage?id=${patientDetail.id}`, null, {
      shallow: true,
    });
  };

  const getDrawerContent = () => {
    if (router.query.editPlan) {
      return (
        <EditChildCareDetailsForm
          getUser={getUser}
          initialValues={{
            childLevel: patientDetail.carePlan.level.toString(),
            childCarePlanID: patientDetail.carePlan.id,
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
        visible={patientDetailOpen}
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
            <PatientInformation patientDetail={patientDetail} user={user} />

            <Tabs defaultActiveKey="1">
              <TabPane tab="Assignments" key="1">
                <div
                  style={{
                    display: "flex",
                    justifyContent: "flex-end",
                    alignItems: "flex-end",
                  }}
                >
                  <BasicLink
                    href={`/patients/manage?id=${patientDetail.id}&createAssignment=true`}
                    shallow={true}
                  >
                    <Button type="primary" style={{ float: "right" }}>
                      Create New Assignment +
                    </Button>
                  </BasicLink>
                
                </div>
                <CarePlanAssignments
                    getUser={getUser}
                    comments={patientDetail.carePlan.comments}
                    initialValues={{
                      childCarePlanID: patientDetail.carePlan.id,
                    }}
                    returnUrl={`/patients/manage?id=${patientDetail.id}`}
                    assignments={patientDetail.carePlan.assignments}
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
                  initialValues={{
                    childCarePlanID: patientDetail.carePlan.id,
                  }}
                  returnUrl={`/patients/manage?id=${patientDetail.id}`}
                  comments={patientDetail.carePlan.comments}
                />
              </TabPane>
            </Tabs>

            <Drawer
              title={getDrawerTitle()}
              width={getDrawerWidth()}
              onClose={() => getDrawerCloseLink()}
              visible={getDrawerOpen()}
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
