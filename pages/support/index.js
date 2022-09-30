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
            href="/support/example-article"
            title="Intro to Kidz-N-Motion"
            description="Follow one of our step-by-step guides and set your team up on Kidz-N-Motion."
            icon={<BookTwoTone />}
          />
        </Col>
      </Row>

      <Divider />
      {user.role === "GUARDIAN"  && (
        <>
          <Row gutter={[16, 16]}>
            <Col md={24}>
              <Title level={2}>Platform Features</Title>
            </Col>
          
           
            <Col md={12}>
              <SupportArticleIcon
                title="Viewing Assignments"
                href="/support/example-article"
                description="Follow one of our step-by-step guides and set your team up on Kidz-N-Motion."
                icon={<ReconciliationTwoTone />}
              />
            </Col>
            <Col md={12}>
              <SupportArticleIcon
                title="Access Assigned Videos"
                href="/support/example-article"
                description="Follow one of our step-by-step guides and set your team up on Kidz-N-Motion."
                icon={<VideoCameraTwoTone />}
              />
            </Col>
            <Col md={12}>
              <SupportArticleIcon
                title="Requesting Meetings"
                href="/support/example-article"
                description="Follow one of our step-by-step guides and set your team up on Kidz-N-Motion."
                icon={<CalendarTwoTone />}
              />
            </Col>
            <Col md={12}>
              <SupportArticleIcon
                title="Message Therapists"
                href="/support/example-article"
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
            <Col md={12}>
              <SupportArticleIcon
                title="Patient Import"
                href="/support/example-article"
                description="Follow one of our step-by-step guides and set your team up on Kidz-N-Motion."
                icon={<IdcardTwoTone />}
              />
            </Col>
            <Col md={12}>
              <SupportArticleIcon
                title="Invite Patients"
                href="/support/example-article"
                description="Follow one of our step-by-step guides and set your team up on Kidz-N-Motion."
                icon={<MailTwoTone />}
              />
            </Col>
            <Col md={12}>
              <SupportArticleIcon
                title="Create Assignments"
                href="/support/example-article"
                description="Follow one of our step-by-step guides and set your team up on Kidz-N-Motion."
                icon={<ReconciliationTwoTone />}
              />
            </Col>
            <Col md={12}>
              <SupportArticleIcon
                title="Create Meetings"
                href="/support/example-article"
                description="Follow one of our step-by-step guides and set your team up on Kidz-N-Motion."
                icon={<CalendarTwoTone />}
              />
            </Col>
            <Col md={12}>
              <SupportArticleIcon
                title="Manage Chatrooms"
                href="/support/example-article"
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
                href="/support/example-article"
                description="Follow one of our step-by-step guides and set your team up on Kidz-N-Motion."
                icon={<SettingTwoTone />}
              />
            </Col>
            <Col md={12}>
              <SupportArticleIcon
                title="Invite Team Members"
                href="/support/example-article"
                description="Follow one of our step-by-step guides and set your team up on Kidz-N-Motion."
                icon={<MailTwoTone />}
              />
            </Col>
            <Col md={12}>
              <SupportArticleIcon
                title="Billing & Subscriptions"
                href="/support/example-article"
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
