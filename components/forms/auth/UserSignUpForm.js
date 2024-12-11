import React, { useState } from "react";
import { Form, Field } from "react-final-form";
import { PlainTextField, DateField } from "@fields";
import { Col, Row, Button, message, Divider, Spin, DatePicker } from "antd";
import { emailIsValid, normalizePhone, passwordIsValid } from "@helpers/forms";

import { useSetRecoilState } from "recoil";
import { userState } from "@atoms";

import PasswordValidation from "@forms/addons/PasswordValidation";

import { USER_SIGN_UP, GET_USER } from "@graphql/operations";

import { useMutation } from "@apollo/client";
import client from "@utils/apolloClient";

function UserSignUpForm({ role, organizationInviteKey, initialValues }) {
  const [redirectLogin, setRedirectLogin] = useState(false);
  const setUser = useSetRecoilState(userState);

  // Mutations
  const [signUpUser, {}] = useMutation(USER_SIGN_UP);

  const handleSignUpSuccess = async (userData) => {
    message.success("Successfully signed up");

    // Set the form spinner
    setRedirectLogin(true);

    localStorage.setItem("token", userData.token);

    // Push to site
    window.location = "/";
  };

  const handleSignUpFail = (error) => {
    error = `${error}`;
    if (error.includes("already")) {
      message.error("This email is already in use");
    } else if (error.includes("owner does")) {
      message.error("This owner does not exist");
    } else if (error.includes("Invalid Therapist Org")){
      message.error("A therapist needs to join an organization via an email or invite key, or create a new organization.")
    }
    else {
      message.error("Sorry, there was an error with your sign up");
    }
  };

  const handleSignUp = async (formValues) => {
    if (role === "THERAPIST"){
      if (!formValues.organizationInviteKey && !formValues.organizationName){
        handleSignUpFail("Invalid Therapist Org")
      }
    }
    try{
      await signUpUser({
        variables: {
          email: formValues.email,
          password: formValues.password,
          firstName: formValues.firstName,
          lastName: formValues.lastName,
          role: role,
          phoneNumber: formValues.phoneNumber,
          organizationInviteKey: formValues.organizationInviteKey,
          
          // GUARDIAN
          childFirstName: formValues.childFirstName,
          childLastName: formValues.childLastName,
          childDateOfBirth: formValues.childDateOfBirth,
          
          // ADMIN or THERAPIST
          title: formValues.title,
          organizationName: formValues.organizationName,
        },
      })
      .then(async (resolved) => {
          message.success("Successfully Signed Up");
            
          // Set the form spinner
          setRedirectLogin(true);
  
          // // Set token into local stoate
          localStorage.setItem("token", resolved.data.signUpUser.token);
  
          // Get the full user object and set that to state
          await client
            .query({
              query: GET_USER,
            })
            .then(async (resolved) => {
              setUser(resolved.data.getUser);
            })
            .catch((error) => {
              message.error("Sorry, there was an error getting this information");
            });
      })
      .catch((error) => {
        console.error(error)
        handleSignUpFail(error);
      });
    }
    catch(error){
      console.error(error)
    }
  };

  return (
    <Spin spinning={redirectLogin}>
      <Divider style={{ margin: "2px 0px 10px" }} />
      <Form
        onSubmit={handleSignUp}
        initialValues={initialValues}
        mutators={{
          setValue: ([field, value], state, { changeValue }) => {
            changeValue(state, field, () => value);
          },
        }}
        validate={(values) => {
          const errors = {};

          // REQUIRED ALL ROLES
          if (!values.firstName) {
            errors.firstName = "Required";
          }
          if (!values.lastName) {
            errors.lastName = "Required";
          }
          if (!values.phoneNumber) {
            errors.phoneNumber = "Required";
          }
          if (!values.email) {
            errors.email = "Required";
          } else {
            if (!emailIsValid(values.email)) {
              errors.email = "Email is not valid";
            }
          }
          if (!values.password) {
            errors.password = "Required";
          } else {
            if (!passwordIsValid(values.password).isValid) {
              errors.password = "Required";
            }
          }
          if (!values.confirmPassword) {
            errors.confirmPassword = "Required";
          }
          if (values.password && values.confirmPassword) {
            if (values.password !== values.confirmPassword) {
              errors.confirmPassword = "Your passwords do not match";
            }
          }

          // GUARDIAN REQUIRED FIELDS
          if (role === "GUARDIAN") {
            if (!values.childFirstName) {
              errors.childFirstName = "Required";
            }
            if (!values.childLastName) {
              errors.childLastName = "Required";
            }
            if (!values.childDateOfBirth) {
              errors.childDateOfBirth = "Required";
            }
          } 
      
          if (role === "THERAPIST") {
            if (!values.title) {
              errors.title = "Required";
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
                //  form.mutators.setValue("password", "");
                // form.mutators.setValue("confirmPassword", "");
              });
            }}
          >
            <legend>Sign Up Form</legend>
            <Row gutter={16}>
              <Col xs={24} md={12}>
                <Field
                  label="Your First Name"
                  name="firstName"
                  htmlType="text"
                  component={PlainTextField}
                  required={true}
                  size={"large"}
                  hideErrorText={false}
                />
              </Col>
              <Col xs={24} md={12}>
                <Field
                  label="Your Last Name"
                  name="lastName"
                  htmlType="text"
                  component={PlainTextField}
                  required={true}
                  size={"large"}
                  hideErrorText={false}
                />
              </Col>
              {role === "THERAPIST" && (
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
                )}
              <Col xs={24} md={24}>
                <Field
                  label="Your Email"
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
                  label="Phone Number"
                  name="phoneNumber"
                  htmlType="text"
                  component={PlainTextField}
                  required={true}
                  parse={normalizePhone}
                  size={"large"}
                  hideErrorText={false}
                />
              </Col>
              <Divider style={{ margin: "2px 0px 10px" }} />
              <Col xs={24} md={24}>
                <Field
                  name="password"
                  component={PlainTextField}
                  htmlType="password"
                  label="Password"
                  size="large"
                  required={true}
                  autoComplete="password"
                  hideErrorText={true}
                />
                <PasswordValidation
                  passwordValidationObject={passwordIsValid(values.password)}
                />
              </Col>
              <Col xs={24} md={24}>
                <Field
                  name="confirmPassword"
                  component={PlainTextField}
                  htmlType="password"
                  label="Confirm Password"
                  size="large"
                  required={true}
                  autoComplete="password"
                  hideErrorText={false}
                />
              </Col>

              {role === "GUARDIAN" && (
                <>
                  <Divider />
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
                </>
              )}

              {(role === "ADMIN" || role === "THERAPIST") && (
                <>
                  <Divider style={{ margin: "2px 0px 10px" }} />
                  {(!organizationInviteKey) && (
                    <Col xs={24} md={24}>
                      <Field
                        label="Orgnization Name"
                        name="organizationName"
                        htmlType="text"
                        component={PlainTextField}
                        required={true}
                        size={"large"}
                        hideErrorText={false}
                      />
                    </Col>
                  )}
                </>
              )}
              
              <Col xs={24} md={24} style={role === "ADMIN" &&  {opacity: 0, height: 10}}>
                <Field
                  name="organizationInviteKey"
                  component={PlainTextField}
                  htmlType="text"
                  label="Organization Invite Token"
                  size="large"
                  required={false}
                  hideErrorText={false}
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
              Sign Up
            </Button>
          </form>
        )}
      />
    </Spin>
  );
}

export default UserSignUpForm;
