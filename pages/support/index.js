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
  MessageTwoTone,
  CalendarTwoTone,
  FileTextTwoTone,
  TagTwoTone,
  ContactsTwoTone
} from "@ant-design/icons";

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
            title="Intro to Tom Admin"
            description="Follow one of our step-by-step guides and set your team up on Tom App."
            icon={<BookTwoTone />}
          />
        </Col>
        <Col md={12}>
          <SupportArticleIcon
            title="Intro to Tom App"
            href="/support/example-article"
            description="Follow one of our step-by-step guides and set your team up on Tom App."
            icon={<MobileTwoTone />}
          />
        </Col>
      </Row>
      <Divider />
      <Row gutter={[16, 16]}>
        <Col md={24}>
          <Title level={2}>Import</Title>
        </Col>
        <Col md={12}>
          <SupportArticleIcon
            title="Driver Import"
            href="/support/example-article"
            description="Follow one of our step-by-step guides and set your team up on Tom App."
            icon={<IdcardTwoTone />}
          />
        </Col>
        <Col md={12}>
          <SupportArticleIcon
            title="Asset Import"
            href="/support/example-article"
            description="Follow one of our step-by-step guides and set your team up on Tom App."
            icon={<TagsTwoTone />}
          />
        </Col>
        <Col md={12}>
          <SupportArticleIcon
            title="Scorecard Import"
            href="/support/example-article"
            description="Follow one of our step-by-step guides and set your team up on Tom App."
            icon={<FileTextTwoTone />}
          />
        </Col>
      </Row>
      <Divider />
      <Row gutter={[16, 16]}>
        <Col md={24}>
          <Title level={2}>Manage</Title>
        </Col>
        <Col md={12}>
          <SupportArticleIcon
            title="Driver Management"
            href="/support/example-article"
            description="Follow one of our step-by-step guides and set your team up on Tom App."
            icon={<ContactsTwoTone />}
          />
        </Col>
        <Col md={12}>
          <SupportArticleIcon
            title="Asset Management"
            href="/support/example-article"
            description="Follow one of our step-by-step guides and set your team up on Tom App."
            icon={<TagTwoTone />}
          />
        </Col>
        <Col md={12}>
          <SupportArticleIcon
            title="Performance Managment"
            href="/support/example-article"
            description="Follow one of our step-by-step guides and set your team up on Tom App."
            icon={<ReconciliationTwoTone />}
          />
        </Col>
        <Col md={12}>
          <SupportArticleIcon
            title="Shift Managment"
            href="/support/example-article"
            description="Follow one of our step-by-step guides and set your team up on Tom App."
            icon={<CalendarTwoTone />}
          />
        </Col>
        <Col md={12}>
          <SupportArticleIcon
            title="Communication Managment"
            href="/support/example-article"
            description="Follow one of our step-by-step guides and set your team up on Tom App."
            icon={<MessageTwoTone />}
          />
        </Col>
      </Row>
      <Divider />
    </SupportWrapper>
  );
}

export default Support;
