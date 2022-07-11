import React from "react";
import styled from "styled-components";
import ContentCard from "@common/content/ContentCard";
import { NextSeo } from "next-seo";
import PageHeader from "@common/PageHeader";
import BasicLink from "@common/BasicLink";

const PrivacyPolicyWrapper = styled.div`
  background: ${(props) => props.theme.colors.backgroundColor};
  min-height: 100vh;
`;

const PrivacyPolicyInnerWrapper = styled.div`
  max-width: ${(props) => props.theme.contentSize.tight};
  margin: auto;
  background: ${(props) => props.theme.colors.backgroundColor};
  padding: 40px 20px;
  & img {
    text-align: center;
    margin: auto;
    display: block;
    width: 110px;
    margin-bottom: 30px;
  }
`;

function PrivacyPolicy() {
  return (
    <PrivacyPolicyWrapper>
      <NextSeo title="Privacy Policy" />
      <PrivacyPolicyInnerWrapper>
        <BasicLink href="/">
          <img alt="Kids In Motion Logo" src="/logos/LogoSVG.svg" />
        </BasicLink>
        <PageHeader title="Privacy Policy" />
        <ContentCard>
         
        </ContentCard>
      </PrivacyPolicyInnerWrapper>
    </PrivacyPolicyWrapper>
  );
}

export default PrivacyPolicy;
