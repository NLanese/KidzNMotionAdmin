import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { Divider, message } from "antd";

import { NextSeo } from "next-seo";
import PageHeader from "@common/PageHeader";
import MainOrganizationSettingsForm from "@forms/profileSettings/MainOrganizationSettingsForm";
import ColorThemeSettingsForm from "@forms/profileSettings/ColorThemeSettingsForm";
import AvatarSettingsForm from "@forms/profileSettings/AvatarSettingsForm";
import { userState } from "@atoms";
import { useRecoilState } from "recoil";

import { useMutation } from "@apollo/client";
import { EDIT_USER, GET_USER } from "@graphql/operations";
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
  const [editUser, {}] = useMutation(EDIT_USER);

  const submitUserProfile = async (formValues) => {
    await editUser({
      variables: {
        firstName: formValues.firstName,
        lastName: formValues.lastName,
        phoneNumber: formValues.phoneNumber,
        email: formValues.email,
        username: formValues.username,
        title: formValues.title,
      },
    })
      .then(async (resolved) => {
        message.success("Profile Updated");

        // Get the full user object and set that to state
        await client
          .query({
            query: GET_USER,
            fetchPolicy: "network-only",
          })
          .then(async (resolved) => {
            // console.clear()
            // // console.log(resolved);
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
        submitOrganizationSettings={submitUserProfile}
      />
      <Divider />
      <ColorThemeSettingsForm
        initialValues={user}
        submitOrganizationSettings={submitUserProfile}
      />
      <Divider />
      <AvatarSettingsForm
        initialValues={user}
        submitOrganizationSettings={submitUserProfile}
      />
    </IndexWrapper>
  );
}

export default ProfileSettings;
