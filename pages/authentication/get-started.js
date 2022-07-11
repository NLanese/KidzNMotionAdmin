import React, { useState } from "react";

import { Typography, Divider, Tabs } from "antd";
import { CrownOutlined, UserOutlined } from "@ant-design/icons";
import UserSignUpForm from "@forms/auth/UserSignUpForm";
import BasicLink from "@common/BasicLink";
import AuthCard from "@components/pages/auth/AuthCard";

const { Text } = Typography;
const { TabPane } = Tabs;
// ESelect account tyupe
// Setps for payment
// Select payment

function GetStarted() {

  return (
    <AuthCard
      pageTitle="Get Started"
      title="Get Started"
    >
      <UserSignUpForm type="OWNER" />
      <Divider style={{ margin: "15px" }} />
      <BasicLink href="/authentication/login">
        <Text
          style={{
            textAlign: "left",
            marginTop: "10px",
            display: "block",
          }}
          type="secondary"
        >
          Aleady have an account?{" "}
          <BasicLink href="/authentication/login">
            <span style={{ textDecoration: "underline" }}>Login</span>
          </BasicLink>
        </Text>
      </BasicLink>
      <BasicLink href="/authentication/manager-invite">
        <Text
          style={{
            textAlign: "left",
            marginTop: "10px",
            display: "block",
          }}
          type="secondary"
        >
          Signing up as a manager of another account?{" "}
          <BasicLink href="/authentication/manager-invite">
            <span style={{ textDecoration: "underline" }}>Sign up here</span>
          </BasicLink>
        </Text>
      </BasicLink>
    </AuthCard>
  );
}

export default GetStarted;
