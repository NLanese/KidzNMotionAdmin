import React from "react";
import LoginForm from "@forms/auth/LoginForm";
import { Typography, Divider } from "antd";
const { Text } = Typography;
import BasicLink from "@common/BasicLink";
import AuthCard from "@components/pages/auth/AuthCard";

function Login() {
  return (
    <AuthCard pageTitle="Login" title="Login" subTitle="Continue to Kidz-N-Motion">
      <>
        <LoginForm />
        <BasicLink href="/authentication/request-password-reset">
          <Text
            style={{
              textAlign: "left",
              marginTop: "10px",
              textDecoration: "underline",
              display: "block",
            }}
            type="secondary"
          >
            Lost your password?
          </Text>
        </BasicLink>
        <Divider style={{ margin: "15px" }} />
        <Text type="secondary">
          Don't have a Kidz-N-Motion account?{" "}
          <BasicLink href="/authentication/get-started">
            <span style={{ textDecoration: "underline" }}>Get Started</span>
          </BasicLink>
        </Text>
      </>
    </AuthCard>
  );
}

export default Login;
