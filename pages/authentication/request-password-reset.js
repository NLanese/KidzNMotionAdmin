import React from "react";
import PasswordResetRequestForm from "@forms/auth/PasswordResetRequestForm";
import {  Typography } from "antd";
const { Text } = Typography;
import BasicLink from "@common/BasicLink";
import AuthCard from "@components/pages/auth/AuthCard";


function RequestPasswordReset() {
  return (
    <AuthCard
      pageTitle="Request Password Reset"
      title="Reset Password"
      subTitle="We’ll email instructions on how to reset it."
    >
      <>
        <PasswordResetRequestForm />
        <BasicLink href="/authentication/login">
          <Text
            style={{
              textAlign: "left",
              marginTop: "10px",
              textDecoration: "underline",
              display: "block",
            }}
            type="secondary"
          >
            Return to login
          </Text>
        </BasicLink>
      </>
    </AuthCard>
  );
}

export default RequestPasswordReset;
