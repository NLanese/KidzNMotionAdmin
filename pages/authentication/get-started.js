import React from "react";
import { Typography, Divider, Button } from "antd";
const { Text, Title } = Typography;
import BasicLink from "@common/BasicLink";
import AuthCard from "@components/pages/auth/AuthCard";

import UserSignUpForm from "@forms/auth/UserSignUpForm";

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }
  
function SelectAccountType() {
  return (
    <>
      <Title level={5} style={{ margin: "0px" }}>
        Guardian
      </Title>
      <Text type="secondary">
        Select if you are signing up as a guardian to a child.
      </Text>
      <BasicLink href="/authentication/get-started?role=GUARDIAN">
        <Button block type="primary">
          Sign Up As Guardian
        </Button>
      </BasicLink>
      <Divider />
      <Title level={5} style={{ margin: "0px" }}>
        Therapist
      </Title>
      <Text type="secondary">
        Select if you are going to be managing patient accounts and setting
        their care plans.
      </Text>
      <BasicLink href="/authentication/get-started?role=THERAPIST">
        <Button block type="primary">
          Sign Up As Therapist
        </Button>
      </BasicLink>
      <Divider />
      <Title level={5} style={{ margin: "0px" }}>
        School Admin
      </Title>
      <Text type="secondary">
        Select if you are signing up as a school organization.
      </Text>
      <BasicLink href="/authentication/get-started?role=ADMIN">
        <Button block type="primary">
          Sign Up As School Admin
        </Button>
      </BasicLink>
      <Divider />
    </>
  );
}

function GetStarted() {
  const urlSearchParams = new URLSearchParams(window.location.search);
  const role = urlSearchParams.get("role");

  const renderAccountTypeForm = () => {
    if (!role) {
      return <SelectAccountType />;
    } else {
      return <UserSignUpForm role={role}/>;
    }
  };

  const renderBackLink = () => {
    if (!role) {
      return (
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
      );
    } else {
      return (
        <BasicLink href="/authentication/get-started">
          <Text
            style={{
              textAlign: "left",
              marginTop: "10px",
              textDecoration: "underline",
              display: "block",
            }}
            type="secondary"
          >
            Cancel, go back to account type select
          </Text>
        </BasicLink>
      );
    }
  };

  const renderPageTitle = () => {
    if (!role) {
      return "Select Account Type";
    } else {
      return capitalizeFirstLetter(role.toLowerCase()) + " Sign Up";
    }
  };


  return (
    <AuthCard
      title={renderPageTitle()}
      pageTitle={renderPageTitle()}
    >
      <>
        {renderAccountTypeForm()}
        {renderBackLink()}
      </>
    </AuthCard>
  );
}

export default GetStarted;
