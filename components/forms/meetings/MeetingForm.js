import React from "react";
import { Form, Field } from "react-final-form";
// import { OnChange } from "react-final-form-listeners";
import { PlainTextField, SelectField, DateField } from "@fields";
import { Col, Row, Button, message, Spin } from "antd";

import { userState, meetingsState } from "@atoms";
import { useRecoilState } from "recoil";

import { useMutation } from "@apollo/client";
import { CREATE_MEETING, GET_USER_MEETINGS } from "@graphql/operations";
import client from "@utils/apolloClient";

import Router from "next/router";

function MeetingForm({}) {
  const [user, setUser] = useRecoilState(userState);
  const [meetings, setMeetings] = useRecoilState(meetingsState);

  // Mutations
  const [createMeeting, {}] = useMutation(CREATE_MEETING);

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

  const handleCreateMeeting = async (formValues) => {
    await createMeeting({
      variables: {
        type: formValues.type,
        title: formValues.title,
        meetingDateTime: formValues.meetingDateTime,
        participantIDs: user.role === "GUARDIAN" ? getUserTherapist() : [formValues.guardian, formValues.child],
      },
    })
      .then(async (resolved) => {
        message.success("Successfully Created Meeting");
        Router.push("/meetings");

        // Get the full user object and set that to state
        await client
          .query({
            query: GET_USER_MEETINGS,
            fetchPolicy: "network-only",
          })
          .then(async (resolved) => {
            setMeetings(resolved.data.getMeetings);
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
        onSubmit={handleCreateMeeting}
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
          if (!values.meetingDateTime) {
            errors.meetingDateTime = "Required";
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
                <h3>Step 1: Title Your Meeting</h3>
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
                  label="Meeting Type"
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
                  label="Meeting Time"
                  name="meetingDateTime"
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

                      // TO FIX
                      onChange={(event) => {
                        const value = event.target.value;
                        // Do something with the value
                        form.mutators.setValue("child", value); // Reset child value
                      }}
                    />
                    {/* <OnChange name="guardian">
                      {(value, previous) => {
                        // do something
                        form.mutators.setValue("child", null);
                      }}
                    </OnChange> */}
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
              {user.role === "GUARDIAN" ? "Request Meeting" : "Create Meeting"}
            </Button>
          </form>
        )}
      />
    </Spin>
  );
}

export default MeetingForm;
