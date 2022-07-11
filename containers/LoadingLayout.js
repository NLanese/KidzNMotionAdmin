import React, { useEffect } from "react";
import styled from "styled-components";
import { useRecoilValue } from "recoil";
import { userState } from "@atoms";
import { Spin } from "antd";
import Router from "next/router";

const LoadingBackground = styled.div`
  position: fixed;
  z-index: 2;
  width: 100%;
  height: 100%;
  background: rgb(24, 144, 255);

  background-image: linear-gradient(
      to bottom,
      rgba(0, 0, 0, 0.85),
      rgba(0, 0, 0, 0.83)
    ),
    url("/backgrounds/authBackground.jpg");
  background-repeat: no-repeat;
  background-size: cover;
  background-position: top;

`;

const LoadingWrapper = styled.main`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  height: 100vh;
  & img {
    position: relative;
    z-index: 999;
    max-width: 150px;
  }
  .ant-spin {
    z-index: 999;
  }
  .ant-spin-dot-item {
    background-color: white;
  }
`;

function LoadingLayout({ children }) {
  const user = useRecoilValue(userState);

  useEffect(() => {
    if (!user) {
      Router.push("/authentication/login");
    } else {
      if (!user.loading) {
        Router.push("/");
      }
    }
  }, [user]);

  return (
    <>
      <LoadingBackground />
      <LoadingWrapper>
        <Spin spinning={true} size="large" />
      </LoadingWrapper>
    </>
  );
}

export default LoadingLayout;
