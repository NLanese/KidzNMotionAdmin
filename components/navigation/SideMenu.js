import React, { useState, useEffect } from "react";
import styled from "styled-components";
var dateFormat = require("dateformat");
import { menuState } from "@atoms";
import { useRecoilState, useSetRecoilState } from "recoil";
import Router from "next/router";
import { withRouter } from "next/router";

import {
  SettingOutlined,
  AuditOutlined,
  CodeSandboxOutlined,
  TeamOutlined,
  TableOutlined,
  BulbOutlined,
  MessageOutlined,
  UserOutlined,
  HomeOutlined,
  CloseOutlined,
} from "@ant-design/icons";
import { Menu, Divider, Typography, Drawer, Button } from "antd";

const SideMenuStyleWrapper = styled.div`
  user-select: none; /* supported by Chrome and Opera */
  -webkit-user-select: none; /* Safari */
  -khtml-user-select: none; /* Konqueror HTML */
  -moz-user-select: none; /* Firefox */
  -ms-user-select: none;
`;

const SideMenuOuterWrapper = styled.div`
  width: 240px;
  background: ${(props) => props.theme.colors.backgroundColor};
  min-height: 100vh;
  position: fixed;
  z-index: 2;
  top: 0px;
  .ant-menu {
    background-color: ${(props) => props.theme.colors.backgroundColor};
  }
  @media (max-width: ${(props) => props.theme.breakPoints.md}) {
    display: none;
    background: white;
    .ant-menu {
      background-color: white;
    }
  }
`;

const SideMenuWrapper = styled.div`
  background: ${(props) => props.theme.colors.backgroundColor};
  border-right: 2px solid #ebebeb;
  bottom: 0;
  width: 240px;
  top: 65px;
  padding-top: 10px;
  min-height: 100vh;
  position: fixed;
  overflow-y: scroll;
  ::-webkit-scrollbar {
    display: none;
  }
  @media (max-width: ${(props) => props.theme.breakPoints.md}) {
    position: relative;
    top: 0px;
    border: none;
    width: 100%;
    padding-top: 0px;
    background: white;
    min-height: 40vh;
  }
`;

const StyledMenu = styled(Menu)`
  border-right: white;
  position: relative;
  top: 0px;
  height: auto;
  .ant-menu-sub.ant-menu-inline {
    background-color: #f3f3f3;
  }
`;

const SideMenuOuterWrapperMobile = styled(SideMenuOuterWrapper)`
  display: none;
  @media (max-width: ${(props) => props.theme.breakPoints.md}) {
    display: block;
    position: relative;
    width: 100%;
    min-height: 10vh;
  }
`;

const MobileLogo = styled.div`
  padding: 10px;
  z-index: 999;
  border-bottom: 1px solid lightgray;
  text-align: center;
  & img {
    padding: 10px 15px 5px;
    max-width: 110px;
  }
`;

function SideMenu({ router, user }) {
  const setMenuOpen = useSetRecoilState(menuState);
  const [openKeys, setOpenKeys] = useState([]);
  const [selectedKeys, setSelectedKeys] = useState([]);

  const pushLink = (link) => {
    setMenuOpen(false);
    Router.push(link, null, { scroll: true, shallow: false });
  };

  useEffect(() => {
    setOpenKeys(["/" + router.pathname.split("/")[1]]);
    setSelectedKeys(router.pathname);
  }, [router]);

  useEffect(() => {
    setOpenKeys(["/" + router.pathname.split("/")[1]]);
    setSelectedKeys(router.pathname);
  }, []);

  const appendMenuKey = (key) => {
    let currentKeys = openKeys.slice(0);

    if (currentKeys.includes(key)) {
      const index = currentKeys.indexOf(key);
      if (index > -1) {
        currentKeys.splice(index, 1); // 2nd parameter means remove one item only
      }
    } else {
      currentKeys.push(key);
    }
    setOpenKeys(currentKeys);
  };

  return (
    <SideMenuWrapper>
      <StyledMenu mode="inline" openKeys={openKeys} selectedKeys={selectedKeys}>
        <Menu.Item
          onClick={() => pushLink("/")}
          key="/"
          icon={<HomeOutlined style={{ fontSize: "20px" }} />}
        >
          Home
        </Menu.Item>

        {/* <Menu.Item
          onClick={() => pushLink("/patient-care-plans")}
          key="/patient-care-plans"
          disabled
          icon={<TeamOutlined style={{ fontSize: "20px" }} />}
        >
          Patient Care Plans
        </Menu.Item>

        <Menu.Item
          onClick={() => pushLink("/child-care-plans")}
          key="/child-care-plans"
          disabled
          icon={<TableOutlined style={{ fontSize: "20px" }} />}
        >
          Child Care Plans
        </Menu.Item>

        {user.role !== "ADMIN" && (
          <Menu.Item
            onClick={() => pushLink("/messaging")}
            key="/messaging"
            disabled
            icon={<MessageOutlined style={{ fontSize: "20px" }} />}
          >
            Messaging
          </Menu.Item>
        )} */}
        {user.ownedOrganization && (
          <Menu.SubMenu
            key={"/users"}
            title={"Users"}
            onTitleClick={() => appendMenuKey("/users")}
            icon={<TeamOutlined style={{ fontSize: "20px" }} />}
          >
            <>
              <Menu.Item
                key={"/users/manage"}
                onClick={() => pushLink("/users/manage")}
              >
                Manage Users
              </Menu.Item>

              <Menu.Item
                key={"/users/upload"}
                onClick={() => pushLink("/users/upload")}
              >
                Upload Users
              </Menu.Item>
            </>
          </Menu.SubMenu>
        )}
        <Menu.Item
          onClick={() => pushLink("/messaging")}
          key="/messaging"
          icon={<MessageOutlined style={{ fontSize: "20px" }} />}
        >
          Messaging
        </Menu.Item>
        {user.ownedOrganization && (
          <Menu.SubMenu
            key={"/account"}
            title={"Settings"}
            onTitleClick={() => appendMenuKey("/account")}
            icon={<SettingOutlined style={{ fontSize: "20px" }} />}
          >
            <>
              <Menu.Item
                key={"/account/organization-settings"}
                onClick={() => pushLink("/account/organization-settings")}
              >
                Organization Settings
              </Menu.Item>

              <Menu.Item
                key={"/account/billing"}
                onClick={() => pushLink("/account/billing")}
              >
                Billing & Subscription
              </Menu.Item>
            </>
          </Menu.SubMenu>
        )}
        <Menu.Item
          key={"/account/profile-settings"}
          onClick={() => pushLink("/account/profile-settings")}
          icon={<UserOutlined style={{ fontSize: "20px" }} />}
        >
          Profile Settings
        </Menu.Item>
      </StyledMenu>
      <Divider />
      <Typography
        style={{
          fontSize: "14px",
          textAlign: "center",
          opacity: 0.6,
          marginBottom: "30px",
        }}
        type="secondary"
      >
        {dateFormat(new Date(), "ddd - mmm dd, yyyy")}
      </Typography>
    </SideMenuWrapper>
  );
}

function SideMenuContainer({ router, user }) {
  const [menuOpen, setMenuOpen] = useRecoilState(menuState);

  return (
    <SideMenuStyleWrapper>
      <SideMenuOuterWrapper>
        <SideMenu router={router} user={user} />
      </SideMenuOuterWrapper>
      <Drawer
        placement={"left"}
        width={"240px"}
        maskStyle={{
          backdropFilter: "blur(5px)",
        }}
        closable={false}
        bodyStyle={{
          padding: "0px",
        }}
        onClose={() => setMenuOpen(false)}
        visible={menuOpen}
      >
        <MobileLogo>
          <img alt="Kidz-N-Motion Logo" src="/logos/LogoSVG.svg" />
          <Button
            style={{ float: "right", marginTop: "4px" }}
            size="large"
            shape="circle"
            onClick={() => setMenuOpen(false)}
          >
            <CloseOutlined />
          </Button>
        </MobileLogo>
        <SideMenuOuterWrapperMobile>
          {menuOpen && <SideMenu router={router} user={user} />}
        </SideMenuOuterWrapperMobile>
      </Drawer>
    </SideMenuStyleWrapper>
  );
}

export default withRouter(SideMenuContainer);
