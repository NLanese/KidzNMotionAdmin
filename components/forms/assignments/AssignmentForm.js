import React from "react";
import { Form, Field } from "react-final-form";
import { OnChange } from "react-final-form-listeners";
import { PlainTextField, SelectField, DateField } from "@fields";
import { Col, Row, Button, message, Spin } from "antd";

import { userState, assignmentsState } from "@atoms";
import { useRecoilState } from "recoil";

import { useMutation } from "@apollo/client";
import { CREATE_MEETING, GET_USER_MEETINGS } from "@graphql/operations";
import client from "@utils/apolloClient";

import Router from "next/router";

function AssignmentForm({}) {
  const [user, setUser] = useRecoilState(userState);
  const [assignments, setAssignments] = useRecoilState(assignmentsState);

  // Mutations
  const [createAssignment, {}] = useMutation(CREATE_MEETING);

  const getUserTherapist = () => {

    let therapistID = null
    if (user.children) {
      if (user.children[0]) {
        if (user.children[0].childCarePlans) {
          if (user.children[0].childCarePlans[0]) {
            if (user.children[0].childCarePlans[0].therapist) {
              return [user.children[0].childCarePlans[0].therapist.id]
            } 
          } 
        }
      }
    }
  }

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

  const getPossibleGuardians = () => {
    let guardians = [];
    if (!user.patientCarePlans) {
      return [];
    }
    user.patientCarePlans.map((carePlanObject) => {
      guardians.push({
        value: carePlanObject.child.guardian.id,
        text: `${carePlanObject.child.guardian.firstName} ${carePlanObject.child.guardian.lastName}`,
      });
    });

    return guardians;
  };

  const getPossibleChildren = (selectedGuardian) => {
    let children = [];
    if (!user.patientCarePlans) {
      return [];
    }
    user.patientCarePlans.map((carePlanObject) => {
      if (carePlanObject.child.guardian.id === selectedGuardian) {
        children.push({
          value: carePlanObject.child.id,
          text: `${carePlanObject.child.firstName} ${carePlanObject.child.lastName}`,
        });
      }
    });

    return children;
  };

  return (
    <Spin spinning={false}>
      <Form
        onSubmit={handleCreateAssignment}
        initialValues={{ type: "IN_PERSON" }}
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
            if (!values.guardian) {
              errors.guardian = "Required";
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
                  size={"large"}
                  hideErrorText={false}
                />
              </Col>
              <Col xs={24} md={24}>
                <h3>Step 2: Select A Date & Time</h3>
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
                  size={"large"}
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
                  size={"large"}
                  hideErrorText={false}
                />
              </Col>
              {user.role !== "GUARDIAN" && (
                <>
                  <Col xs={24} md={24}>
                    <h3>Step 3: Add Participants</h3>
                    <Field
                      name="guardian"
                      component={SelectField}
                      htmlType="text"
                      label="Guardian"
                      options={getPossibleGuardians()}
                      size={"large"}
                      required={true}
                    />
                    <OnChange name="guardian">
                      {(value, previous) => {
                        // do something
                        form.mutators.setValue("child", null);
                      }}
                    </OnChange>
                  </Col>
                </>
              )}
              {values.guardian && (
                <Col xs={24} md={24}>
                  <Field
                    name="child"
                    component={SelectField}
                    htmlType="text"
                    label="Child"
                    options={getPossibleChildren(values.guardian)}
                    size={"large"}
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
              size={"large"}
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
