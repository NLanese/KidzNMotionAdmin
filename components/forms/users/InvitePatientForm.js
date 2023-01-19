import React from "react";
import { Form, Field } from "react-final-form";
import { PlainTextField, SelectField, DateField, TextAreaField } from "@fields";
import { Col, Row, Button, message, Spin } from "antd";

import { userState } from "@atoms";
import { useRecoilState } from "recoil";

import { useMutation } from "@apollo/client";
import { INVITE_USER, GET_USER, INVITE_PATIENT } from "@graphql/operations";
import client from "@utils/apolloClient";

import Router from "next/router";

function InvitePatientForm({ organizationUsers, therapistMode }) {
  const [user, setUser] = useRecoilState(userState);

  // Mutations
  const [inviteUser, {}] = useMutation(INVITE_USER);
  const [invitePatient, {}] = useMutation(INVITE_PATIENT);

  const handleInvite = async (formValues) => {
    if (formValues.role === "GUARDIAN") {
      await invitePatient({
        variables: {
          email: formValues.email,
          guardianFirstName: formValues.guardianFirstName,
          guardianLastName: formValues.guardianLastName,
          childFirstName: formValues.childFirstName,
          childLastName: formValues.childLastName,
          childDateOfBirth: formValues.childDateOfBirth,
          childLevel: formValues.childLevel,
          childTherapistID: formValues.childTherapistID,
          diagnosis: "",
        },
      })
        .then(async (resolved) => {
          // console.clear();
          // console.log(resolved);
          message.success("Successfully Created User");
          Router.push("/patients/manage?id=" + resolved.data.invitePatient);

          // Get the full user object and set that to state
          await client
            .query({
              query: GET_USER,
              fetchPolicy: "network-only",
            })
            .then(async (resolved) => {
              setUser(resolved.data.getUser);
            })
            .catch((error) => {
              message.error(
                "Sorry, there was an error getting this information"
              );
            });
        })
        .catch((error) => {
          message.error(error.message);
        });
    } else {
      await inviteUser({
        variables: {
          role: formValues.role,
          email: formValues.email,
          additionalInformation:
            formValues.role === "GUARDIAN"
              ? {
                  childLevel: formValues.childLevel,
                  childTherapistID: formValues.childTherapistID,
                }
              : {},
        },
      })
        .then(async (resolved) => {
          message.success("Successfully Invited User");
          if (therapistMode) {
            Router.push("/patients/manage");
          } else {
            Router.push("/users/manage");
          }

          // Get the full user object and set that to state
          await client
            .query({
              query: GET_USER,
              fetchPolicy: "network-only",
            })
            .then(async (resolved) => {
              setUser(resolved.data.getUser);
            })
            .catch((error) => {
              message.error(
                "Sorry, there was an error getting this information"
              );
            });
        })
        .catch((error) => {
          message.error(error.message);
        });
    }
  };

  const renderTherapistOptions = () => {
    let therapists = [];
    organizationUsers.map((orgUser) => {
      if (orgUser.user && orgUser.user.role === "THERAPIST") {
        therapists.push({
          value: orgUser.user.id,
          text: `${orgUser.user.id === user.id ? "(Me)" : ""} ${
            orgUser.user.firstName
          } ${orgUser.user.lastName}`,
        });
      }

      return orgUser;
    });
    // console.log(therapists);
    return therapists;
  };

  return (
    <Spin spinning={false}>
      <Form
        onSubmit={handleInvite}
        initialValues={{}}
        mutators={{
          setValue: ([field, value], state, { changeValue }) => {
            changeValue(state, field, () => value);
          },
        }}
        validate={(values) => {
          const errors = {};
          if (!values.email) {
            errors.email = "Required";
          }

          if (!values.role) {
            errors.role = "Required";
          }

          if (values.role === "GUARDIAN") {
            if (!values.guardianFirstName) {
              errors.guardianFirstName = "Required";
            }
            if (!values.guardianLastName) {
              errors.guardianLastName = "Required";
            }
            if (!values.childFirstName) {
              errors.childFirstName = "Required";
            }
            // if (!values.diagnosis) {
            //   errors.diagnosis = "Required";
            // }
            if (!values.childLastName) {
              errors.childLastName = "Required";
            }
            if (!values.childDateOfBirth) {
              errors.childDateOfBirth = "Required";
            }
            if (!values.childLevel) {
              errors.childLevel = "Required";
            }
            if (!values.childTherapistID) {
              errors.childTherapistID = "Required";
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
              handleSubmit(event).then((event) => {
                form.mutators.setValue("email", "");
              });
            }}
          >
            <legend>Invite User Form</legend>
            <Row gutter={16}>
              <Col xs={24} md={24}>
                <h3>User Information</h3>
                <Field
                  label="Email"
                  name="email"
                  htmlType="email"
                  component={PlainTextField}
                  required={true}
                  size={"large"}
                  hideErrorText={false}
                />
              </Col>

              <Col xs={24} md={24}>
                <Field
                  name="role"
                  component={SelectField}
                  htmlType="text"
                  label="User Role"
                  options={
                    user.ownedOrganization
                      ? [
                          {
                            value: "GUARDIAN",
                            text: "Guardian",
                          },
                          {
                            value: "THERAPIST",
                            text: "Therapist",
                          },
                        ]
                      : [
                          {
                            value: "GUARDIAN",
                            text: "Guardian",
                          },
                        ]
                  }
                  size={"large"}
                  required={true}
                />
              </Col>
              {values.role === "GUARDIAN" && (
                <>
                  <Col xs={24} md={24}>
                    <h3>Guardian Information</h3>
                  </Col>
                  <Col xs={24} md={12}>
                    <Field
                      label="Guardian First Name"
                      name="guardianFirstName"
                      htmlType="text"
                      component={PlainTextField}
                      required={true}
                      size={"large"}
                      hideErrorText={false}
                    />
                  </Col>
                  <Col xs={24} md={12}>
                    <Field
                      label="Guardian Last Name"
                      name="guardianLastName"
                      htmlType="text"
                      component={PlainTextField}
                      required={true}
                      size={"large"}
                      hideErrorText={false}
                    />
                  </Col>
                </>
              )}

              {values.role === "GUARDIAN" && (
                <>
                  <Col xs={24} md={24}>
                    <h3>Child Information</h3>
                  </Col>
                  <Col xs={24} md={12}>
                    <Field
                      label="Child First Name"
                      name="childFirstName"
                      htmlType="text"
                      component={PlainTextField}
                      required={true}
                      size={"large"}
                      hideErrorText={false}
                    />
                  </Col>
                  <Col xs={24} md={12}>
                    <Field
                      label="Child Last Name"
                      name="childLastName"
                      htmlType="text"
                      component={PlainTextField}
                      required={true}
                      size={"large"}
                      hideErrorText={false}
                    />
                  </Col>
                  {/* <Col xs={24} md={24}>
                    <Field
                      label="Diagnosis"
                      name="diagnosis"
                      htmlType="text"
                      component={TextAreaField}
                      required={true}
                      size={"large"}
                      hideErrorText={false}
                    />
                  </Col> */}
                  <Col xs={24} md={24}>
                    <Field
                      label="Child Date Of Birth"
                      name="childDateOfBirth"
                      htmlType="text"
                      component={DateField}
                      allowBack={true}
                      required={true}
                      size={"large"}
                      hideErrorText={false}
                    />
                  </Col>
                  <Col xs={24} md={24}>
                    <Field
                      name="childLevel"
                      component={SelectField}
                      htmlType="text"
                      label="Child Initial Level"
                      options={[
                        {
                          value: "1",
                          text: "1",
                        },
                        {
                          value: "2",
                          text: "2",
                        },
                        // {
                        //   value: "3",
                        //   text: "3",
                        // },
                      ]}
                      size={"large"}
                      required={true}
                    />
                  </Col>
                  <Col xs={24} md={24}>
                    <Field
                      name="childTherapistID"
                      component={SelectField}
                      htmlType="text"
                      label="Child Therapist"
                      options={renderTherapistOptions()}
                      size={"large"}
                      required={true}
                    />
                  </Col>
                </>
              )}
            </Row>
            <br />
            <Button
              type="primary"
              loading={submitting}
              htmlType="submit"
              block={true}
              size={"large"}
              disabled={invalid || pristine}
            >
              Invite Patient
            </Button>
          </form>
        )}
      />
    </Spin>
  );
}

export default InvitePatientForm;
