import React, { useState } from "react";
import { Form, Field } from "react-final-form";
import { PlainTextField } from "@fields";
import { Col, Row, Button, Spin, message } from "antd";

import { passwordIsValid } from "@helpers/forms";

import PasswordValidation from "@forms/addons/PasswordValidation";

import Router from "next/router";

import { useMutation } from "@apollo/client";
import { RESET_PASSWORD_FROM_KEY } from "@graphql/operations";


function PasswordResetFromKeyForm() {
  const [redirectLoading, setRedirectLoading] = useState(false);

  const [restPasswordFromKey] = useMutation(RESET_PASSWORD_FROM_KEY);


  const handlePasswordResetRequest = async (formValues) => {
    setRedirectLoading(true);


    const urlSearchParams = new URLSearchParams(window.location.search);
    const resetKey = urlSearchParams.get("key");


    await restPasswordFromKey({
      variables: {
        password: formValues.password,
        resetPasswordKeyID: resetKey
      },
    })
      .then(async (resolved) => {
        setRedirectLoading(false);
        message.success("Your password has been reset");
        Router.push("/authentication/login", null, { shallow: true });
        
      })
      .catch((error) => {
        setRedirectLoading(false);
        message.error("Sorry, there was an error reseting your password");
      });

  
   
  };

  return (
    <Spin spinning={redirectLoading}>
      <Form
        onSubmit={handlePasswordResetRequest}
        initialValues={{}}
        validate={(values) => {
          const errors = {};
          if (!values.password) {
            errors.password = "Required";
          }
          if (values.password) {
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
              handleSubmit(event).then((event) => {});
            }}
          >
            <legend>Password Reset Request Form</legend>
            <Row gutter={16}>
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
            </Row>

            <Button
              type="primary"
              loading={submitting}
              htmlType="submit"
              block={true}
              size={"large"}
              disabled={invalid || pristine}
            >
              Reset password
            </Button>
          </form>
        )}
      />
    </Spin>
  );
}

export default PasswordResetFromKeyForm;
