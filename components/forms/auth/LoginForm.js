import React, { useState, useEffect } from "react";
import { Form, Field } from "react-final-form";
import { PlainTextField } from "@fields";
import { Col, Row, Button, message, Spin } from "antd";
import { useSetRecoilState } from "recoil";
import { userState } from "@atoms";

import { useMutation } from "@apollo/client";
import { LOGIN_USER, GET_USER } from "@graphql/operations";
import client from "@utils/apolloClient";

// One shared key so repeated failed attempts replace the same message
// instead of stacking up, and a successful login can clear it.
const LOGIN_ERROR_KEY = "login-error";

// Turns a failed login into a short, readable sentence,
// e.g. "UserInputError: Email/Password are incorrect." -> "Email/Password are incorrect."
function loginErrorText(error) {
  const raw =
    (error && error.graphQLErrors && error.graphQLErrors[0] && error.graphQLErrors[0].message) ||
    (error && error.message) ||
    "";
  const cleaned = raw.replace(/^(\w*Error:\s*)+/, "").trim();
  if (!cleaned || /network|failed to fetch/i.test(cleaned)) {
    return "Could not log in. Please check your connection and try again.";
  }
  return cleaned;
}

function LoginForm() {
  const setUser = useSetRecoilState(userState);
  const [redirectLogin, setRedirectLogin] = useState(false);

  // Mutations
  const [loginUser, {}] = useMutation(LOGIN_USER);

  const handleLogin = async (formValues) => {
    await loginUser({
      variables: {
        username: formValues.username,
        password: formValues.password,
      },
    })
      .then(async (resolved) => {
        message.destroy(LOGIN_ERROR_KEY);
        message.success("Successfully logged in");

        // Set the form spinner
        setRedirectLogin(true);

        // // Set token into local stoate
        localStorage.setItem("token", resolved.data.loginUser.token);

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
            message.error("Sorry, there was an error getting this information");
          });
      })
      .catch((error) => {
        console.warn("Login failed:", error);
        message.error({ content: loginErrorText(error), key: LOGIN_ERROR_KEY, duration: 4 });
      });
  };

  useEffect(() => {
    localStorage.removeItem("token");
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
          if (!values.username) {
            errors.username = "Required";
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
                  label="Email / Username"
                  name="username"
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
