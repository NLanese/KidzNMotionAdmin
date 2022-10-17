import React, { useState } from "react";
import { Form, Field } from "react-final-form";
import { TextAreaField, PlainTextField, DateField, SelectField } from "@fields";
import {
  Col,
  Row,
  Button,
  message,
  Spin,
  Space,
  Typography,
  Divider,
} from "antd";
import ContentCard from "@common/content/ContentCard";
import { useMutation } from "@apollo/client";
import { CREATE_CHILD_CARE_PLAN_ASSIGMENT } from "@graphql/operations";
import Router from "next/router";
import ReactPlayer from "react-player";
import VIDEOS from "@constants/videos";
const { Text, Title, Link } = Typography;

function compare(a, b) {
  if (a.text < b.text) {
    return -1;
  }
  if (a.text > b.text) {
    return 1;
  }
  return 0;
}

function CreateCarePlanAssignmentForm({ getUser, initialValues, returnUrl }) {
  const [loading, setLoading] = useState(false);

  // Mutations

  const [createFunction, {}] = useMutation(CREATE_CHILD_CARE_PLAN_ASSIGMENT);
  const handleFormSubmit = async (formValues) => {
    setLoading(true);
    await createFunction({
      variables: {
        childCarePlanID: initialValues.childCarePlanID,
        dateStart: formValues.dateStart,
        dateDue: formValues.dateEnd,
        title: formValues.title,
        description: formValues.description,
        videoIDs: formValues.videoIDs,
      },
    })
      .then(async (resolved) => {
        setLoading(false);
        await getUser();
        Router.push(returnUrl, null, {
          shallow: true,
        });
        message.success("Successfully Created Assigment");
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
      if (VIDEOS[key].id !== "great_job") {
        if (VIDEOS.hasOwnProperty(key)) {
          options.push({
            value: VIDEOS[key].id,
            text: `${VIDEOS[key].title} - Level: ${VIDEOS[key].level}`,
          });
        }
      }
    }
    options = options.sort(compare); // b - a for reverse sort

    return options;
  };

  const renderAssignedVideos = (videoIDs) => {
    return videoIDs.map((videoID) => {
      let videoObject = VIDEOS[videoID];
      return (
        <ContentCard style={{ position: "relative" }} key={videoID.title}>
          <Space direction="vertical">
            <Title style={{ margin: "0px" }} level={5}>
              {videoObject.title}
            </Title>
            <Text>{videoObject.description}</Text>
          </Space>
          <ReactPlayer
            url={videoObject.videoURL}
            controls={true}
            width="100%"
            style={{ width: "100%" }}
          />
        </ContentCard>
      );
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

          if (!values.dateStart) {
            errors.dateStart = "Required";
          }
          if (!values.dateEnd) {
            errors.dateEnd = "Required";
          }
          if (!values.title) {
            errors.title = "Required";
          }
          if (!values.description) {
            errors.description = "Required";
          }
          if (!values.videoIDs) {
            errors.videoIDs = "Required";
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
            <h3>Create Assignment</h3>
            <Row gutter={16}>
              <Col xs={24} sm={12}>
                <Field
                  label="Assignment Start Date"
                  name="dateStart"
                  htmlType="text"
                  component={DateField}
                  required={true}
                  showDayOfWeek={true}
                  size={"large"}
                  hideErrorText={false}
                />
              </Col>
              <Col xs={24} sm={12}>
                <Field
                  label="Assignment End Date"
                  name="dateEnd"
                  htmlType="text"
                  component={DateField}
                  showDayOfWeek={true}
                  required={true}
                  size={"large"}
                  hideErrorText={false}
                />
              </Col>
              <Col xs={24} sm={24}>
                <Field
                  label="Home Exercise Program"
                  name="title"
                  htmlType="text"
                  component={PlainTextField}
                  required={true}
                  size={"large"}
                  hideErrorText={false}
                />
              </Col>
              <Col xs={24} sm={24}>
                <Field
                  label="Home Program Instructions"
                  name="description"
                  htmlType="text"
                  component={TextAreaField}
                  required={true}
                  size={"large"}
                  hideErrorText={false}
                />
              </Col>
              <Col xs={24} sm={24}>
                <Field
                  label="Assigned Videos"
                  name="videoIDs"
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
            </Row>

            <Button
              type="primary"
              loading={submitting}
              htmlType="submit"
              block={true}
              size={"large"}
              disabled={invalid || pristine}
            >
              Create Assignment
            </Button>
            <Divider />
            {values.videoIDs && values.videoIDs.length > 0 && (
              <>
                <h3>Assigned Video Preview</h3>
                {renderAssignedVideos(values.videoIDs)}
              </>
            )}
          </form>
        )}
      />
    </Spin>
  );
}

export default CreateCarePlanAssignmentForm;
