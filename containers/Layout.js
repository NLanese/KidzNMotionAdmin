import React, { useEffect } from "react";
import styled from "styled-components";
import SideMenu from "@components/navigation/SideMenu";
import TopMenu from "@components/navigation/TopMenu";
import { useRecoilState } from "recoil";
import { userState } from "@atoms";

import { withRouter } from "next/router";
import AuthLayout from "./AuthLayout";
import LoadingLayout from "./LoadingLayout";

import { OWNER_REFRESH, MANAGER_REFRESH } from "@graphql/operations";
import { useMutation } from "@apollo/client";

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

  // MUTATIONS
  const [ownerRefresh, {}] = useMutation(OWNER_REFRESH);
  const [managerRefresh, {}] = useMutation(MANAGER_REFRESH);

  const observeAuth = async () => {
    const token = localStorage.getItem("token");

    if (token) {
      if (localStorage.getItem("role") === "OWNER") {
        await ownerRefresh({
          variables: {
            role: "OWNER",
            token: localStorage.getItem("token"),
          },
        })
          .then(async (resolved) => {
            setUser(resolved.data.refreshOwner);
          })
          .catch((error) => {
            setUser(null);
          });
      } else {
        await managerRefresh({
          variables: {
            role: "MANAGER",
            token: localStorage.getItem("token"),
          },
        })
          .then(async (resolved) => {
            setUser(resolved.data.refreshManager);
          })
          .catch((error) => {
            setUser(null);
          });
      }
    } else {
      setUser(null);
    }
  };

  useEffect(() => {
    observeAuth();
  }, []);

  useEffect(() => {
    // console.log(user)
  }, [user]);

  if (router.asPath.includes("auth")) {
    // If the user is still loading then return loading layout before authenitcaiont layouts
    if (user) return <LoadingLayout />

    return <AuthLayout>{children}</AuthLayout>;
  }

  if (router.asPath.includes("legal")) {
    return <>{children}</>;
  }

  return (
    <LayoutWrapper>
      {user && !user.loading ? (
        <>
        {console.log(user)}
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
