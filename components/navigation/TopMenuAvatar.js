import React, { useState } from "react";
import styled from "styled-components";
import { LogoutOutlined } from "@ant-design/icons";
import { useRecoilState } from "recoil";
import { userState } from "@atoms";
import { capitalizeFirstLetter } from "@helpers/common";
import { ExclamationCircleOutlined, SyncOutlined } from "@ant-design/icons";
import NakedButton from "@common/NakedButton";
import { Avatar, Typography, Dropdown, Menu, message, Tag, Space } from "antd";
import { getCheckoutURL } from "@helpers/billing";
const { Title } = Typography;

const AvatarDetails = styled.div`
  display: flex;
  cursor: pointer;
  z-index: 99;
  transition: ${(props) => props.theme.transitions.standard};
  :hover {
    opacity: 0.7;
    transition: ${(props) => props.theme.transitions.standard};
  }
`;
const AvatarTextDetails = styled.div`
  text-align: right;
  padding-left: 8px;
  justify-content: center;
  align-items: flex-end;
  display: flex;
  flex-direction: column;
  & h5 {
    margin: 0px;
    font-size: 14px;
    line-height: 15px;
  }
  & span {
    font-size: 14px;
    margin: 0px;
  }
  @media (max-width: ${(props) => props.theme.breakPoints.md}) {
    & h5 {
      display: none;
    }
  }
`;

function TopMenuAvatar() {
  const [user, setUser] = useRecoilState(userState);
  const [loading, setLoading] = useState(false);

  const handleSignOut = () => {
    setUser(null);
    message.success("Signed out");
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    location.reload();
  };

  const renderFreeTrialTag = () => {
    if (user.role !== "OWNER") return;
    if (!user.dsp) return;
    if (user.dsp.stripeCustomerId) return;

    if (user.dsp.accountStanding === "Free") {
      let daysLeft = parseInt(
        16 -
          (new Date().getTime() - new Date(user.dsp.createdAt).getTime()) /
            (1000 * 3600 * 24)
      );
      return (
        <NakedButton onClick={() => checkout()}>
          <Tag
            style={{ fontWeight: 600 }}
            icon={
              loading ? <SyncOutlined spin /> : <ExclamationCircleOutlined />
            }
            color="processing"
            size="large"
          >
            {daysLeft} Days Left On Trial (Activate)
          </Tag>
        </NakedButton>
      );
    }
  };

  const checkout = async () => {
    setLoading(true);
    const session = await getCheckoutURL();
    if (!session) {
      setLoading(false)
    } else {
      window.location = session.checkoutURL;
    }
  };

  return (
    <Space>
      {renderFreeTrialTag()}
      <Dropdown
        overlay={
          <Menu
            items={[
              {
                key: "4",
                label: "Sign Out",
                onClick: () => handleSignOut(),
                icon: <LogoutOutlined />,
              },
            ]}
          />
        }
        placement="bottomRight"
        trigger={["click"]}
        arrow={{ pointAtCenter: false }}
      >
        <AvatarDetails>
          {user.firstname && user.lastname && (
            <Avatar
              style={{ backgroundColor: "#2d4499", fontSize: "16px" }}
              size={33}
            >
              {user.firstname[0]}
              {user.lastname[0]}
            </Avatar>
          )}
          <AvatarTextDetails>
            {user.firstname && user.lastname && (
              <Title level={5}>
                {capitalizeFirstLetter(user.firstname)}{" "}
                {capitalizeFirstLetter(user.lastname)}
              </Title>
            )}
          </AvatarTextDetails>
        </AvatarDetails>
      </Dropdown>
    </Space>
  );
}

export default TopMenuAvatar;
