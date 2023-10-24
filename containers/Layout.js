import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useRecoilState } from "recoil";
import { userState } from "@atoms";
import TopMenu from "@components/navigation/TopMenu";
import SideMenu from "@components/navigation/SideMenu";
import theme from "@styles/theme";
import { ThemeProvider } from "styled-components";
import { withRouter } from "next/router";
import AuthLayout from "./AuthLayout";
import LoadingLayout from "./LoadingLayout";
import { message } from "antd";
import NextNprogress from "nextjs-progressbar";
import axios from "axios";
import { GET_USER } from "@graphql/operations";
import client from "@utils/apolloClient";

function addAlpha(color, opacity) {
  // coerce values so ti is between 0 and 1.
  var _opacity = Math.round(Math.min(Math.max(opacity || 1, 0), 1) * 255);
  return color + _opacity.toString(16).toUpperCase();
}
const LayoutWrapper = styled.div`
  width: 100%;
  background: #fefefe;
  position: relative;
  ::selection {
    background: #ffb7b7 !important; /* WebKit/Blink Browsers */
  }
  ::-moz-selection {
    background: #ffb7b7 !important; /* Gecko Browsers */
  }

  .ant-btn-primary {
    background-color: ${(props) => props.theme.colors.primary} !important;
    border-color: ${(props) => props.theme.colors.primary} !important;
    color: white !important;
  }
  .ant-btn-primary:hover {
    background-color: ${(props) => props.theme.colors.primary} !important;
    border-color: ${(props) => props.theme.colors.primary} !important;
    color: white !important;
  }
  .kZgPRq .ant-btn:hover,
  .kZgPRq .ant-btn:focus .ant-btn-primary[disabled],
  .ant-btn-primary[disabled]:hover,
  .ant-btn-primary[disabled]:focus,
  .ant-btn-primary[disabled]:active {
    background: #f5f5f5;
    border-color: #f5f5f5;
  }
  .ant-input-affix-wrapper:not(.ant-input-affix-wrapper-disabled):hover {
    border-color: ${(props) => props.theme.colors.primary};
  }
  .ant-input-affix-wrapper:focus,
  .ant-input-affix-wrapper-focused {
    border-color: ${(props) => props.theme.colors.primary};
    box-shadow: 0 0 0 2px ${(props) => props.theme.colors.primary};
  }
  .ant-spin {
    color: ${(props) => props.theme.colors.primary} !important;
  }
  .ant-picker-calendar-full .ant-picker-panel .ant-picker-calendar-date-today {
    border-color: ${(props) => props.theme.colors.primary};
    background-color: ${(props) =>
      addAlpha(props.theme.colors.backgroundColor, 0.8)};
  }
  .ant-picker-calendar-full
    .ant-picker-panel
    .ant-picker-cell-selected
    .ant-picker-calendar-date
    .ant-picker-calendar-date-value,
  .ant-picker-calendar-full
    .ant-picker-panel
    .ant-picker-cell-selected:hover
    .ant-picker-calendar-date
    .ant-picker-calendar-date-value,
  .ant-picker-calendar-full
    .ant-picker-panel
    .ant-picker-cell-selected
    .ant-picker-calendar-date-today
    .ant-picker-calendar-date-value,
  .ant-picker-calendar-full
    .ant-picker-panel
    .ant-picker-cell-selected:hover
    .ant-picker-calendar-date-today
    .ant-picker-calendar-date-value {
    color: ${(props) => props.theme.colors.primary} !important;
  }
  a.ant-typography,
  .ant-typography a {
    color: ${(props) => props.theme.colors.primary};
  }
  a {
    color: ${(props) => props.theme.colors.primary};
  }
  .ant-tabs-tab.ant-tabs-tab-active .ant-tabs-tab-btn {
    color: ${(props) => props.theme.colors.primary} !important;
  }
  .ant-input:focus,
  .ant-input-focused {
    box-shadow: 0 0 0 2px ${(props) => props.theme.colors.primary};
    border-color: ${(props) => props.theme.colors.primary};
  }
  .ant-input:hover {
    border-color: ${(props) => props.theme.colors.primary};
  }
  .ant-popover-buttons .ant-btn-primary {
    background-color: ${(props) => props.theme.colors.primary} !important;
  }
  .ant-result-info .ant-result-icon > .anticon {
    color: ${(props) => props.theme.colors.primary} !important;
  }
  .ant-btn-ghost:hover,
  .ant-btn-ghost:focus {
    color: ${(props) => props.theme.colors.primary} !important;
    border-color: ${(props) => props.theme.colors.primary} !important;
  }
  .ant-pagination-item-active a {
    border-color: ${(props) => props.theme.colors.primary} !important;
  }
  .ant-pagination.ant-pagination-mini .ant-pagination-item {
    border-color: ${(props) => props.theme.colors.primary} !important;
  }
  .ant-tag-processing {
    color: ${(props) => props.theme.colors.primary} !important;
    border-color: ${(props) => props.theme.colors.primary} !important;
    background-color: ${(props) =>
      addAlpha(props.theme.colors.primary, 0.1)} !important;
  }
  .ant-switch-checked {
    background-color: ${(props) =>
      addAlpha(props.theme.colors.primary, 1)} !important;
  }
  .ant-steps-item-process > .ant-steps-item-container > .ant-steps-item-icon {
    border-color: ${(props) =>
      addAlpha(props.theme.colors.primary, 1)} !important;
    background: ${(props) =>
      addAlpha(props.theme.colors.primary, 1)} !important;
    background-color: ${(props) =>
      addAlpha(props.theme.colors.primary, 1)} !important;
  }
  .ant-btn:hover,
  .ant-btn:focus {
    border-color: ${(props) =>
      addAlpha(props.theme.colors.primary, 1)} !important;
    color: white !important;
  }
  .ant-menu-vertical .ant-menu-item::after,
  .ant-menu-vertical-left .ant-menu-item::after,
  .ant-menu-vertical-right .ant-menu-item::after,
  .ant-menu-inline .ant-menu-item::after {
    border-color: ${(props) =>
      addAlpha(props.theme.colors.primary, 1)} !important;
  }
`;

const MainContentWrapper = styled.div`
  position: relative;
  background: ${(props) => props.theme.colors.backgroundColor};
`;

const ChildrenContentWrapper = styled.main`
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
  const [color, setColor] = useState("#ff9800");

  const observeAuth = async () => {
    const token = localStorage.getItem("token");

    if (token) {
      await client
        .query({
          query: GET_USER,
          fetchPolicy: "network-only",
        })
        .then(async (resolved) => {
          setUser(resolved.data.getUser);
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
    // console.log(user);
  }, []);

  useEffect(() => {
    // // // console.log(user)
  }, [user]);
  const getThemeColor = () => {
    if (user) {
      theme.colors.primary = user.webAppColorSettings;
      theme.colors.lightPrimary = user.webAppColorSettings;
      theme.colors.darkPrimary = user.webAppColorSettings;
    } else {
      theme.colors.primary = color;
    }
    return theme;
  };
  if (router.asPath.includes("auth")) {
    // If the user is still loading then return loading layout before authenitcaiont layouts
    if (user) return <LoadingLayout />;

    return (
      <ThemeProvider theme={getThemeColor()}>
        <AuthLayout>{children}</AuthLayout>
      </ThemeProvider>
    );
  }

  if (router.asPath.includes("legal")) {
    return <ThemeProvider theme={getThemeColor()}>{children}</ThemeProvider>;
  }

  if (router.asPath.includes("subscription-success")) {
    return <ThemeProvider theme={getThemeColor()}>{children}</ThemeProvider>;
  }

  if (router.asPath.includes("pdf")) {
    return (
      <ThemeProvider theme={getThemeColor()}>
        <NextNprogress
          color={user ? user.webAppColorSettings : "#ffbe76"}
          options={{ showSpinner: false }}
          startPosition={0.3}
          stopDelayMs={0}
          height={3}
        />
        <LayoutWrapper>
          {user && !user.loading ? (
            <>
              <MainContentWrapper id="mainContent">
                {children}
              </MainContentWrapper>
            </>
          ) : (
            <LoadingLayout />
          )}
        </LayoutWrapper>
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider theme={getThemeColor()}>
      <NextNprogress
        color={user ? user.webAppColorSettings : "#ffbe76"}
        options={{ showSpinner: false }}
        startPosition={0.3}
        stopDelayMs={0}
        height={3}
      />
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
    </ThemeProvider>
  );
}

export default withRouter(Layout);
