import React from "react";
import styled from "styled-components";
import { Col, Row, Divider, Spin, Steps, Progress } from "antd";
import ContentCard from "@common/content/ContentCard";
import { NextSeo } from "next-seo";
import PageHeader from "@common/PageHeader";
const { Step } = Steps;

const UploadLayoutWrapper = styled.div`
  max-width: ${(props) => props.wideLayout ? props.theme.contentSize.wide : props.theme.contentSize.extraTight};
  margin: auto;
  transition: ${(props) => props.theme.transitions.standard};
`;

const UploadLayout = ({
  children,
  uploadingProgress,
  loading,
  currentStep,
  wideLayout,
  title
}) => {
  return (
    <UploadLayoutWrapper wideLayout={wideLayout}>
      <NextSeo title={title} />
      <PageHeader title={title} />
      {uploadingProgress && (
        <>
          <Progress
            strokeColor={{
              "0%": "#1890ff",
              "100%": "#2d4499",
            }}
            percent={parseInt(uploadingProgress * 100)}
          />
          <br />
          <br />
        </>
      )}
      <Row gutter={16}>
        <Col xs={24}>
          <Spin
            spinning={loading}
            size="large"
            tip="Please do not reload or leave this page."
          >
            <ContentCard>
              <Steps current={currentStep}>
                <Step title="Upload File" />
                <Step title="Review & Submit" />
                <Step title="Upload Complete" />
              </Steps>
              <Divider />

              {children}
            </ContentCard>
          </Spin>
        </Col>
      </Row>
    </UploadLayoutWrapper>
  );
};

export default UploadLayout;
