import React from "react";
import styled from "styled-components";
import {
  Col,
  Row,
  Typography,
  Space,
  Divider,
  Statistic,
  Alert,
  Button,
} from "antd";
import ContentCard from "@common/content/ContentCard";
import PageHeader from "@common/PageHeader";
import { userState } from "@atoms";
import { useRecoilValue } from "recoil";

import {
  InfoCircleOutlined,
  CommentOutlined,
  TableOutlined,
  ContainerOutlined,
} from "@ant-design/icons";

import BasicLink from "@common/BasicLink";

const { Text, Title, Link } = Typography;

const IndexWrapper = styled.div`
  max-width: 800px;
  margin: auto;
`;

function Index() {
  const user = useRecoilValue(userState);

  return (
    <IndexWrapper>
      <PageHeader title="Welcome To Kidz-N-Motion " />
      <Row gutter={[16, 3]}>
        <Col xs={24} sm={24}>
          <ContentCard>
            <Space direction="vertical">
              <Title style={{ margin: "0px" }} level={5}>
                <InfoCircleOutlined /> Learn how to make the most out of
                Kidz-N-Motion
              </Title>
              <Text>
                We've got the tutorials for the functionality and features to
                answer your questions.
              </Text>
              <BasicLink href="/support">
                <Link type="link">Learn more about our tutorial</Link>
              </BasicLink>
            </Space>
          </ContentCard>
        </Col>
        {/* <Col xs={24} sm={12}>
          <ContentCard>
            <Space direction="vertical">
              <Title style={{ margin: "0px" }} level={5}>
                <CommentOutlined /> Stay in touch with the people that matter most
              </Title>
              <BasicLink href="/">
                <Link type="link">Get started</Link>
              </BasicLink>
            </Space>
          </ContentCard>
        </Col>
        <Col xs={24} sm={12}>
          <ContentCard>
            <Space direction="vertical">
              <Title style={{ margin: "0px" }} level={5}>
                <ContainerOutlined /> Keep your details and contact information to date
              </Title>
              <BasicLink href="/">
                <Link type="link">Get started</Link>
              </BasicLink>
            </Space>
          </ContentCard>
        </Col> */}
      </Row>
    </IndexWrapper>
  );
}

export default Index;
