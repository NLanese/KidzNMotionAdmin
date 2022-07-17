import React, { useEffect, useState } from "react";
import styled from "styled-components";
import Router from "next/router";

import { NextSeo } from "next-seo";
import PageHeader from "@common/PageHeader";
import MainOrganizationSettingsForm from "@forms/organizationSettings/MainOrganizationSettingsForm";

import { userState } from "@atoms";
import { useRecoilValue } from "recoil";

const IndexWrapper = styled.div`
  max-width: ${(props) => props.theme.contentSize.standard};
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

function OrganizationSettings() {
  const user = useRecoilValue(userState);

  const submitOrganizationSettings = async (formValues) => {};

  useEffect(() => {
    if (!user.ownedOrganization) {
      Router.push("/");
    }
  }, []);

  return (
    <IndexWrapper>
      <NextSeo title="Organization Settings" />
      <PageHeader title="Organization Settings" />
      <MainOrganizationSettingsForm
        initialValues={user.ownedOrganization}
        submitOrganizationSettings={submitOrganizationSettings}
      />
    </IndexWrapper>
  );
}

export default OrganizationSettings;
