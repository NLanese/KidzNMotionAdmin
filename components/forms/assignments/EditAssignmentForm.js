// React
import React from "react";
import { Form, Field } from "react-final-form";
import { OnChange } from "react-final-form-listeners";
import { PlainTextField, SelectField, DateField, SwitchField } from "@fields";

// Ant Design
import { Col, Row, Button, message, Spin } from "antd";

// Recoil
import { userState, assignmentsState } from "@atoms";
import { useRecoilState } from "recoil";

import { useMutation } from "@apollo/client";
import { EDIT_ASSIGNMENT, GET_USER_ASSIGNMENTS } from "@graphql/operations";
import client from "@utils/apolloClient";

import Router from "next/router";

function EditAssignmentForm({ initialValues, createAssignment }) {
  const [user, setUser] = useRecoilState(userState);
  const [assignments, setAssignments] = useRecoilState(assignmentsState);

  // Mutations
  const [editAssignment, {}] = useMutation(EDIT_ASSIGNMENT);

  const handleEditeAssignment = async (formValues) => {
    let cancelled = formValues.cancelled;
    if (cancelled === "true") {
      cancelled = true;
    }
    if (cancelled === "false") {
      cancelled = false;
    }

    if (!cancelled) {
      cancelled = false;
    }
    let completed = formValues.completed;
    if (completed === "true") {
      completed = true;
    }
    if (completed === "false") {
      completed = false;
    }

    await editAssignment({
      variables: {
        type: formValues.type,
        assignmentID: initialValues.assignmentID,
        title: formValues.title,
        assignmentDateTime: formValues.assignmentDateTime,
        cancelled: cancelled,
        completed: completed,
        participantIDs: [formValues.guardian, formValues.child],
      },
    })
      .then(async (resolved) => {
        message.success("Successfully Edited Assignment");
        Router.push("/assignments");

        // Get the full user object and set that to state
        await client
          .query({
            query: GET_USER_ASSIGNMENTS,
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
        onSubmit={handleEditeAssignment}
        initialValues={initialValues}
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
          if (!values.guardian) {
            errors.guardian = "Required";
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
                <h3>Assignment Information</h3>
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
                    <h3>Assignment Participants</h3>
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
                </>
              )}

              <Col xs={24} md={24}>
                <Field
                  name="cancelled"
                  component={SwitchField}
                  htmlType="text"
                  label="Cancel Assignment"
                  size={"large"}
                  required={true}
                />
              </Col>
              <Col xs={24} md={24}>
                <h3>Assignment Options</h3>
                <Field
                  name="completed"
                  component={SwitchField}
                  htmlType="text"
                  label="Assignment Completed"
                  size={"large"}
                  required={true}
                />
              </Col>
            </Row>

            <Button
              type="primary"
              loading={submitting}
              htmlType="submit"
              block={true}
              size={"large"}
              disabled={invalid || pristine}
            >
              Edit Assignment
            </Button>
          </form>
        )}
      />
    </Spin>
  );
}

export default EditAssignmentForm;
