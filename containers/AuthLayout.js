import React, { useEffect } from "react";
import styled from "styled-components";
import { useRecoilValue } from "recoil";
import { userState } from "@atoms";
import { Spin } from "antd";
import Router from "next/router";

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

function AuthLayout({ children }) {
  const user = useRecoilValue(userState);
  
  useEffect(() => {
    if (user && !user.loading) {
      Router.push("/");
    }
  }, [user]);

  return (
    <>
      <AuthFormBackground />
      <AuthContentWrapper>
        <AuthPageContent>
          <Spin spinning={user && user.loading ? true : false}>{children}</Spin>
        </AuthPageContent>
      </AuthContentWrapper>
    </>
  );
}

export default AuthLayout;
