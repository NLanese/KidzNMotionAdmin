
// React and AntD
import React, { useState } from "react";
import { Form, Field } from "react-final-form";
import { TextAreaField, SelectField } from "@fields";
import { message, Popconfirm, Button, Row, Col, Select, Spin } from "antd";

// GraphQL / Apollo
import { useMutation } from "@apollo/client";
import { CREATE_CHILD_CARE_PLAN_COMMENT } from "@graphql/operations";

// Next
import Router from "next/router";

// Videos
import VIDEOS from "../../../constants/videos";

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

    // Stored Comments
    const [comments, setComments] = useState([]); 

    // Mutations
    const [createComment, {}] = useMutation(CREATE_CHILD_CARE_PLAN_COMMENT);
    
  //////////////
  // Handlers //
  //////////////

    // Handles Entire Process of Submitting a New Comment
    const handleFormSubmit = async (formValues) => {
      console.log(
        {
          commentContent: formValues.commentContent,
          childCarePlanID: initialValues.childCarePlanID,
          assignmentID: assignment && initialValues.assignmentID,
          videoID: formValues.videoID ? formValues.videoID : null
        }
      )
      setLoading(true);
      await createComment({
        variables: {
          commentContent: formValues.commentContent,
          childCarePlanID: initialValues.childCarePlanID,
          assignmentID: assignment && initialValues.assignmentID,
          videoID: formValues.videoID ? formValues.videoID : null
        },
      })
    }
  
  /////////////
  // Renders //
  /////////////

  // Sets values for Videos Dropdown
  const renderVideoOptions = () => {
    let options = [];
    for (var key in VIDEOS) {
      if (VIDEOS[key].id !== "great_job") {
        if (VIDEOS.hasOwnProperty(key)) {
          options.push({
            value: VIDEOS[key].id,
            text: VIDEOS[key].title,
          });
        }
      }
    }
    options = options.sort((a, b) => a.text.localeCompare(b.text)); // Sort alphabetically
    return options;
  };



  return (
    <Spin spinning={loading}>
    <div>
      {/* Form Settings */}
      <Form
        // On Submit
        onSubmit={handleFormSubmit}
        initialValues={initialValues}

        // Form Mutators
        mutators={{
          setValue: ([field, value], state, { changeValue }) => {
            changeValue(state, field, () => value);
          },
        }}

        // Form Validators
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

              {/* Text Area */}
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

              {/* Video Dropdown */}
              <Col>
                <Field
                    name="videoID"
                    component={SelectField}
                    options={renderVideoOptions()} 
                    htmlType="dropdown"
                    label="Attach a Related Video if Necessary"
                    placeholder="No Related Video"
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
    </div>

    </Spin>
  );
}

export default CreateCarePlanComment;
