import React from "react";
import { Form, Field } from "react-final-form";
import { OnChange } from "react-final-form-listeners";
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

  const handleCreateMeeting = async (formValues) => {
    console.clear();
    console.log(formValues);
    await createMeeting({
      variables: {
        type: formValues.type,
        title: formValues.title,
        meetingDateTime: formValues.meetingDateTime,
        participantIDs: [formValues.guardian, formValues.child],
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
        onSubmit={handleCreateMeeting}
        initialValues={{}}
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
              <Col xs={24} md={24}>
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
            </Row>

            <Button
              type="primary"
              loading={submitting}
              htmlType="submit"
              block={true}
              size={"large"}
              disabled={invalid || pristine}
            >
              Create Meeting
            </Button>
          </form>
        )}
      />
    </Spin>
  );
}

export default MeetingForm;
