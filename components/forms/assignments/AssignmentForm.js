// React Native
import React from "react";
import { Form, Field } from "react-final-form";
import { OnChange } from "react-final-form-listeners";

// Ant Design 
import { PlainTextField, SelectField, DateField } from "@fields";
import { Col, Row, Button, message, Spin, Select } from "antd";

// Recoil
import { userState, assignmentsState } from "@atoms";
import { useRecoilState } from "recoil";

// Mutations and Queries
import { useMutation } from "@apollo/client";
import { CREATE_ASSIGNMENT, GET_USER_MEETINGS } from "@graphql/operations";
import client from "@utils/apolloClient";

// Next.js
import Router from "next/router";

function AssignmentForm({}) {
  ///////////
  // STATE //
  ///////////

  const [user, setUser] = useRecoilState(userState);
  const [assignments, setAssignments] = useRecoilState(assignmentsState);

  ///////////////
  // Mutations //
  ///////////////

  // Create Assignment Mutation
  const [createAssignment, {}] = useMutation(CREATE_ASSIGNMENT);

  // Executes Create Assignment Mutation
  const handleCreateAssignment = async (formValues) => {
    await createAssignment({
      variables: {
        type: formValues.type,
        title: formValues.title,
        assignmentDateTime: formValues.assignmentDateTime,
        participantIDs: user.role === "GUARDIAN" ? getUserTherapist() : [formValues.guardian, formValues.child],
      },
    })
      .then(async (resolved) => {
        message.success("Successfully Created Assignment");
        Router.push("/assignments");

        // Get the full user object and set that to state
        await client
          .query({
            query: GET_USER_MEETINGS,
            fetchPolicy: "network-only",
          })
          .then(async (resolved) => {
            setAssignments(resolved.data.getAssignments);
          })
          .catch((error) => {
            message.error("Sorry, there was an error getting this information");
          });
      })
      .catch((error) => {
        message.error(error.message);
      });
  };

  ///////////////
  // FUNCTIONS //
  ///////////////

  // Finds All Possible Clients to make Assignment For
  const getPossibleClients = () => {
    return user.patientCarePlans.map((pcp) => {
      return {
        text: `${pcp.child.firstName} ${pcp.child.lastName}`,
        value: pcp.child.id
      };
    });
  };

  ////////////////
  // RENDERINGS //
  ////////////////

  const renderSelectClientsField = () => (
    <Field
      name="selectedClients"
      component={SelectField}
      htmlType="text"
      label="Select Clients"
      options={getPossibleClients()}
      size="large"
      required={true}
      mode="multiple"
    />
  );

  return (
    <Spin spinning={false}>
      <Form
        onSubmit={handleCreateAssignment}
        initialValues={{
          dateStart: new Date().toString().slice(0, 15),
        }}
        mutators={{
          setValue: ([field, value], state, { changeValue }) => {
            changeValue(state, field, () => value);
          },
        }}
        validate={(values) => {
          const errors = {};
          if (!values.title) {
            errors.title = "Required";
          }
          if (!values.type) {
            errors.type = "Required";
          }
          if (!values.assignmentDateTime) {
            errors.assignmentDateTime = "Required";
          }
          if (user.role !== "GUARDIAN") {
            if (!values.selectedClients || values.selectedClients.length === 0) {
              errors.selectedClients = "At least one client is required";
            }
          }
        
          return errors;
        }}
        render={({
          handleSubmit,
          pristine,
          invalid,
          submitting,
          form,
          values,
        }) => (
          <form
            onSubmit={(event) => {
              handleSubmit(event).then((event) => {});
            }}
          >
            <legend>Invite User Form</legend>
            <Row gutter={16}>
              <Col xs={24} md={24}>
                <h3>Step 1: Title Your Assignment</h3>
                <Field
                  label="Title"
                  name="title"
                  htmlType="text"
                  component={PlainTextField}
                  required={true}
                  size="large"
                  hideErrorText={false}
                />
              </Col>
              <Col xs={24} md={24}>
                <h3>Step 2: Select a Start Date & an End Date</h3>
                <Field
                  name="type"
                  component={SelectField}
                  htmlType="text"
                  label="Assignment Type"
                  options={[
                    {
                      value: "IN_PERSON",
                      text: "In Person",
                    },
                    {
                      value: "PHONE",
                      text: "Phone",
                    },
                  ]}
                  size="large"
                  required={true}
                />
              </Col>
              <Col xs={24} md={24}>
                <Field
                  label="Assignment Time"
                  name="assignmentDateTime"
                  htmlType="text"
                  component={DateField}
                  showTime={true}
                  required={true}
                  size="large"
                  hideErrorText={false}
                />
              </Col>
              <>
                <Col xs={24} md={24}>
                  <h3>Step 3: Add Participants</h3>
                  {renderSelectClientsField()}
                </Col>
              </>
              {values.guardian && (
                <Col xs={24} md={24}>
                  <Field
                    name="child"
                    component={SelectField}
                    htmlType="text"
                    label="Child"
                    options={getPossibleChildren(values.guardian)}
                    size="large"
                    required={false}
                  />
                </Col>
              )}
            </Row>

            <Button
              type="primary"
              loading={submitting}
              htmlType="submit"
              block={true}
              size="large"
              disabled={invalid || pristine}
            >
              {user.role === "GUARDIAN" ? "Request Assignment" : "Create Assignment"}
            </Button>
          </form>
        )}
      />
    </Spin>
  );
}

export default AssignmentForm;
