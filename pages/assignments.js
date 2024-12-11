import React, { useState, useEffect } from "react";
import styled from "styled-components";

import PageHeader from "@common/PageHeader";
import { Row, Col, message, Typography } from "antd";
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
import { GET_USER_ASSIGNMENTS } from "@graphql/operations";
import client from "@utils/apolloClient";

// Components
import AssignmentsTable from "../components/pages/assignments/AssignmentTable";
import AssignmentCalendar from "../components/pages/assignments/AssignmentCalendar";
import AssignmentForm from "@components/forms/assignments/AssignmentForm";
import EditAssignmentForm from "../components/forms/assignments/EditAssignmentForm";
import orderAssignmentsByStartDate from "../functions/orderAssignmentsByStartDate";

const { Title } = Typography;

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
  const [passedAssignments, setPassedAssignments] = useRecoilState(passedAssignmentsState);
  const [loading, setLoading] = useState(false);

  ///////////////////////
  // EFFECT & FETCHING //
  ///////////////////////

  useEffect(() => {
    const fetchUserAssignments = async () => {
      const token = localStorage.getItem("token");

      if (token) {
        setLoading(true);
        try {
          const resolved = await client.query({
            query: GET_USER_ASSIGNMENTS,
            fetchPolicy: "network-only",
          });

          if (resolved.data.getAssignments.length === 0) {
            setAssignments([]);
            setPassedAssignments([]);
          } else {
            let rawAssignments = resolved.data.getAssignments;
            let passed = [];
            let current = [];

            rawAssignments.forEach((assign) => {
              if (assign.id) {
                if (new Date(assign.dateDue) > new Date()) {
                  current.push(assign);
                } else {
                  passed.push(assign);
                }
              }
            });

            current = orderAssignmentsByStartDate(current);
            setAssignments(current);
            setPassedAssignments(passed);
          }
        } catch (error) {
          setAssignments(null);
          message.error(
            "Sorry, there was an error getting your assignments. Please try again!"
          );
        } finally {
          setLoading(false);
        }
      } else {
        setAssignments(null);
      }
    };

    fetchUserAssignments();
  }, [setAssignments, setPassedAssignments]);

  ////////////////
  // RENDERINGS //
  ////////////////

  const renderCreateAssignmentButton = () => {
    if (user.role === "THERAPIST") {
      return (
        <PageHeader
          title="Assignments"
          createURL={"/assignments?create=true"}
          createTitle={
            user.role === "THERAPIST" ? "Create Assignment" : "Request Assignment"
          }
        />
      );
    }
  };

  const renderForm = () => {
    return (
      <Drawer
        placement="right"
        width={500}
        title={router.query.create ? "Create Assignment" : "Edit Assignment"}
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
    );
  };

  const renderTableColumn = () => {
    return (
      <Col lg={24} xl={12}>
        <ContentCard>
          <AssignmentsTable
            assignments={assignments}
            setAssignments={setAssignments}
            passedAssignments={assignments}
            userID={user.id}
            userRole={user.role}
          />
        </ContentCard>
      </Col>
    );
  };

  const renderCalendarColumn = () => {
    return (
      <Col lg={24} xl={12}>
        <ContentCard>
          <AssignmentCalendar assignments={[...assignments, ...passedAssignments]} userID={user.id} />
        </ContentCard>
      </Col>
    );
  };

  /////////////////
  // MAIN RETURN //
  /////////////////

  if (loading) {
    return (
      <AssignmentsWrapper>
        <NextSeo title="Assignments" />
        {renderCreateAssignmentButton()}
      </AssignmentsWrapper>
    );
  }

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
