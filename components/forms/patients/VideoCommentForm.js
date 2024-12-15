// React, Next and Antd
import React, { useState } from "react";
import { Form, Field } from "react-final-form";
import { TextAreaField } from "@fields";
import { Col, Row, Button, message, Spin } from "antd";
import Router from "next/router";


// Apollo / GraphQL
import { useMutation } from "@apollo/client";
import { CREATE_CHILD_CARE_PLAN_COMMENT } from "@graphql/operations";

// Videos
import VIDEOS from "../../../constants/videos";

///////////////
// Component //
///////////////
function VideoCommentForm({ getUser, initialValues, returnUrl }) {
  const [loading, setLoading] = useState(false);
  const [hasComment, setHasComment] = useState(false);

  // Mutations
  const [editOrCreateComment, {}] = useMutation(CREATE_CHILD_CARE_PLAN_COMMENT);


  const handleFormSubmit = async (formValues) => {
    setLoading(true);
    await editOrCreateComment({
      variables: {
        commentContent: formValues.commentContent,
        childCarePlanID: initialValues.childCarePlanID,
        assignmentID: initialValues.assignmentID ? initialValues.assignmentID : null,
        videoID: initialValues.videoID ? initialValues.videoID : null
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
