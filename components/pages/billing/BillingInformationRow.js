import React, { useState, useEffect } from "react";
import {
  Col,
  Row,
  Typography,
  Divider,
  Space,
} from "antd";
import ContentCard from "@common/content/ContentCard";
const { Text } = Typography;

const BillingInformationRow = ({ title, description, children }) => {
  return (
    <>
      <Row gutter={16}>
        <Col xs={24} md={7}>
          <ContentCard modifiers={["naked", "noSidePadding"]}>
            <Space direction="vertical" size="small">
              <Text strong>{title}</Text>
              <Text type="secondary">{description}</Text>
            </Space>
          </ContentCard>
        </Col>
        <Col xs={24} md={{ span: 16, offset: 1 }}>
          {children}
        </Col>
      </Row>
      <Divider />
    </>
  );
};

export default BillingInformationRow;
