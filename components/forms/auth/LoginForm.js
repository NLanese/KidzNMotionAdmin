import React, { useState, useEffect } from "react";
import { Form, Field } from "react-final-form";
import { PlainTextField } from "@fields";
import { Col, Row, Button, message, Spin } from "antd";
import { emailIsValid } from "@helpers/forms";
import { useSetRecoilState } from "recoil";
import { userState } from "@atoms";

import { useMutation } from "@apollo/client";
import { DYNAMIC_SIGN_IN } from "@graphql/operations";


function LoginForm() {
  const setUser = useSetRecoilState(userState);
  const [redirectLogin, setRedirectLogin] = useState(false);

  // Mutations
  const [signIn, {}] = useMutation(DYNAMIC_SIGN_IN);

  const handleLogin = async (formValues) => {
    await signIn({
      variables: {
        email: formValues.email,
        password: formValues.password,
      },
    })
      .then(async (resolved) => {
        message.success("Successfully logged in");

        // Set the form spinner
        setRedirectLogin(true);

        // Set user data into recoil
        setUser(resolved.data.dynamicSignIn);

        // Set token into local stoate
        localStorage.setItem("token", resolved.data.dynamicSignIn.token);
        localStorage.setItem("role", resolved.data.dynamicSignIn.role);

        // Push to site
        // MIGHT be needed
        // window.location = "/";
      })
      .catch((error) => {
        message.error("Incorrect email or password");
      });
  };

  useEffect(() => {
    localStorage.removeItem("token")
    localStorage.removeItem("role")
  }, []);


  return (
    <Spin spinning={redirectLogin}>
      <Form
        onSubmit={handleLogin}
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
          } else {
            if (!emailIsValid(values.email)) {
              errors.email = "Email is not valid";
            }
          }
          if (!values.password) {
            errors.password = "Required";
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
                form.mutators.setValue("password", "");
              });
            }}
          >
            <legend>Login Form</legend>
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
              <Col xs={24} md={24}>
                <Field
                  name="password"
                  component={PlainTextField}
                  htmlType="password"
                  label="Password"
                  size={"large"}
                  required={true}
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
              Continue
            </Button>
          </form>
        )}
      />
    </Spin>
  );
}

export default LoginForm;
