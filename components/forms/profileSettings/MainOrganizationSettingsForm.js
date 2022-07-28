import React, { useState } from "react";
import { Form } from "react-final-form";
import { setIn } from "final-form";
import styled from "styled-components";
import { useRecoilValue } from "recoil";
import { userState } from "@atoms";

import ContentCard from "@common/content/ContentCard";
import { Typography, Divider, Space, Col, Row, Button, Spin } from "antd";
const { Text } = Typography;

import ContactInformationFormChunk from "./ContactInformationFormChunk";

const SubmitButtonContainer = styled.div`
  background: linear-gradient(
    180deg,
    rgba(246, 246, 247, 0.7) 80%,
    rgba(246, 246, 247, 0) 100%
  );
  padding: 10px 5px 10px;
  backdrop-filter: blur(10px) !important;
  position: sticky;
  top: 65px;
  z-index: 9;
  @media (max-width: ${(props) => props.theme.breakPoints.md}) {
    margin-top: 15px;
    top: 57px;
  }
`;


function MainOrganizationSettingsForm({
  submitOrganizationSettings,
  initialValues,
}) {
  console.log(initialValues)
  const user = useRecoilValue(userState);
  const [formLoading, setFormLoading] = useState(false);

  const handleCreateCompanyPreferences = async (formValues) => {
    setFormLoading(true);
    formValues.username = formValues.email
    await submitOrganizationSettings(formValues);
    setFormLoading(false);
  };

  return (
    <Spin spinning={formLoading}>
      <Form
        onSubmit={handleCreateCompanyPreferences}
        keepDirtyOnReinitialize={true}
        initialValues={initialValues}
        mutators={{
          setValue: ([field, value], state, { changeValue }) => {
            changeValue(state, field, () => value);
          },
        }}
        validate={(values) => {
          let errors = {};

          if (!values.firstName) {
            errors.firstName = "Required";
          }
          if (!values.lastName) {
            errors.lastName = "Required";
          }
          if (!values.email) {
            errors.email = "Required";
          }

          if (!values.phoneNumber) {
            errors.phoneNumber = "Required";
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
                form.reset();
              });
            }}
          >
            <legend>Organization Settings Form</legend>

            <SubmitButtonContainer>
              <Row gutter={16} justify="end" align="middle">
                <Col>
                  <Space direction="horizontal">
                    {!pristine && (
                      <Button
                        type="ghost"
                        block={true}
                        size="large"
                        disabled={pristine}
                        onClick={() => {
                          form.setConfig("keepDirtyOnReinitialize", false);
                          form.reset();
                          form.setConfig("keepDirtyOnReinitialize", true);
                        }}
                      >
                        Discard
                      </Button>
                    )}
                    <Button
                      type="primary"
                      loading={submitting}
                      htmlType="submit"
                      block={true}
                      size={"large"}
                      disabled={invalid || pristine}
                    >
                      Save Settings
                    </Button>
                  </Space>
                </Col>
              </Row>
            </SubmitButtonContainer>

            <br />
            <Row gutter={16}>
              <Col xs={24} md={5}>
                <ContentCard modifiers={["naked", "noSidePadding"]}>
                  <Space direction="vertical" size="small">
                    <Text strong>Profile Details</Text>
                    <Text type="secondary">
                      These settings will display to your organization
                    </Text>
                  </Space>
                </ContentCard>
              </Col>
              <Col xs={24} md={{ span: 18, offset: 1 }}>
                <ContentCard>
                  <Text strong>Contact Settings</Text>
                  <Divider
                    plain={true}
                    style={{ border: "none", margin: "10px 0px" }}
                  />
                  <ContactInformationFormChunk user={user} />
                </ContentCard>
              </Col>
            </Row>
          </form>
        )}
      />
    </Spin>
  );
}

export default MainOrganizationSettingsForm;
