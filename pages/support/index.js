import React from "react";
import styled from "styled-components";
import { Col, Row, Typography, Divider } from "antd";
import { NextSeo } from "next-seo";
import PageHeader from "@common/PageHeader";

import {
  TagsTwoTone,
  MobileTwoTone,
  IdcardTwoTone,
  BookTwoTone,
  ReconciliationTwoTone,
  SettingTwoTone,
  CalendarTwoTone,
  FileTextTwoTone,
  TagTwoTone,
  ContactsTwoTone,
  MessageTwoTone,
  DollarCircleTwoTone,
  MailTwoTone,
  VideoCameraTwoTone,
  UploadOutlined,
  PaperClipOutlined,
} from "@ant-design/icons";
import { useRecoilValue } from "recoil";
import { userState } from "@atoms";
import SupportArticleIcon from "@components/pages/support/SupportArticleIcon";
const { Title } = Typography;

const SupportWrapper = styled.div`
  max-width: ${(props) => props.theme.contentSize.tight};
  margin: auto;
  & h2 {
    text-align: left;
    font-weight: 800 !important;
    font-size: 24px;
    margin-bottom: 8px;
  }
`;

function Support() {
  const user = useRecoilValue(userState);

  return (
    <SupportWrapper>
      <NextSeo title="Knowledge Hub" />
      <PageHeader title="Knowledge Hub" />
      <Row gutter={[16, 16]}>
        <Col md={24}>
          <Title level={2}>Start</Title>
        </Col>
        <Col md={12}>
          <SupportArticleIcon
            href="/support/intro"
            title="Intro to Kidz-N-Motion"
            description="Follow one of our step-by-step guides and set your team up on Kidz-N-Motion."
            icon={<BookTwoTone />}
          />
        </Col>
      </Row>

      <Divider />
      {user.role === "GUARDIAN" && (
        <>
          <Row gutter={[16, 16]}>
            <Col md={24}>
              <Title level={2}>Platform Features</Title>
            </Col>

            {/* <Col md={12}>
              <SupportArticleIcon
                title="Viewing Assignments"
                href="/support/example-article"
                description="Follow one of our step-by-step guides and set your team up on Kidz-N-Motion."
                icon={<ReconciliationTwoTone />}
              /> 
            </Col>*/}
            <Col md={12}>
              <SupportArticleIcon
                title="Access Assigned Videos"
                href="/support/access-assigned-videos"
                description="Follow one of our step-by-step guides and set your team up on Kidz-N-Motion."
                icon={<VideoCameraTwoTone />}
              />
            </Col>
            <Col md={12}>
              <SupportArticleIcon
                title="Requesting Meetings"
                href="/support/request-meeting"
                description="Follow one of our step-by-step guides and set your team up on Kidz-N-Motion."
                icon={<CalendarTwoTone />}
              />
            </Col>
            <Col md={12}>
              <SupportArticleIcon
                title="Message Therapists"
                href="/support/message-therapist"
                description="Follow one of our step-by-step guides and set your team up on Kidz-N-Motion."
                icon={<MessageTwoTone />}
              />
            </Col>
          </Row>
          <Divider />
        </>
      )}
      {user.role === "THERAPIST" && (
        <>
          <Row gutter={[16, 16]}>
            <Col md={24}>
              <Title level={2}>Patient Management</Title>
            </Col>
            {/* <Col md={12}>
              <SupportArticleIcon
                title="Patient Bulk Import"
                href="/support/patient-import"
                description="Follow one of our step-by-step guides and set your team up on Kidz-N-Motion."
                icon={<IdcardTwoTone />}
              />
            </Col>  */}
            <Col md={12}>
              <SupportArticleIcon
                title="Invite Patients"
                href="/support/invite-patients"
                description="Follow one of our step-by-step guides and set your team up on Kidz-N-Motion."
                icon={<MailTwoTone />}
              />
            </Col>
            <Col md={12}>
              <SupportArticleIcon
                title="Create Assignments"
                href="/support/create-assignments"
                description="Follow one of our step-by-step guides and set your team up on Kidz-N-Motion."
                icon={<ReconciliationTwoTone />}
              />
            </Col>
            <Col md={12}>
              <SupportArticleIcon
                title="Patient Bulk Imports"
                href="/support/upload-patients"
                description="Follow one of our step-by-step guides and set your team up on Kidz-N-Motion."
                icon={<UploadOutlined />}
              />
            </Col>
            <Col md={12}>
              <SupportArticleIcon
                title="Status Reports"
                href="/support/status-reports"
                description="Follow one of our step-by-step guides and set your team up on Kidz-N-Motion."
                icon={<PaperClipOutlined />}
              />
            </Col>
            <Col md={12}>
              <SupportArticleIcon
                title="Create Meetings"
                href="/support/create-meetings"
                description="Follow one of our step-by-step guides and set your team up on Kidz-N-Motion."
                icon={<CalendarTwoTone />}
              />
            </Col>
            <Col md={12}>
              <SupportArticleIcon
                title="Manage Chatrooms"
                href="/support/manage-chatrooms"
                description="Follow one of our step-by-step guides and set your team up on Kidz-N-Motion."
                icon={<MessageTwoTone />}
              />
            </Col>
          </Row>
          <Divider />
        </>
      )}
      {user.ownedOrganization && (
        <>
          <Row gutter={[16, 16]}>
            <Col md={24}>
              <Title level={2}>Organization Management</Title>
            </Col>
            <Col md={12}>
              <SupportArticleIcon
                title="Set Up Your Organization"
                href="/support/organizational-settings"
                description="Follow one of our step-by-step guides and set your team up on Kidz-N-Motion."
                icon={<SettingTwoTone />}
              />
            </Col>
            <Col md={12}>
              <SupportArticleIcon
                title="Invite Team Members"
                href="/support/invite-team-members"
                description="Follow one of our step-by-step guides and set your team up on Kidz-N-Motion."
                icon={<MailTwoTone />}
              />
            </Col>
            <Col md={12}>
              <SupportArticleIcon
                title="Billing & Subscriptions"
                href="/support/billing-and-subscriptions"
                description="Follow one of our step-by-step guides and set your team up on Kidz-N-Motion."
                icon={<DollarCircleTwoTone />}
              />
            </Col>
          </Row>
          <Divider />
        </>
      )}
    </SupportWrapper>
  );
}

export default Support;
