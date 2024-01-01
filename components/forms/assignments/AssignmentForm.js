// React Native
import React from "react";
import { Form, Field } from "react-final-form";
import { OnChange } from "react-final-form-listeners";

// Ant Design 
import { PlainTextField, SelectField, DateField } from "@fields";
import { Col, Row, Button, message, Spin, Select } from "antd";

// Recoil
import { userState, assignmentsState } from "@atoms";
import { useRecoilState } from "recoil";

// Mutations and Queries
import { useMutation } from "@apollo/client";
import { CREATE_ASSIGNMENT, GET_USER_ASSIGNMENTS } from "@graphql/operations";
import client from "@utils/apolloClient";

// Next.js
import Router from "next/router";

// Videos
import VIDEOS from "@constants/videos";
import { filterObjectKeys } from "../../../functions/objectHandlers";

function AssignmentForm({}) {
  ///////////
  // STATE //
  ///////////

  const [user, setUser] = useRecoilState(userState);
  const [assignments, setAssignments] = useRecoilState(assignmentsState);

  ///////////////
  // Mutations //
  ///////////////

  // Create Assignment Mutation
  const [createAssignment, {}] = useMutation(CREATE_ASSIGNMENT);

  // Executes Create Assignment Mutation
  const handleCreateAssignment = async (formValues) => {
    let uniques = removeDuplicates(formValues.selectedClientIDs)

    // For every Child this assignment is intended for...
    uniques.selectedClientIDs.forEach(async (id) => {
      if (id === "" || id === null || id.length < 2){
        return
      }
      let desc = (formValues.description && formValues.description.length > 0) ? formValues.description : "No special instructions"
      let videos = formValues.selectedVideoIDs.filter(val => {
        if (val && val !== "" && val.length !== 0){
          return val
        }
      })

      // ...Create the Assignment by executing Mutation
      await createAssignment({
        variables: {
          childCarePlanID: id,
          dateStart: formValues.dateStart.toString().slice(0,15),
          dateDue: formValues.dateDue.toString().slice(0,15),
          description: desc,
          title: formValues.title,
          videoIDs: videos
        }
      })
        // ...then Notify the user of success
        .then(async (resolved) => {
          message.success("Successfully Created Assignment for child " + id);
          Router.push("/assignments");
  
          // ...and run another query to get the new list of assignments so that the page reflects the changes
          await client
            .query({
              query: GET_USER_ASSIGNMENTS,
              fetchPolicy: "network-only",
            })
            .then(async (resolved) => {
              setAssignments(resolved.data.getAssignments);
            })
            .catch((error) => {
              message.error("Sorry, there was an error getting this information");
            });
        })
        .catch((error) => {
          message.error(error.message);
        });
    })
    
  };

  ///////////////
  // FUNCTIONS //
  ///////////////

  // Finds All Possible Clients to make Assignment For
  const getPossibleClients = () => {
    return user.patientCarePlans.map((pcp) => {
      return {
        text: `${pcp.child.firstName} ${pcp.child.lastName}`,
        value: pcp.id
      };
    });
  };

  // Grabs all of the Videos
  const getAllVideos = () => {
    const checkValid = (vid) => {if (vid.level > 0) return vid}
    const returnAsOption = (vid) => {
      return {
        text: `${vid.title} (Level ${vid.level})`,
        value: vid.id

      }
    }
    let returnVal = filterObjectKeys(VIDEOS, checkValid, returnAsOption)
    return returnVal.filter(val => {
      if (val && val !== "" && val.length !== 0){
        return val
      }
    })    
  }

  // Validates the Form
  function validateForm(values) {
    const errors = {};
    if (!values.title) {
      errors.title = "Required";
    }
    if (!values.dateStart) {  // Match the name used in renderDateField("start")
      errors.dateStart = "Required";
    }
    if (!values.dateDue) {    // Match the name used in renderDateField("end")
      errors.dateDue = "Required";
    }
    if (!values.selectedClientIDs || values.selectedClientIDs.length === 0) {
      errors.selectedClientIDs = "At least one client is required";  // Match the name used in renderSelectClientsField()
    }
    if (!values.selectedVideoIDs || values.selectedVideoIDs.length === 0) {
      errors.selectedVideoIDs = "At least one video is required";  // Match the name used in renderSelectVideosField()
    }

    return errors;
  }

  // Removes duplicate values from arrays
  function removeDuplicates(arr) {
    let unique = [];
    arr.forEach(element => {
        if (!unique.includes(element)) {
          if (element.split("").length > 1){
            unique.push(element);
          }
        }
    });
    return unique;
}

  ////////////////
  // RENDERINGS //
  ////////////////

  // Renders the Assignment Title Field
  const renderTitleField = () => {
    return(
      <Field
        label="Title"
        name="title"
        htmlType="text"
        component={PlainTextField}
        required={true}
        size="large"
        hideErrorText={false}
      />
    )
  }

  // Renders the Description/Instruction Field
  const renderDescriptionField = () => {
    return(
      <Field
        label="Description or Instructions"
        name="description"
        htmlType="text"
        component={PlainTextField}
        required={true}
        size="large"
        hideErrorText={false}
      />
    )
  }

  // Renders the Client Selection Field
  const renderSelectClientsField = () => (
    <Field
      name="selectedClientIDs"
      component={SelectField}
      htmlType="text"
      label="Select Clients"
      options={getPossibleClients()}
      size="large"
      required={true}
      mode="multiple"
    />
  );

  // Renders the Video Selection Field
  const renderSelectVideosField = () => {
    return(
      <Field
        name="selectedVideoIDs"
        component={SelectField}
        htmlType="text"
        label="Select Videos"
        options={getAllVideos()}
        size="large"
        required={true}
        mode="multiple"
      />
    )
  }

  // Renders the Start Date Field
  const renderDateField = (startOrEnd) => {
    let label
    let name
    if (startOrEnd === "start"){
      label = "Start Date"
      name = "dateStart"
    }
    else if (startOrEnd === "end"){
      label = "Due Date"
      name="dateDue"
    }
    return(
      <Field
        label={label}
        name={name}
        htmlType="text"
        component={DateField}
        showTime={false}
        required={true}
        size="large"
        hideErrorText={false}
      />
    )
  }

  // Renders the Submit Button for the Field
  const renderSubmitButton = (submitting, pristine, invalid) => {
    return(
      <Button
        type="primary"
        loading={submitting}
        htmlType="submit"
        block={true}
        size="large"
        disabled={invalid || pristine}
      >
        Create Assignment
      </Button>
    )
  }

  // Main Form
  const renderForm = (
    handleSubmit,
    pristine,
    invalid,
    submitting,
    form,
    values
  ) => {
    return(
    <form
    onSubmit={(event) => {
      handleSubmit(event).then((event) => {});
    }}
  >
    <legend>Invite User Form</legend>
    <Row gutter={16}>
      <Col xs={24} md={24}>
        <h3>Step 1: Title Your Assignment</h3>
        <h4>And Leave Instructions or a description!</h4>
        {renderTitleField()}
        {renderDescriptionField()}
      </Col>
      <Col xs={24} md={24}>
        <h3>Step 2: Select a Start Date & an End Date</h3>
        {renderDateField("start")}
      </Col>
      <Col xs={24} md={24}>
        {renderDateField("end")}
      </Col>
      <Col xs={24} md={24}>
        <h3>Step 3: Select Videos</h3>
        {renderSelectVideosField()}
      </Col>
      <>
      <Col xs={24} md={24}>
        <h3>Step 4: Add Participants</h3>
        {renderSelectClientsField()}
      </Col>
      </>
      {renderSubmitButton(submitting, pristine, invalid)}
    </Row>

    </form>
    )
  }


  /////////////////
  // MAIN RETURN //
  /////////////////
  return (
    <Spin spinning={false}>
      <Form
        onSubmit={handleCreateAssignment}
        initialValues={{}}
        mutators={{
          setValue: ([field, value], state, { changeValue }) => {
            changeValue(state, field, () => value);
          },
        }}
        validate={(values) => validateForm(values)}
        render={({
          handleSubmit,
          pristine,
          invalid,
          submitting,
          form,
          values,
        }) => (
          renderForm(handleSubmit,
            pristine,
            invalid,
            submitting,
            form,
            values)
        )}
      />
    </Spin>
  );
}

export default AssignmentForm;
