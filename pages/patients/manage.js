import React, { useEffect, useState } from "react";
import styled from "styled-components";

import { NextSeo } from "next-seo";
import PageHeader from "@common/PageHeader";
import ContentCard from "@common/content/ContentCard";
import PatientTable from "@pages/patients/PatientTable";
import PatientDetail from "@pages/patients/PatientDetail";
import InviteUserDrawer from "@pages/users/InviteUserDrawer";

import { withRouter } from "next/router";

import { userState } from "@atoms";
import { useRecoilState } from "recoil";
import Router from "next/router";

const IndexWrapper = styled.div`
  max-width: ${(props) => props.theme.contentSize.standard};
  margin: auto;
  .ant-typography strong {
    font-size: 16.5px;
  }
  @media (max-width: ${(props) => props.theme.breakPoints.sm}) {
    .ant-divider {
      margin: 2px 0px;
    }
  }
`;

function ManagePatients({ router }) {
  const [user, setUser] = useRecoilState(userState);
  const [patientDetail, setPatientDetail] = useState(null);

  useEffect(() => {
    if (user.role !== "THERAPIST") {
      Router.push("/");
    }
  }, []);

  const renderPatientData = (renderIDKey) => {
    // Get list of all children with child care plans
    let patientCarePlans = {};
    user.patientCarePlans.map((patientCarePlan) => {
      patientCarePlans[patientCarePlan.child.id] = patientCarePlan;
    });

    let users = [];
    user.organizations[0].organization.organizationUsers.map(
      (orgUserObject) => {

        let user = Object.assign({}, orgUserObject.user);
        if (patientCarePlans[user.id]) {
          user.carePlan = patientCarePlans[user.id];
        }
        if (user.role === "CHILD" && user.carePlan) {
          users.push(user);
        }
      }
    );

    if (renderIDKey) {
      let keyDict = {};
      users.map((userObject) => {
        keyDict[userObject.id] = userObject;
      });
      return keyDict;
    }

    return users;
  };

  useEffect(() => {
    if (router.query.id) {
      if (renderPatientData(true)[router.query.id]) {
        console.log("[Manage.js] - Patient Found ")
        console.log(renderPatientData(true)[router.query.id])
        setPatientDetail(renderPatientData(true)[router.query.id]);
      } else {
        console.log("[Manage.js] - No Patient Found ")
        setPatientDetail(null);
      }
    } else {
      console.log("[Manage.js] - No Patient Found 2")
      setPatientDetail(null);
    }
  }, [router, user]);

  return (
    <IndexWrapper>
      <NextSeo title={"Manage Patients"} />
      <PageHeader
        title={"Manage Patients"}
        createURL={"/patients/manage?invite=true"}
        createTitle={"Invite Patients"}
      />
      <ContentCard modifiers={["tightPadding"]}>
        <PatientTable patientData={renderPatientData()} user={user} />
        <PatientDetail
          patientDetailOpen={patientDetail}
          patientDetail={patientDetail}
          user={user}
          router={router}
        />
        <InviteUserDrawer
          therapistMode={true}
          inviteUserDrawerOpen={router.query.invite}
          organizationUsers={
            user.ownedOrganization
              ? user.ownedOrganization.organizationUsers
              : [{ user: user }]
          }
        />
      </ContentCard>
    </IndexWrapper>
  );
}

export default withRouter(ManagePatients);
