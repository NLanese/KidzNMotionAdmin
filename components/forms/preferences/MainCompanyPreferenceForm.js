import React, { useState } from "react";
import { Form } from "react-final-form";
import { setIn } from "final-form";
import styled from "styled-components";
import { useRecoilValue } from "recoil";
import { userState } from "@atoms";

import ContentCard from "@common/content/ContentCard";
import {
  Typography,
  Divider,
  Space,
  Col,
  Row,
  Button,
  Spin,
  Statistic,
} from "antd";
const { Text } = Typography;

import { COMPANY_PREFERENCES_INITIAL_VALUES } from "@constants/forms";
import { convertGraphQLForCompanyPreferencesForm } from "@helpers/companyPreferences";

import CompanyDetailsFormChunk from "./CompanyDetailsFormChunk";
import LayoutSettingsFormChunk from "./LayoutSettingsFormChunk";
import NotificationSettingsFormChunk from "./NotificationSettingsFormChunk";
import ScoreCardRowFormChunk from "./ScoreCardRowFormChunk";
import ScoreCardRowFormChunkReversed from "./ScoreCardRowFormChunkReversed";

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

const ScoreCardHeaderRow = styled(Row)`
  .ant-typography {
    display: block;
    font-weight: 600;
    font-size: 15px;
    text-align: center;
    margin-bottom: 10px;
  }
`;

const ScoreCardFixedWidth = styled.div``;

function MainCompanyPreferenceForm({
  submitCompanyPreferenceData,
  initialValues,
}) {
  const user = useRecoilValue(userState);
  const [formLoading, setFormLoading] = useState(false);

  const handleCreateCompanyPreferences = async (formValues) => {
    setFormLoading(true);
    await submitCompanyPreferenceData(formValues);
    setFormLoading(false);
  };

  return (
    <Spin spinning={formLoading}>
      <Form
        onSubmit={handleCreateCompanyPreferences}
        keepDirtyOnReinitialize={true}
        initialValues={
          initialValues
            ? convertGraphQLForCompanyPreferencesForm(initialValues)
            : COMPANY_PREFERENCES_INITIAL_VALUES
        }
        mutators={{
          setValue: ([field, value], state, { changeValue }) => {
            changeValue(state, field, () => value);
          },
        }}
        validate={(values) => {
          let errors = {};
          const setError = (key, value) => {
            errors = setIn(errors, key, value);
          };

          // Company Details
          if (!values.companyDetails.name) {
            setError("companyDetails.name", "Requied");
          }
          if (!values.companyDetails.shortcode) {
            setError("companyDetails.shortcode", "Requied");
          }
          if (!values.companyDetails.timeZone) {
            setError("companyDetails.timeZone", "Requied");
          }

          // Layout Settings
          if (!values.layoutSettings.topCardLimits) {
            setError("layoutSettings.topCardLimits", "Requied");
          }
          if (!values.layoutSettings.smallCardLimits) {
            setError("layoutSettings.smallCardLimits", "Requied");
          }

          // Score Card Settings
          const scoreCardTypes = [
            "deliveryCompletionRateLimits",
            "photoOnDeliveryLimits",
            "ficoLimits",
            "seatbeltLimits",
            "speedingLimits",
            "distractionLimits",
            "signalLimits",
            "followLimits",
            "deliveryNotRecievedLimits",
          ];
          const scoreCardValueThresholdNames = ["fair", "good", "fantastic"];
          for (var i = 0; i < scoreCardTypes.length; i++) {
            for (var x = 0; x < scoreCardValueThresholdNames.length; x++) {
              if (
                !values.scoreCard[scoreCardTypes[i]][
                  scoreCardValueThresholdNames[x]
                ]
              ) {
                setError(
                  `scoreCard.${scoreCardTypes[i]}.${scoreCardValueThresholdNames[x]}`,
                  "Requied"
                );
              }
            }
          }

          // Notification Settings
          const notificationTypes = ["subpar", "fair", "great"];
          for (var i = 0; i < notificationTypes.length; i++) {
            if (!values.feedbackNotifications[notificationTypes[i]].message) {
              setError(
                `feedbackNotifications.${notificationTypes[i]}.message`,
                "Requied"
              );
            }
          }
          console.log("--------")
          console.log(errors)
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
            <legend>Login Form</legend>

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
                      Save Preferences
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
                    <Text strong>Company Details</Text>
                    <Text type="secondary">
                      These settings are public and will display to your driving
                      staff and other team members.
                    </Text>
                  </Space>
                </ContentCard>
              </Col>
              <Col xs={24} md={{ span: 18, offset: 1 }}>
                <ContentCard>
                  <Text strong>DSP Name Settings</Text>
                  <Divider
                    plain={true}
                    style={{ border: "none", margin: "10px 0px" }}
                  />
                  <CompanyDetailsFormChunk user={user} />
                </ContentCard>
              </Col>
            </Row>
            <Divider />

            <Row gutter={16}>
              <Col xs={24} md={5}>
                <ContentCard modifiers={["naked", "noSidePadding"]}>
                  <Space direction="vertical" size="small">
                    <Text strong>Scorecard Preferences</Text>
                    <Text type="secondary">
                      These settings are used to determine your driver
                      performance and rate them by their aggregated scores.
                    </Text>
                  </Space>
                </ContentCard>
              </Col>
              <Col xs={24} md={{ span: 18, offset: 1 }}>
                <ContentCard>
                  <Text strong>Scorecard</Text>
                  <Divider
                    plain={true}
                    style={{ border: "none", margin: "10px 0px" }}
                  />
                  <ScoreCardFixedWidth>
                    <ScoreCardHeaderRow
                      gutter={10}
                      justify="space-between"
                      align="middle"
                    >
                      <Col xs={3}>
                        <Text>Value</Text>
                      </Col>
                      <Col xs={7}>
                        <Text style={{ color: "#F79F1F" }}>Fair Rating</Text>
                      </Col>

                      <Col xs={7}>
                        <Text style={{ color: "#A3CB38" }}>Good Rating</Text>
                      </Col>
                      <Col xs={7}>
                        <Text style={{ color: "#009432" }}>
                          Fantastic Rating
                        </Text>
                      </Col>
                    </ScoreCardHeaderRow>
                    <ScoreCardRowFormChunk
                      type="deliveryCompletionRateLimits"
                      rowTitle="Driver Completion Rate"
                      formatIcon="%"
                      maxValue={100}
                      minValue={0}
                    />
                    <ScoreCardRowFormChunk
                      type="photoOnDeliveryLimits"
                      rowTitle="Photo On Delivery Rate"
                      formatIcon="%"
                      maxValue={100}
                      minValue={0}
                    />
                    <ScoreCardRowFormChunk
                      type="ficoLimits"
                      rowTitle="FICO Score"
                      minValue={300}
                      maxValue={850}
                    />
                    <ScoreCardRowFormChunkReversed
                      type="seatbeltLimits"
                      rowTitle="Seatbelt Off Rate"
                      minValue={0}
                      maxValue={100}
                    />
                    <ScoreCardRowFormChunkReversed
                      type="speedingLimits"
                      rowTitle="Speeding Rate"
                      minValue={0}
                      maxValue={100}
                    />
                    <ScoreCardRowFormChunkReversed
                      type="distractionLimits"
                      rowTitle="Distracted Driving Rate"
                      minValue={0}
                      maxValue={100}
                    />
                    <ScoreCardRowFormChunkReversed
                      type="signalLimits"
                      rowTitle="Signal Violations Rate"
                      minValue={0}
                      maxValue={100}
                    />
                    <ScoreCardRowFormChunkReversed
                      type="followLimits"
                      rowTitle="Close Follow Rate"
                      minValue={0}
                      maxValue={100}
                    />
                    <ScoreCardRowFormChunkReversed
                      type="deliveryNotRecievedLimits"
                      rowTitle="Delivery Not Received Rate"
                      minValue={0}
                      maxValue={100}
                    />
                  </ScoreCardFixedWidth>
                </ContentCard>
              </Col>
            </Row>
            <Divider />
            <Row gutter={16}>
              <Col xs={24} md={5}>
                <ContentCard modifiers={["naked", "noSidePadding"]}>
                  <Space direction="vertical" size="small">
                    <Text strong>Layout Settings</Text>
                    <Text type="secondary">
                      These settings will determine how the TOM App will display
                      driver performance cards and in what form.
                    </Text>
                  </Space>
                </ContentCard>
              </Col>
              <Col xs={24} md={{ span: 18, offset: 1 }}>
                <ContentCard>
                  <Text strong>Driver Performance Cards</Text>
                  <Divider
                    plain={true}
                    style={{ border: "none", margin: "10px 0px" }}
                  />
                  <LayoutSettingsFormChunk />
                </ContentCard>
              </Col>
            </Row>
            {user.role === "OWNER" && (
              <>
                <Divider />
                <Row gutter={16}>
                  <Col xs={24} md={5}>
                    <ContentCard modifiers={["naked", "noSidePadding"]}>
                      <Space direction="vertical" size="small">
                        <Text strong>Notification Settings</Text>
                        <Text type="secondary">
                          Here you will be able to customize how message
                          notifications are handled each week after a scorecard
                          has been uploaded.
                          <br />
                          <br />
                          Drivers with a "Great" or "Fantastic" Tier rating on
                          their scorecard will qualify for a "Great" Message.
                          Drivers with a "Good" or "Fair" tier will get the fair
                          message.
                          <br />
                          <br />
                          Anyone else will recieve the subpar message. You can
                          toggle each type of message to either auto-send after
                          the scorecard has been uploaded or to be sent only
                          after your approval or the approval of another admin
                        </Text>
                      </Space>
                    </ContentCard>
                  </Col>
                  <Col xs={24} md={{ span: 18, offset: 1 }}>
                    <ContentCard>
                      <Text strong>Supbar Notification Settings</Text>
                      <Divider
                        plain={true}
                        style={{ border: "none", margin: "10px 0px" }}
                      />
                      <NotificationSettingsFormChunk type="subpar" />
                    </ContentCard>
                    <ContentCard>
                      <Text strong>Fair Notification Settings</Text>
                      <Divider
                        plain={true}
                        style={{ border: "none", margin: "10px 0px" }}
                      />
                      <NotificationSettingsFormChunk type="fair" />
                    </ContentCard>
                    <ContentCard>
                      <Text strong>Great Notification Settings</Text>
                      <Divider
                        plain={true}
                        style={{ border: "none", margin: "10px 0px" }}
                      />
                      <NotificationSettingsFormChunk type="great" />
                    </ContentCard>
                  </Col>
                </Row>
                <Divider />
                <Row gutter={16}>
                  <Col xs={24} md={5}>
                    <ContentCard modifiers={["naked", "noSidePadding"]}>
                      <Space direction="vertical" size="small">
                        <Text strong>Organization Details</Text>
                        <Text type="secondary">
                          These settings are used to sign up and invite team
                          members into your organization
                        </Text>
                      </Space>
                    </ContentCard>
                  </Col>
                  <Col xs={24} md={{ span: 18, offset: 1 }}>
                    <ContentCard>
                      <Text strong>Owner Invite Settings</Text>
                      <Divider
                        plain={true}
                        style={{ border: "none", margin: "10px 0px" }}
                      />
                      <Statistic
                        title="Sign Up Token"
                        value={user.signUpToken}
                        size="small"
                      />
                      <br />
                      <b>Sign Up Link</b>
                      <p>https://dashboard.thetomapp.com/authentication/manager-invite?key={user.signUpToken}</p>
      
                    </ContentCard>
                  </Col>
                </Row>
              </>
            )}
          </form>
        )}
      />
    </Spin>
  );
}

export default MainCompanyPreferenceForm;
