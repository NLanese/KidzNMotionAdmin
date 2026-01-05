import React, { useState, useEffect } from "react";
import styled from "styled-components";
import dateFormat from "dateformat";
// import dateFormat from "dateformat";
import { menuState } from "@atoms";
import { useRecoilState, useSetRecoilState } from "recoil";
import Router from "next/router";
import { withRouter } from "next/router";

import {
  SettingOutlined,
  AuditOutlined,
  CodeSandboxOutlined,
  TeamOutlined,
  GroupOutlined,
  TableOutlined,
  UserSwitchOutlined,
  BulbOutlined,
  MessageOutlined,
  UserOutlined,
  HomeOutlined,
  CloseOutlined,
  VideoCameraTwoTone,
  ContainerTwoTone,
  VideoCameraOutlined,
  TrophyOutlined
} from "@ant-design/icons";
import { Menu, Divider, Typography, Drawer, Button } from "antd";
function addAlpha(color, opacity) {
  // coerce values so ti is between 0 and 1.
  var _opacity = Math.round(Math.min(Math.max(opacity || 1, 0), 1) * 255);
  return color + _opacity.toString(16).toUpperCase();
}
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

const SideMenuWrapper = styled.nav`
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
  .ant-menu-item-selected {
    background: ${(props) =>
      addAlpha(props.theme.colors.primary, 0.1)} !important;
    border-color: ${(props) =>
      addAlpha(props.theme.colors.primary, 0.1)} !important;
    color: ${(props) => props.theme.colors.primary} !important;
  }
  .ant-menu-light .ant-menu-item:hover,
  .ant-menu-light .ant-menu-item-active,
  .ant-menu-light .ant-menu:not(.ant-menu-inline) .ant-menu-submenu-open,
  .ant-menu-light .ant-menu-submenu-active,
  .ant-menu-light .ant-menu-submenu-title:hover {
    color: ${(props) => props.theme.colors.primary} !important;
  }
  .ant-menu-submenu:hover
    > .ant-menu-submenu-title
    > .ant-menu-submenu-expand-icon,
  .ant-menu-submenu:hover > .ant-menu-submenu-title > .ant-menu-submenu-arrow {
    color: ${(props) => props.theme.colors.primary} !important;
  }
`;

const StyledMenu = styled(Menu)`
  border-right: white;
  position: relative;
  top: 0px;
  height: auto;

  .ant-menu-submenu-selected {
    color: ${(props) => props.theme.colors.primary} !important;
  }
  .ant-menu-submenu:hover {
    color: ${(props) => props.theme.colors.primary} !important;
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
        <Menu.SubMenu
          key={"/account"}
          title={"Settings & Support"}
          onTitleClick={() => appendMenuKey("/account")}
          icon={<SettingOutlined style={{ fontSize: "20px" }} />}
        >
          <>
            {user.ownedOrganization && (
              <>
                <Menu.Item
                  key={"/account/organization-settings"}
                  onClick={() => pushLink("/account/organization-settings")}
                >
                  Organization Settings
                </Menu.Item>

                {/* <Menu.Item
                  key={"/account/billing"}
                  onClick={() => pushLink("/account/billing")}
                >
                  Billing & Subscription
                </Menu.Item> */}
              </>
            )}

            {/* {user.solo && (
              <Menu.Item
                key={"/account/guardian-billing"}
                icon={<SettingOutlined style={{ fontSize: "20px" }} />}
                onClick={() => pushLink("/account/guardian-billing")}
              >
                Billing & Subscription
              </Menu.Item>
            )} */}
            <Menu.Item
              key={"/account/profile-settings"}
              onClick={() => pushLink("/account/profile-settings")}
            >
              Profile Settings
            </Menu.Item>
            <Menu.Item onClick={() => pushLink("/support")} key="/support">
              Knowledge Hub
            </Menu.Item>
          </>
        </Menu.SubMenu>

        {/* Owner Specific Selections */}
        {user.ownedOrganization && (
          <Menu.SubMenu
            key={"/users"}
            title={user.role === "THERAPIST" ? "Patients" : "Users"}
            onTitleClick={() => appendMenuKey("/users")}
            icon={<TeamOutlined style={{ fontSize: "20px" }} />}
          >
            <>
              {user.role === "THERAPIST" ? (
                <Menu.Item
                  key={"/patients/manage"}
                  onClick={() => pushLink("/patients/manage")}
                >
                  Patient List
                </Menu.Item>
              ) : (
                <Menu.Item
                  key={"/users/manage"}
                  onClick={() => pushLink("/users/manage")}
                >
                  User List
                </Menu.Item>
              )}

              <Menu.Item
                key={"/users/upload"}
                onClick={() => pushLink("/users/upload")}
              >
                {user.role === "THERAPIST" ? "Upload Patients" : "Upload Users"}
              </Menu.Item>
            </>
          </Menu.SubMenu>
        )}

        {/* Therapist Specific Selections */}
        {!user.ownedOrganization && user.role === "THERAPIST" && (
          <Menu.Item
            key={"/patients/manage"}
            onClick={() => pushLink("/patients/manage")}
            icon={<TeamOutlined style={{ fontSize: "20px" }} />}
          >
            Patient List
          </Menu.Item>
        )}

        {/* Meetings and Assignments */}
        {(user.role === "THERAPIST" || user.role === "GUARDIAN") &&
          !user.solo && (
            <>
            <Menu.Item
              onClick={() => pushLink("/meetings")}
              key="/meetings"
              icon={<GroupOutlined style={{ fontSize: "20px" }} />}
            >
              Meetings
            </Menu.Item>
            <Menu.Item
              onClick={() => pushLink("/assignments")}
              key="/assignments"
              icon={<BulbOutlined style={{ fontSize: "20px" }} />}
            >
              Assignments
            </Menu.Item>
            </>
        )}

        {/* Medals */}
        {(user.role === "GUARDIAN" || user.role === "CHILD") && (
          <Menu.Item
            onClick={() => pushLink("/medals")}
            key="/medals"
            icon={<TrophyOutlined style={{ fontSize: "20px" }} />}
          >
            Medals
          </Menu.Item>
        )}

        <Menu.Item
          onClick={() => pushLink("/messaging")}
          key="/messaging"
          icon={<MessageOutlined style={{ fontSize: "20px" }} />}
        >
          Messaging
        </Menu.Item>

        <Menu.Item
          onClick={() => pushLink("/video-library")}
          key="/video-library"
          icon={<VideoCameraOutlined style={{ fontSize: "20px" }} />}
        >
          {"Video Library"}
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
        open={menuOpen}
      >
        <MobileLogo>
          <img alt="Kidz-N-Motion Logo" src="/logos/Main.png" />
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
