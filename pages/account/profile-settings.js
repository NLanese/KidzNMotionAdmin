import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { message } from "antd";

import { NextSeo } from "next-seo";
import PageHeader from "@common/PageHeader";
import MainOrganizationSettingsForm from "@forms/organizationSettings/MainOrganizationSettingsForm";

import { userState } from "@atoms";
import { useRecoilState } from "recoil";

import { useMutation } from "@apollo/client";
import { EDIT_ORGANIZATION_SETTINGS, GET_USER } from "@graphql/operations";
import client from "@utils/apolloClient";

const IndexWrapper = styled.div`
  max-width: ${(props) => props.theme.contentSize.tight};
  margin: auto;
  .ant-typography strong {
    font-size: 16.5px;
  }
  @media (max-width: ${(props) => props.theme.breakPoints.sm}) {
    .ant-divider {
      margin: 2px 0px;
    }
  }
`;

function ProfileSettings() {
  const [user, setUser] = useRecoilState(userState);

  // Mutations
  const [editOrganizationSettings, {}] = useMutation(
    EDIT_ORGANIZATION_SETTINGS
  );

  const submitOrganizationSettings = async (formValues) => {
    await editOrganizationSettings({
      variables: {
        firstName: formValues.firstName,
        lastName: formValues.lastName,
        phoneNumber: formValues.phoneNumber,
        email: formValues.email
      },
    })
      .then(async (resolved) => {
        message.success("Profile Updated");

        // Get the full user object and set that to state
        await client
          .query({
            query: GET_USER,
          })
          .then(async (resolved) => {
            console.log(resolved);
            setUser(resolved.data.getUser);
          })
          .catch((error) => {
            message.error("Sorry, there was an error getting this information");
          });
      })
      .catch((error) => {
        message.error("Sorry, there was an error updating your profile");
      });
  };

  return (
    <IndexWrapper>
      <NextSeo title="Profile Settings" />
      <PageHeader title="Profile Settings" />
      <MainOrganizationSettingsForm
        initialValues={user}
        submitOrganizationSettings={submitOrganizationSettings}
      />
    </IndexWrapper>
  );
}

export default ProfileSettings;
