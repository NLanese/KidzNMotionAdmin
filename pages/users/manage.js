import React, { useEffect, useState } from "react";
import styled from "styled-components";

import { NextSeo } from "next-seo";
import PageHeader from "@common/PageHeader";
import ContentCard from "@common/content/ContentCard";
import OrganizationUserTable from "@pages/users/OrganizationUserTable";

import { userState } from "@atoms";
import { useRecoilState } from "recoil";
import Router from "next/router";

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

function ManageUsers() {
  const [user, setUser] = useRecoilState(userState);

  useEffect(() => {
    if (!user.ownedOrganization) {
      Router.push("/");
    }
  }, []);

  return (
    <IndexWrapper>
      <NextSeo title="Manage Users" />
      <PageHeader
        title="Manage Users"
        createURL="/users/manage?invite=true"
        createTitle="Invite Users"
      />
      <ContentCard modifiers={["tightPadding"]}>
        {/* <OrganizationUserTable
          organizationUsers={user.ownedOrganization.organizationUsers}
        /> */}
      </ContentCard>
    </IndexWrapper>
  );
}

export default ManageUsers;
