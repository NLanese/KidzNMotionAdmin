import React, { useEffect } from "react";
import styled from "styled-components";
import { useRecoilState } from "recoil";
import { userState } from "@atoms";
import TopMenu from "@components/navigation/TopMenu";
import SideMenu from "@components/navigation/SideMenu";

import { withRouter } from "next/router";
import AuthLayout from "./AuthLayout";
import LoadingLayout from "./LoadingLayout";
import { message } from "antd";

import {  GET_USER } from "@graphql/operations";
import client from "@utils/apolloClient";

const LayoutWrapper = styled.div`
  width: 100%;
  background: #fefefe;
  position: relative;
`;

const MainContentWrapper = styled.main`
  position: relative;
  background: ${(props) => props.theme.colors.backgroundColor};
 
`;

const ChildrenContentWrapper = styled.div`
  margin-left: auto;
  margin-right: auto;
  min-height: 100vh;
  padding: 100px 30px 60px 270px;
  position: relative;
  display: block;
  flex-grow: 1;
  @media (max-width: ${(props) => props.theme.breakPoints.md}) {
    padding: 80px 15px 0px;
  }
`;

function Layout({ children, router }) {
  const [user, setUser] = useRecoilState(userState);


  const observeAuth = async () => {
    const token = localStorage.getItem("token");

    if (token) {
      await client
      .query({
        query: GET_USER,
        fetchPolicy: 'network-only'
      })
      .then(async (resolved) => {
        // console.log(resolved.data.getUser)
        setUser(resolved.data.getUser)
      })
      .catch((error) => {
        setUser(null);
        message.error("Sorry, there was an error getting this information");
      });

    } else {
      setUser(null);
    }
  };

  useEffect(() => {
    observeAuth();
  }, []);

  useEffect(() => {
    // // console.log(user)
  }, [user]);

  if (router.asPath.includes("auth")) {
    // If the user is still loading then return loading layout before authenitcaiont layouts
    if (user) return <LoadingLayout />

    return <AuthLayout>{children}</AuthLayout>;
  }

  if (router.asPath.includes("legal")) {
    return <>{children}</>;
  }

  if (router.asPath.includes("subscription-success")) {
    return <>{children}</>;
  }

  return (
    <LayoutWrapper>
      {user && !user.loading ? (
        <>
          <TopMenu router={router} user={user} />
          <MainContentWrapper id="mainContent">
            <SideMenu user={user} />
            <ChildrenContentWrapper>{children}</ChildrenContentWrapper>
          </MainContentWrapper>
        </>
      ) : (
        <LoadingLayout />
      )}
    </LayoutWrapper>
  );
}

export default withRouter(Layout);
