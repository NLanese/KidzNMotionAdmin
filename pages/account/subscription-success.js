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
  background: ${(props) => props.theme.gradients.main};

  background-image: linear-gradient(
      to bottom,
      rgba(0, 0, 0, 0.65),
      rgba(0, 0, 0, 0.63)
    ),
    url("https://images.ctfassets.net/z3ixs6i8tjtq/1BrRYAM5hHY2AvljR5sYo6/c3555ea612c0b6cef51e7ba04c9b6c90/authBackground.jpg?w=2000&q=60");
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
