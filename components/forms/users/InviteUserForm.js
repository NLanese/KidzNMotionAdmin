import React from "react";
import { Form, Field } from "react-final-form";
import { PlainTextField, SelectField } from "@fields";
import { Col, Row, Button, message, Spin } from "antd";

import { userState } from "@atoms";
import { useRecoilState } from "recoil";

import { useMutation } from "@apollo/client";
import { INVITE_USER, GET_USER } from "@graphql/operations";
import client from "@utils/apolloClient";

import Router from "next/router";

function InviteUserForm() {
  const [user, setUser] = useRecoilState(userState);

  // Mutations
  const [inviteUser, {}] = useMutation(INVITE_USER);

  const handleInvite = async (formValues) => {
    await inviteUser({
      variables: {
        role: formValues.role,
        email: formValues.email,
      },
    })
      .then(async (resolved) => {
        message.success("Successfully Invited User");
        Router.push("/users/manage");

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
        message.error(error.message);
      });
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
                  options={[
                    {
                      value: "GUARDIAN",
                      text: "Guardian",
                    },
                    {
                      value: "ADMIN",
                      text: "Admin",
                    },
                    {
                      value: "THERAPIST",
                      text: "Therapist",
                    },
                  ]}
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
              Invite User
            </Button>
          </form>
        )}
      />
    </Spin>
  );
}

export default InviteUserForm;
