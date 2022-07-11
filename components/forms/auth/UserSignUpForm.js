import React, { useState } from "react";
import { Form, Field } from "react-final-form";
import { PlainTextField } from "@fields";
import { Col, Row, Button, message, Divider, Spin } from "antd";
import { emailIsValid, normalizePhone, passwordIsValid } from "@helpers/forms";
import { makeRandomString } from "@helpers/common";

import PasswordValidation from "@forms/addons/PasswordValidation";

import { MANAGER_SIGN_UP, OWNER_SIGN_UP } from "@graphql/operations";
import { COMPANY_PREFERENCES_INITIAL_VALUES } from "@constants/forms";
import { convertCompanyPreferenceFormToGraphQL } from "@helpers/companyPreferences";

import { useMutation } from "@apollo/client";
import { CREATE_COMPANY_PREFERENCES } from "@graphql/operations";

function UserSignUpForm({ type, initialValues }) {
  const [redirectLogin, setRedirectLogin] = useState(false);

  // Mutations
  const [managerSignUp, {}] = useMutation(MANAGER_SIGN_UP);
  const [ownerSignUp, {}] = useMutation(OWNER_SIGN_UP);
  const [createCompanyPreferences, {}] = useMutation(
    CREATE_COMPANY_PREFERENCES
  );

  const handleSignUpSuccess = async (userData) => {
    message.success("Successfully signed up");

    // Set the form spinner
    setRedirectLogin(true);

    if (userData.role === "OWNER") {
      // Need to create the intial DSP informatino for the user to track subscriptino on first load
      let copiedInitialDSPValues = {};
      Object.assign(copiedInitialDSPValues, COMPANY_PREFERENCES_INITIAL_VALUES);

      // Assign the intital values
      copiedInitialDSPValues.companyDetails.name = makeRandomString(8);
      copiedInitialDSPValues.companyDetails.shortcode = makeRandomString(8);
      copiedInitialDSPValues.companyDetails.timeZone = "EST";

      // Set token into local stoate
      localStorage.setItem("token", userData.token);
      localStorage.setItem("role", userData.role);

      // Convert the values to graphql
      copiedInitialDSPValues = convertCompanyPreferenceFormToGraphQL(
        copiedInitialDSPValues
      );

      // Assign trial status
      copiedInitialDSPValues.variables.accountStanding = "Trial";

      // Create the intital DSP
      await createCompanyPreferences(copiedInitialDSPValues)
        .then(async (resolved) => {})
        .catch((error) => {});
    } else {
      // Set token into local stoate
      localStorage.setItem("token", userData.token);
      localStorage.setItem("role", userData.role);
    }

    // Push to site
    window.location = "/";
  };

  const handleSignUpFail = (error) => {
    error = `${error}`;
    if (error.includes("mail is already")) {
      message.error("This email is already in use");
    } else if (error.includes("owner does")) {
      message.error("This owner does not exist");
    } else {
      message.error("Sorry, there was an error with your sign up");
    }
  };

  const handleSignUp = async (formValues) => {
    if (type === "MANAGER") {
      await managerSignUp({
        variables: {
          email: formValues.email,
          password: formValues.password,
          phoneNumber: formValues.phoneNumber,
          firstname: formValues.firstName,
          lastname: formValues.lastName,
          signupToken: formValues.signupToken,
        },
      })
        .then(async (resolved) => {
          await handleSignUpSuccess(resolved.data.managerSignUp);
        })
        .catch((error) => {
          handleSignUpFail(error);
        });
    } else {
      await ownerSignUp({
        variables: {
          email: formValues.email,
          password: formValues.password,
          phoneNumber: formValues.phoneNumber,
          firstname: formValues.firstName,
          lastname: formValues.lastName,
        },
      })
        .then(async (resolved) => {
          await handleSignUpSuccess(resolved.data.ownerSignUp);
        })
        .catch((error) => {
          handleSignUpFail(error);
        });
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
          if (type === "MANAGER") {
            if (!values.signupToken) {
              errors.signupToken = "Required";
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
            <legend>Manager Sign Up Form</legend>
            <Row gutter={16}>
              <Col xs={24} md={12}>
                <Field
                  label="First Name"
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
                  label="Last Name"
                  name="lastName"
                  htmlType="text"
                  component={PlainTextField}
                  required={true}
                  size={"large"}
                  hideErrorText={false}
                />
              </Col>
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
              {type === "MANAGER" && (
                <>
                  <Divider style={{ margin: "2px 0px 10px" }} />
                  <Col xs={24} md={24}>
                    <Field
                      name="signupToken"
                      component={PlainTextField}
                      htmlType="text"
                      label="Organization Sign Up Token"
                      size="large"
                      required={true}
                      autoComplete="password"
                      hideErrorText={false}
                    />
                  </Col>
                </>
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
              {type === "MANAGER" ? "Sign Up" : "Sign Up"}
            </Button>
          </form>
        )}
      />
    </Spin>
  );
}

export default UserSignUpForm;
