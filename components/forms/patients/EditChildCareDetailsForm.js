import React, { useState } from "react";
import { Form, Field } from "react-final-form";
import { TextAreaField, SelectField } from "@fields";
import { Col, Row, Button, message, Spin } from "antd";

import { useMutation } from "@apollo/client";
import { EDIT_CHILD_CARE_PLAN_DETAILS } from "@graphql/operations";
import Router from "next/router";
import VIDEOS from "@constants/videos";

function compare(a, b) {
  if (a.text < b.text) {
    return -1;
  }
  if (a.text > b.text) {
    return 1;
  }
  return 0;
}

function EditChildCareDetailsForm({ getUser, initialValues, returnUrl }) {
  const [loading, setLoading] = useState(false);

  // Mutations
  const [editFunction, {}] = useMutation(EDIT_CHILD_CARE_PLAN_DETAILS);

  const handleFormSubmit = async (formValues) => {
    setLoading(true);
    await editFunction({
      variables: {
        level: parseInt(formValues.childLevel),
        diagnosis: formValues.diagnosis,
        childCarePlanID: initialValues.childCarePlanID,
        blockedVideos: { ids: formValues.blockedVideos },
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

  const renderVideoOptions = () => {
    // {
    //   value: "1",
    //   text: "1",
    // },
    let options = [];
    for (var key in VIDEOS) {
      if (VIDEOS.hasOwnProperty(key)) {
        if (VIDEOS[key].id !== "great_job") {
          options.push({
            value: VIDEOS[key].id,
            text: `${VIDEOS[key].title} - Level: ${VIDEOS[key].level}`,
          });
        }
      }
    }

    options = options.sort(compare); // b - a for reverse sort

    // console.log(options);

    return options;
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
                    // {
                    //   value: "3",
                    //   text: "3",
                    // },
                  ]}
                  size={"large"}
                  required={false}
                />
              </Col>
              <Col xs={24} sm={24}>
                <Field
                  label="Blocked Videos"
                  name="blockedVideos"
                  htmlType="text"
                  component={SelectField}
                  required={true}
                  showSearch={true}
                  mode="multiple"
                  options={renderVideoOptions()}
                  size={"large"}
                  hideErrorText={false}
                />
              </Col>
              <Col xs={24} md={24}>
                <Field
                  name="diagnosis"
                  component={TextAreaField}
                  label="Diagnosis"
                  size={"large"}
                  required={false}
                  hideErrorText={true}
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
