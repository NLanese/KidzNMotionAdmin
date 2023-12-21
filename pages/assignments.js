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
import { useMutation } from "@apollo/client";

// Components
import AssignmentsTable from "../components/pages/assignments/AssignmentTable";
import AssignmentCalendar from "../components/pages/assignments/AssignmentCalendar";
import AssignmentForm from "@components/forms/assignments/AssignmentForm";
import EditAssignmentForm from "../components/forms/assignments/EditAssignmentForm";
import moment from "moment";

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

  // Approves a Pending Assignment
  const [createAssignment, {}] = useMutation(CREATE_ASSIGNMENT);

  // Queries all Assignments
  const getUserAssignments = async () => {
    const token = localStorage.getItem("token");

    if (token) {
      await client
        .query({
          query: GET_USER_ASSIGNMENTS,
          fetchPolicy: "network-only",
        })
        .then(async (resolved) => {
          console.log(resolved);
          if (resolved.data.getAssignments.length === 0){
            setAssignments([])
            setPassedAssignments([])
            return
          }
          else{
            let passed = []
            let current = []
            resolved.data.getAssignments.forEach((assign) => {
              console.log(assign)
              if (assign.id){
                if (true){
                  current.append(assign)
                }
                else{
                  passed.append(assign)
                }
              }
            })
            setAssignments([])
            setPassedAssignments([])
          }
        })
        .catch((error) => {
          console.log("Error getting assignments")
          console.log(error)
          setAssignments(null);
          message.error("Sorry, there was an error getting your assignments. Please try again!");
        });
    } else {
      setAssignments(null);
    }
  };

  // Runs Query on Landing
  useEffect(() => {
    getUserAssignments();
  }, []);


  const getAssignmentValues = () => {
    let id = router.query.id;
    let intitalValues = {};

    let selectedAssignmentObject = null;

    assignments.map((assignmentObject) => {
      if (assignmentObject.id === id) {
        selectedAssignmentObject = assignmentObject;
      }
    });

    let guardian = null;
    let child = null;
    selectedAssignmentObject.users.map((userObject) => {
      if (userObject.role === "GUARDIAN") {
        guardian = userObject.id;
      }
      if (userObject.role === "CHILD") {
        child = userObject.id;
      }
    });

    if (selectedAssignmentObject) {
      intitalValues = {
        type: selectedAssignmentObject.type,
        assignmentID: selectedAssignmentObject.id,
        title: selectedAssignmentObject.title,
        assignmentDateTime: moment(selectedAssignmentObject.assignmentDateTime),
        guardian: guardian,
        approved: selectedAssignmentObject.approved,
        pendingApproval: selectedAssignmentObject.pendingApproval,
        child: child,
        completed: false,
      };
    }

    return intitalValues;
  };

  // Renders Button to Create an Assignment (if Thereapist)
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

  return (
    <AssignmentsWrapper>
      <NextSeo title="Assignments" />
     {renderCreateAssignmentButton()}
      {assignments && assignments.loading && <LoadingBlock />}
      {assignments && !assignments.loading && (
        <Row gutter={[16, 16]}>
          <Col lg={24} xl={12}>
            <ContentCard>
              <AssignmentsTable assignments={assignments} userID={user.id} userRole={user.role}/>
            </ContentCard>
          </Col>
          <Col lg={24} xl={12}>
            <ContentCard>
              <AssignmentCalendar assignments={assignments} userID={user.id} />
            </ContentCard>
          </Col>
          <Drawer
            placement="right"
            width={500}
            title={
              router.query.create
                ? user.role === "GUARDIAN"
                  ? "Request Assignment"
                  : "Create Assignment"
                : router.query.id && router.query.approve
                ? "Approve Assignment"
                : "Edit Assignment"
            }
            onClose={() => Router.push("/assignments", null, { shallow: true })}
            visible={router.query.create || router.query.id}
          >
            {router.query.create && <AssignmentForm />}
            {router.query.id && !router.query.approve && (
              <EditAssignmentForm
                initialValues={getInitialValues()}
                createAssignment={router.query.create}
              />
            )}
          </Drawer>
        </Row>
      )}
    </AssignmentsWrapper>
  );
}

export default withRouter(Assignments);
