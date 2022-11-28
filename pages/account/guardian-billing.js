import React, { useEffect, useState } from "react";
import styled from "styled-components";

import { NextSeo } from "next-seo";
import PageHeader from "@common/PageHeader";

import { userState } from "@atoms";
import { useRecoilState } from "recoil";
import LoadingBlock from "@common/LoadingBlock";

import { useMutation } from "@apollo/client";
import {
  GENERATE_SOLO_GUARDIAN_CHECKOUT_LINK,
  GENERATE_SOLO_GUARDIAN_PORTAL_LINK,
} from "@graphql/operations";

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

function GuardianBilling() {
  const [user, setUser] = useRecoilState(userState);

  // Mutations
  const [generateSoloGuardianCheckoutLink, {}] = useMutation(
    GENERATE_SOLO_GUARDIAN_CHECKOUT_LINK
  );
  const [generateSoloGuardianPortalLink, {}] = useMutation(
    GENERATE_SOLO_GUARDIAN_PORTAL_LINK
  );

  const generateCheckoutURL = async () => {
    await generateSoloGuardianCheckoutLink()
      .then(async (resolved) => {
        window.location = resolved.data.generateSoloGuardianCheckoutLink;
      })

      .catch((error) => {});
  };

  const generatePortalURL = async () => {
    await generateSoloGuardianPortalLink()
      .then(async (resolved) => {
        // console.log(resolved);
        window.location = resolved.data.generateSoloGuardianPortalLink;
      })

      .catch((error) => {});
  };
  useEffect(() => {
    if (!user.soloStripeSubscriptionID) {
      generateCheckoutURL();
    }
    if (user.soloStripeSubscriptionID) {
      generatePortalURL();
    }
  }, []);

  return (
    <IndexWrapper>
      <NextSeo title="Guardian Billing" />
      <PageHeader title="Guardian Billing" />
      <LoadingBlock />
    </IndexWrapper>
  );
}

export default GuardianBilling;
