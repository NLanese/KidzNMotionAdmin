import React, { useState } from "react";
import { Form, Field } from "react-final-form";
import { TextAreaField } from "@fields";
import { Col, Row, Button, message, Spin } from "antd";

import { useMutation } from "@apollo/client";
import { CREATE_CHILD_CARE_PLAN_COMMENT } from "@graphql/operations";
import Router from "next/router";

function CreateCarePlanComment({
  getUser,
  initialValues,
  returnUrl,
  assignment,
}) {
  const [loading, setLoading] = useState(false);

  // Mutations
  const [editFunction, {}] = useMutation(CREATE_CHILD_CARE_PLAN_COMMENT);

  const handleFormSubmit = async (formValues) => {
    setLoading(true);
    await editFunction({
      variables: {
        commentContent: formValues.commentContent,
        childCarePlanID: initialValues.childCarePlanID,
        assignmentID: assignment && initialValues.assignmentID,
      },
    })
      .then(async (resolved) => {
        setLoading(false);
        await getUser();
        Router.replace(returnUrl, null, {
          shallow: true,
          scroll: false,
        });
        message.success("Successfully Saved Comment");
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
          if (!values.commentContent) {
            errors.commentContent = "Required";
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
                form.mutators.setValue("commentContent", "");
              });
            }}
          >
            <Row gutter={16}>
              <Col xs={24} md={24}>
                <Field
                  name="commentContent"
                  component={TextAreaField}
                  htmlType="text"
                  label={
                    assignment ? "Assignment Comment" : "Care Plan Comment"
                  }
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
              Create Comment
            </Button>
          </form>
        )}
      />
    </Spin>
  );
}

export default CreateCarePlanComment;
