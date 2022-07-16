import React, { useState } from "react";
import { Form, Field } from "react-final-form";
import { PlainTextField } from "@fields";
import { Col, Row, Button, Result, message } from "antd";
import { emailIsValid } from "@helpers/forms";


import { useMutation } from "@apollo/client";
import { REQUEST_PASSWORD_RESET } from "@graphql/operations";

function PasswordResetRequestForm() {
  // Mutation
  const [requestPasswordReset] = useMutation(REQUEST_PASSWORD_RESET);

  const [requestSent, setRequestSent] = useState(false);

  const handlePasswordResetRequest = async (formValues) => {
    await requestPasswordReset({
      variables: {
        email: formValues.email,
      },
    })
      .then(async (resolved) => {
        setRequestSent(true);
      })
      .catch((error) => {
        message.error("Sorry, there was an error requesting this password update");
      });
  };

  if (requestSent) {
    return (
      <Result
        status="success"
        title="Password Reset Sent"
        subTitle="Please check your SPAM folder if you do not see the email within 2 minutes"
      />
    );
  }
  return (
    <Form
      onSubmit={handlePasswordResetRequest}
      initialValues={{}}
      keepDirtyOnReinitialize={true}
      validate={(values) => {
        const errors = {};
        if (!values.email) {
          errors.email = "Required";
        } else {
          if (!emailIsValid(values.email)) {
            errors.email = "Email is not valid";
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
                label="Email"
                name="email"
                htmlType="email"
                component={PlainTextField}
                required={true}
                size={"large"}
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
  );
}

export default PasswordResetRequestForm;
