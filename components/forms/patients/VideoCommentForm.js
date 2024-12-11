
import React, { useState, useEffect } from "react";
import { Form, Field } from "react-final-form";
import { TextAreaField } from "@fields";
import { Col, Row, Button, message, Spin } from "antd";

import { useMutation, useLazyQuery } from "@apollo/client";
import { CREATE_CHILD_CARE_PLAN_COMMENT, GET_EXISTING_COMMENT } from "@graphql/operations";
import Router from "next/router";

function VideoCommentForm({ getUser, initialValues, returnUrl, assignment }) {
  const [loading, setLoading] = useState(false);
  const [hasComment, setHasComment] = useState(false);

  // Queries and Mutations
  const [editFunction] = useMutation(CREATE_CHILD_CARE_PLAN_COMMENT);
  const [fetchExistingComment, { data, loading: queryLoading }] = useLazyQuery(GET_EXISTING_COMMENT);

  // Check for existing comment on component mount
  useEffect(() => {
    fetchExistingComment({
      variables: {
        childCarePlanID: initialValues.childCarePlanID,
        videoID: initialValues.videoID,
      },
    });
  }, [fetchExistingComment, initialValues.childCarePlanID, initialValues.videoID]);

  useEffect(() => {
    if (data?.existingComment) {
      setHasComment(true);
    }
  }, [data]);

  const handleFormSubmit = async (formValues) => {
    setLoading(true);
    await editFunction({
      variables: {
        commentContent: formValues.commentContent,
        childCarePlanID: initialValues.childCarePlanID,
        assignmentID: initialValues.assignmentID,
        videoID: initialValues.videoID,
      },
    })
      .then(async () => {
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

  if (queryLoading) {
    return <Spin spinning={true} />;
  }

  if (hasComment) {
    return <p>You have already submitted a comment for this video.</p>;
  }

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
              handleSubmit(event).then(() => {
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
                  label={"Video Comment"}
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

export default VideoCommentForm;
