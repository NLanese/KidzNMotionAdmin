
import React, { useState } from "react";
import { Form, Field } from "react-final-form";
import { TextAreaField } from "@fields";
import { Col, Row, Button, message, Spin } from "antd";

import { useMutation } from "@apollo/client";
import { CREATE_CHILD_CARE_PLAN_COMMENT } from "@graphql/operations";
import Router from "next/router";

/////////////////////////////////////////////
//                                         //
//   This is the Sidebar that Opens        //
//   when a User Selects 'Add New Comment' //
//                                         //
/////////////////////////////////////////////
function CreateCarePlanComment({
  getUser,
  initialValues,
  returnUrl,
  assignment,
}) {

  ///////////
  // State //
  ///////////

  // Page Loading
  const [loading, setLoading] = useState(false);

  // Related Video ID
  const [relatedVideoId, setRelatedVideoId] = useState(null)

  // Mutations
  const [createComment, {}] = useMutation(CREATE_CHILD_CARE_PLAN_COMMENT);


  // Handles Entire Process of Submitting a New Comment
  const handleFormSubmit = async (formValues) => {
    setLoading(true);
    await createComment({
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

      {/* Form Settings */}
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


        // Form Render //
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
                    assignment ? "Assignment Progress" : "Care Plan Comment"
                  }
                  size={"large"}
                  required={false}
                />
              </Col>
              <Col>
                {/* Video Dropdown */}
                <Form.Item
                  name="videoIDs"
                  label="Related Video (Optional)"
                  rules={[{ required: false, message: "Select a video if necessary!" }]}
                >
                  <Select
                    mode="single"
                    placeholder="Select videos"
                    style={{ width: "100%", marginTop: "10px" }}
                    options={renderVideoOptions()}
                    onChange={(e) => setRelatedIDs(e)}
                  />
                </Form.Item>
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
              Create
            </Button>
          </form>
        )}
      />
    </Spin>
  );
}

export default CreateCarePlanComment;
