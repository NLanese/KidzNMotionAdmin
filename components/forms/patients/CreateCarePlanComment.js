
// React and AntD
import React, { useState } from "react";
import { Form, Field } from "react-final-form";
import { TextAreaField } from "@fields";
import { message, Popconfirm, Button, Row, Col, Select } from "antd";

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

    // Related Video ID
    const [relatedVideoId, setRelatedVideoId] = useState(null)

    // Mutations
    const [createComment, {}] = useMutation(CREATE_CHILD_CARE_PLAN_COMMENT);

  //////////////
  // Handlers //
  //////////////

    // Handles Entire Process of Submitting a New Comment
    const handleFormSubmit = async (formValues) => {
      setLoading(true);
      await createComment({
        variables: {
          commentContent: formValues.commentContent,
          childCarePlanID: initialValues.childCarePlanID,
          assignmentID: assignment && initialValues.assignmentID,
          videoID: relatedVideoId ? relatedVideoId : null
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
            label: VIDEOS[key].title,
          });
        }
      }
    }
    options = options.sort((a, b) => a.label.localeCompare(b.label)); // Sort alphabetically
    return options;
  };



  return (
    // <Spin spinning={loading}>
    <div></div>
    // <div>
    //   {/* Form Settings */}
    //   <Form
    //     // On Submit
    //     onSubmit={handleFormSubmit}
    //     initialValues={initialValues}

    //     // Form Mutators
    //     mutators={{
    //       setValue: ([field, value], state, { changeValue }) => {
    //         changeValue(state, field, () => value);
    //       },
    //     }}

    //     // Form Validators
    //     validate={(values) => {
    //       const errors = {};
    //       if (!values.commentContent) {
    //         errors.commentContent = "Required";
    //       }

    //       return errors;
    //     }}

    //     // Form Render //
    //     render={({
    //       handleSubmit,
    //       pristine,
    //       invalid,
    //       submitting,
    //       form,
    //       values,
    //     }) => (
    //       <form
    //         onSubmit={(event) => {
    //           handleSubmit(event).then((event) => {
    //             form.mutators.setValue("commentContent", "");
    //           });
    //         }}
    //       >
    //         <Row gutter={16}>

    //           {/* Text Area */}
    //           <Col xs={24} md={24}>
    //             <Field
    //               name="commentContent"
    //               component={TextAreaField}
    //               htmlType="text"
    //               label={
    //                 assignment ? "Assignment Progress" : "Care Plan Comment"
    //               }
    //               size={"large"}
    //               required={false}
    //             />
    //           </Col>

    //           {/* Video Dropdown */}
    //           <Col>
    //             <Form.Item name="videoIDs"
    //               label="Related Video (Optional)"
    //               rules={[{ required: false, message: "Select a video if necessary!" }]}
    //             >
    //               <Select
    //                 mode="single"
    //                 placeholder="Select videos"
    //                 style={{ width: "100%", marginTop: "10px" }}
    //                 options={renderVideoOptions()}
    //                 onChange={(e) => setRelatedVideoId(e)}
    //               />
    //             </Form.Item>
    //           </Col>
    //         </Row>

    //         <Button
    //           type="primary"
    //           loading={submitting}
    //           htmlType="submit"
    //           block={true}
    //           size={"large"}
    //           disabled={invalid || pristine}
    //         >
    //           Create
    //         </Button>
    //       </form>
    //     )}
    //   />
    // </div>

    // </Spin>
  );
}

export default CreateCarePlanComment;
