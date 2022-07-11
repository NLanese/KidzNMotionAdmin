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

  const getSignUpToken = () => {
    const urlSearchParams = new URLSearchParams(window.location.search);
    const key = urlSearchParams.get("key");
    return key
  }

  return (
    <AuthCard
      pageTitle="Manager Sign Up"
      title="Manager Sign Up"
    >
      <UserSignUpForm type="MANAGER" 
        initialValues={{
          signupToken: getSignUpToken()
        }}
      />
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
    </AuthCard>
  );
}

export default GetStarted;
