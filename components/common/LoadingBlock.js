import React from "react";
import styled from "styled-components";
import { Skeleton, Space, Row, Col } from "antd";
import ContentCard from "@common/content/ContentCard";

const LoadingContainer = styled.div`
  .ant-skeleton-content .ant-skeleton-title {
    height: 30px;
  }
  .ant-card-body .ant-skeleton-title {
    display: none;
  }
  .ant-skeleton-content .ant-skeleton-title + .ant-skeleton-paragraph {
    margin-top: 0px;
    margin-bottom: 0px;
  }
  .ant-card {
    margin: 20px 0px;
  }
  .ant-skeleton-content .ant-skeleton-paragraph > li {
    height: 12px;
  }
`;

const BodyLoading = styled.div`
  .ant-skeleton-title {
    display: none;
  }
`;

function LoadingBlock({ table }) {
  if (table) {
    return (
      <LoadingContainer>
        <BodyLoading>
          <ContentCard>
            <Row gutter={16} justify="space-between" align="middle">
              <Col sm={24} md={12}>
                <Space>
                  <Skeleton.Input
                    active={true}
                    shape={"round"}
                    size="small"
                    block={true}
                  />
             
                </Space>
              </Col>
              <Col sm={24} md={2}>
                <Space >
                  <Skeleton.Button
                    active={true}
                    shape={"round"}
                    size="small"
                    block={true}
                  />
                </Space>
              </Col>
            </Row>
            <br />
            <Skeleton active={true} paragraph={{ rows: 4, width: "100%" }} />
          </ContentCard>
  
        </BodyLoading>
      </LoadingContainer>
    );
  }

  return (
    <LoadingContainer>
      <Skeleton active={true} paragraph={{ rows: 1, width: "100px" }} />
      <BodyLoading>
        <ContentCard>
          <Skeleton active={true} paragraph={{ rows: 2, width: "100%" }} />
        </ContentCard>
        <Skeleton active={true} paragraph={{ rows: 3, width: "100px" }} />
        <ContentCard>
          <Skeleton active={true} paragraph={{ rows: 2, width: "100%" }} />
        </ContentCard>
        <Skeleton active={true} paragraph={{ rows: 3, width: "100px" }} />
        <ContentCard>
          <Skeleton active={true} paragraph={{ rows: 2, width: "100%" }} />
        </ContentCard>
      </BodyLoading>
    </LoadingContainer>
  );
}

export default LoadingBlock;
