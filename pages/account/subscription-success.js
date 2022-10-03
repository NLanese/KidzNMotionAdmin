import React, { useEffect, useState } from "react";
import styled from "styled-components";

import { NextSeo } from "next-seo";
import { withRouter } from "next/router";
import Router from "next/router"
import { updateSoloGuardianSubscription } from "@helpers/billing";
import AuthCard from "@components/pages/auth/AuthCard";
import { Button } from "antd";

const AuthFormBackground = styled.div`
  position: fixed;
  z-index: 2;
  width: 100%;
  height: 100%;
  background: rgb(24, 144, 255);
  background:  linear-gradient(155deg,rgb(73 163 246) 25%,rgb(15 106 191) 100%);

  background-image: linear-gradient(
      to bottom,
      rgba(0, 0, 0, 0.65),
      rgba(0, 0, 0, 0.63)
    ),
    url("https://images.ctfassets.net/z3ixs6i8tjtq/3XDihX4PPPsfYPjIvZP8Ny/33b0285ad5a7d1ac848f6e091227493d/background2.png?w=2000&q=60");
  background-repeat: no-repeat;
  background-size: cover;
  background-position: top;
`;

const AuthContentWrapper = styled.main`
  position: relative;
  display: flex;
  min-height: 100vh;
  z-index: 3;
  display: flex;
  align-items: center;
  @media (max-width: ${(props) => props.theme.breakPoints.md}) {
    justify-content: center;
  }
  @media (max-width: ${(props) => props.theme.breakPoints.xs}) {
    align-items: flex-start;
  }
`;

const AuthPageContent = styled.div`
  margin-left: 10vw;
  margin-right: 10vw;
  margin-top: 40px;
  margin-bottom: 40px;
  @media (max-width: ${(props) => props.theme.breakPoints.xs}) {
    margin-top: 10vw;
    margin-right: 5vw;
    margin-left: 5vw;
  }
`;
function SubscriptionSuccess({ router }) {
  // Mutations

  const updatePaymentStatus = async (userID, sessionID) => {
    await updateSoloGuardianSubscription(userID, sessionID);
  };

  useEffect(() => {
    let userID = router.query.user_id;
    let sessionID = router.query.session_id;

    updatePaymentStatus(userID, sessionID);
  }, [router]);

  return (
    <>
      <AuthFormBackground />
      <AuthContentWrapper>
        <AuthPageContent>
          <NextSeo title="Subscription Success" />
          <AuthCard
            pageTitle="Subscription Updated!"
            title="Subscription Updated"
            subTitle="Thanks for joining the Kidz-N-Motion family"
          >

              <Button onClick={() => Router.push("/")} type="primary" block>
                  Go Back To Site
              </Button>
          </AuthCard>
        </AuthPageContent>
      </AuthContentWrapper>
    </>
  );
}

export default withRouter(SubscriptionSuccess);
