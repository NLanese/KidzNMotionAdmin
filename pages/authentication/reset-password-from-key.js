import React, { useEffect } from "react";
import PasswordResetFromKeyForm from "@forms/auth/PasswordResetFromKeyForm";
import { Typography, message } from "antd";
const { Text } = Typography;
import AuthCard from "@components/pages/auth/AuthCard";
import BasicLink from "@common/BasicLink";
import Router from "next/router";
import { withRouter } from "next/router";

function ResetPassowrd({ router }) {
  useEffect(() => {
    const urlSearchParams = new URLSearchParams(window.location.search);
    const passwordResetKey = urlSearchParams.get("key");

    if (!passwordResetKey) {
      message.error("Invalid password reset key, please try again");
      Router.push("/authentication/request-password-reset");
    }
  }, []);

  return (
    <AuthCard
      title={router.query.create ? "Create Account Password" : "Reset Password"}
      pageTitle={router.query.create ? "Create Account Password" : "Reset Password"}
    >
      <PasswordResetFromKeyForm />
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
          Cancel, return to login
        </Text>
      </BasicLink>
    </AuthCard>
  );
}

export default withRouter(ResetPassowrd);
