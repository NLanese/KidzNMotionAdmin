import React from "react";
import styled from "styled-components";
import ContentCard from "@common/content/ContentCard";
import { NextSeo } from "next-seo";
import BasicLink from "@common/BasicLink";

const PrivacyPolicyWrapper = styled.div`
  background: white;
  min-height: 100vh;
`;

const PrivacyPolicyInnerWrapper = styled.div`
  max-width: 1500px;
  margin: auto;
  background: white;
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
          <img alt="Kidz-N-Motion Logo" src="/logos/LogoSVG.svg" />
        </BasicLink>
 
        <ContentCard>
         
        </ContentCard>
      </PrivacyPolicyInnerWrapper>
    </PrivacyPolicyWrapper>
  );
}

export default PrivacyPolicy;
