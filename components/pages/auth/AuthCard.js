import React from "react";
import styled from "styled-components";
import { Card, Typography, Divider } from "antd";
const { Title, Text, Link } = Typography;
import { NextSeo } from "next-seo";

const LoginCard = styled(Card)`
  width: 450px;
  & h3 {
    margin-bottom: 3px;
  }

  @media (max-width: ${(props) => props.theme.breakPoints.xs}) {
    width: 100%;
  }
  & button {
    margin-top: 6px;
  }
  .ant-tabs-large > .ant-tabs-nav .ant-tabs-tab {
    padding-top: 0px;
    padding-bottom: 8px;
  }
`;

const Logo = styled.div`
  text-align: left;
  margin-bottom: 10px;
  padding: 15px 0px;
  & img {
    width: 84px;
  }
`;

const AuthCard = ({ children, title, subTitle, pageTitle }) => {
  return (
    <LoginCard>
      <NextSeo title={pageTitle} />
      <Logo>
        <img alt="Kids In Motion Logo" src="/logos/LogoRect.png" />
      </Logo>
      <Title level={3}>{title}</Title>
      <Text type="secondary" style={{ marginBottom: "20px", display: "block" }}>
        {subTitle}
      </Text>
      {children}

      <Divider style={{ margin: "15px" }} />
      <Link
        style={{
          textAlign: "center",
          display: "block",
          paddingRight: "15px",
        }}
        target="_blank"
        rel="noopener noreferrer"
        href="/legal/privacy-policy"
      >
        Privacy Policy
      </Link>
    </LoginCard>
  );
};

export default AuthCard;
