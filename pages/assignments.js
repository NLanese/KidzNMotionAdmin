import React, { useState, useEffect } from "react";
import styled from "styled-components";

import PageHeader from "@common/PageHeader";

// Ant Design
import { Row, Col, message, Button, Typography } from "antd";
import { Drawer } from "antd";
import ContentCard from "@common/content/ContentCard";
import Router from "next/router";

import { NextSeo } from "next-seo";

// Recoil
import { userState, assignmentsState, passedAssignmentsState } from "@atoms";
import { useRecoilValue, useRecoilState } from "recoil";

import LoadingBlock from "@common/LoadingBlock";
import { withRouter } from "next/router";

// Mutations and Queries
import { GET_USER_ASSIGNMENTS, CREATE_ASSIGNMENT } from "@graphql/operations";
import client from "@utils/apolloClient";

// Components
import AssignmentsTable from "../components/pages/assignments/AssignmentTable";
import AssignmentCalendar from "../components/pages/assignments/AssignmentCalendar";
import AssignmentForm from "@components/forms/assignments/AssignmentForm";
import EditAssignmentForm from "../components/forms/assignments/EditAssignmentForm";
import orderAssignmentsByStartDate from "../functions/orderAssignmentsByStartDate";

const { Text, Title } = Typography;

const AssignmentsWrapper = styled.div`
  max-width: ${(props) => props.theme.contentSize.standard};
  margin: auto;
  .ant-picker-calendar .ant-radio-group {
    display: none;
  }
`;

function Assignments({ router }) {

  ///////////
  // STATE //
  ///////////

  const user = useRecoilValue(userState);

  const [assignments, setAssignments] = useRecoilState(assignmentsState);
  const [passedAssignments, setPassedAssignments] = useRecoilState(passedAssignmentsState)

  ///////////////////////////
  // MUTATIONS and QUERIES //
  ///////////////////////////


  // Queries all Assignments
  const getUserAssignments = async () => {
    const token = localStorage.getItem("token");
  
    if (token) {
      try {
        const resolved = await client.query({
          query: GET_USER_ASSIGNMENTS,
          fetchPolicy: "network-only",
        });
  
        // NO ASSIGNMENTS RESPONSE
        if (resolved.data.getAssignments.length === 0) {
          setAssignments([]);
          setPassedAssignments([]);
          return;
        } 

        else {
          let rawAssignments = resolved.data.getAssignments
          let passed = [];
          let current = [];
          let assignments = rawAssignments.filter(assign => {
            if (assign.id){
              return assign
            }
          })
          assignments = assignments.length > 0 ? resolved.data.getAssignments : "No Assignments";
  
          if (assignments === "No Assignments") {
            return;
          }

  
          assignments.forEach((assign) => {
  
            if (assign.id) {
              if (true) {
                current.push(assign); // Use push instead of append
              } else {
                passed.push(assign);
              }
            }
          });
  
          current = orderAssignmentsByStartDate(current)
          setAssignments(current);
          // setPassedAssignments(passed);
          return;
        }
      } catch (error) {
        setAssignments(null);
        message.error(
          "Sorry, there was an error getting your assignments. Please try again!"
        );
      }
    } else {
      setAssignments(null);
    }
  };

  // Runs Query on Init
  useEffect(() => {
    getUserAssignments();
  }, []);


  ////////////////
  // RENDERINGS //
  ////////////////

  // Renders Button to Create an Assignment (if Therapist)
  const renderCreateAssignmentButton = () => {
    if (user.role === "THERAPIST"){
      return(
        <PageHeader
          title="Assignments"
          createURL={"/assignments?create=true"}
          createTitle={
            user.role === "THERAPIST" ? "Create Assignment" : "Request Assignment"
          }
        />
      )
    }
  }

  // Renders the Assignment Creation / Editing Form
  const renderForm = () => {
    return(
      <Drawer
        placement="right"
        width={500}
        title={router.query.create ? 
          "Create Assignment" : "Edit Assignment"
        }
        onClose={() => Router.push("/assignments", null, { shallow: true })}
        open={router.query.create || router.query.id}
      >
        {router.query.create && <AssignmentForm />}
        {router.query.id && !router.query.approve && (
          <EditAssignmentForm
            initialValues={getInitialValues()}
            createAssignment={router.query.create}
          />
        )}
      </Drawer>
    )
  }

  // Renders the Table Column
  const renderTableColumn = () => {
    return(
      <Col lg={24} xl={12}>
        <ContentCard>
          <AssignmentsTable assignments={assignments} setAssignments={setAssignments} passedAssignments={assignments} userID={user.id} userRole={user.role}/>
        </ContentCard>
      </Col>
    )
  }

  // Renders the Calendar Column
  const renderCalendarColumn = () => {
    return(
      <Col lg={24} xl={12}>
        <ContentCard>
          <AssignmentCalendar assignments={[...assignments, ...passedAssignments]} userID={user.id} />
        </ContentCard>
      </Col>
    )
  }


  /////////////////
  // MAIN RETURN //
  /////////////////

  return (
    <AssignmentsWrapper>
      <NextSeo title="Assignments" />
     {renderCreateAssignmentButton()}
      {assignments && assignments.loading && <LoadingBlock />}
      {assignments && !assignments.loading && (
        <Row gutter={[16, 16]}>
          {renderTableColumn()}
          {renderCalendarColumn()}
          {renderForm()}
        </Row>
      )}
    </AssignmentsWrapper>
  );
}

export default withRouter(Assignments);
