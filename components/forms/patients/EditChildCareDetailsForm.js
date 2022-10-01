import React, { useState } from "react";
import { Form, Field } from "react-final-form";
import { PlainTextField, SelectField } from "@fields";
import { Col, Row, Button, message, Spin } from "antd";

import { useMutation } from "@apollo/client";
import { EDIT_CHILD_CARE_PLAN_DETAILS } from "@graphql/operations";
import Router from "next/router";

function EditChildCareDetailsForm({ getUser, initialValues, returnUrl }) {
  const [loading, setLoading] = useState(false);

  // Mutations
  const [editFunction, {}] = useMutation(EDIT_CHILD_CARE_PLAN_DETAILS);

  const handleFormSubmit = async (formValues) => {
    setLoading(true);
    await editFunction({
      variables: {
        level: parseInt(formValues.childLevel),
        childCarePlanID: initialValues.childCarePlanID
      },
    })
      .then(async (resolved) => {
        setLoading(false);
        await getUser();
        Router.push(returnUrl, null, {
          shallow: true,
        });
        message.success("Successfully Saved Edit");
      })
      .catch((error) => {
        setLoading(false);
        message.error("Something went wrong here.");
      });
  };

  return (
    <Spin spinning={loading}>
      <Form
        onSubmit={handleFormSubmit}
        initialValues={initialValues}
        mutators={{
          setValue: ([field, value], state, { changeValue }) => {
            changeValue(state, field, () => value);
          },
        }}
        validate={(values) => {
          const errors = {};
          if (!values.childLevel) {
            errors.childLevel = "Required";
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
            <Row gutter={16}>
              <Col xs={24} md={24}>
                <h3>Child Information</h3>
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
                    {
                      value: "3",
                      text: "3",
                    },
                  ]}
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
              Save Edit
            </Button>
          </form>
        )}
      />
    </Spin>
  );
}

export default EditChildCareDetailsForm;
