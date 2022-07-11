import React from "react";
import styled from "styled-components";
import { Typography, Divider, Row, Col, Button, Space } from "antd";
const { Title } = Typography;
import { LeftOutlined } from "@ant-design/icons";
import Router from "next/router";

const PageHeaderWrapper = styled.div`
  h3 {
    margin-bottom: 0px !important;
    margin-bottom: -2px !important;
  }
  & button {
    margin-right: 5px;
  }
  margin-bottom: ${(props) => props.noBottomBorder && "19px"};
  @media (max-width: ${(props) => props.theme.breakPoints.sm}) {
    .ant-space {
      margin-bottom: 10px;
    }
    .ant-divider-horizontal {
      margin-top: 8px;
    }

    margin-bottom: ${(props) => props.noBottomBorder && "5px"};
  }
`;

function PageHeader({
  title,
  noBottomBorder,
  backURL,
  createURL,
  createTitle,
}) {
  return (
    <PageHeaderWrapper noBottomBorder={noBottomBorder}>
      <Row gutter={16} justify="space-between" align="middle">
        <Col xs={20} sm={12} >
          <Space direction="horizontal" align="center">
            {backURL && (
              <Button
                type="ghost"
                onClick={() => Router.push(backURL)}
                size="middle"
                icon={<LeftOutlined />}
              />
            )}
            <Title level={3}>{title}</Title>
          </Space>
        </Col>
        <Col xs={4} sm={12}>
          {createURL && (
            <Button
              style={{ float: "right" }}
              type="ghost"
              onClick={() => Router.push(createURL)}
              size="middle"
            >
              {createTitle}
            </Button>
          )}
        </Col>
      </Row>
      {!noBottomBorder && <Divider />}
    </PageHeaderWrapper>
  );
}

export default PageHeader;
