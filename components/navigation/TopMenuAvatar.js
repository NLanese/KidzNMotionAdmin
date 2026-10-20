import React from "react";
import styled from "styled-components";
import { LogoutOutlined } from "@ant-design/icons";
import { Content } from "antd/lib/layout/layout";
import { useRecoilState } from "recoil";
import { userState } from "@atoms";
import { capitalizeFirstLetter } from "@helpers/common";
import { Typography, Dropdown, Menu, message, Space } from "antd";
import Avatar from "@forms/profileSettings/Avatar";

const { Title } = Typography;

// Avatar Styles
const AvatarDetails = styled.div`
  display: flex;
  cursor: pointer;
  z-index: 99;
  transition: ${(props) => props.theme.transitions.standard};
  :hover {
    opacity: 0.7;
    transition: ${(props) => props.theme.transitions.standard};
  }
  .ant-avatar {
    background-color: ${(props) => props.theme.colors.primary} !important;
  }
`;

// Avatar And Profile Name
const AvatarTextDetails = styled.div`
  text-align: right;
  padding-left: 8px;
  justify-content: center;
  align-items: flex-end;
  display: flex;

  flex-direction: column;
  & h2 {
    margin: 0px;
    font-size: 16px;
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


////////////////////
//                //
//   COMPONENT    //
//                //
////////////////////
function TopMenuAvatar() {

  // NOTE: Kidz-N-Motion is currently free for everyone, so this menu no longer
  // shows trial banners, subscription buttons or billing redirects.

    // User
    const [user, setUser] = useRecoilState(userState);

  // PROFILE // 

    // Handles Signing Out
    const handleSignOut = () => {
      setUser(null);
      message.success("Signed out");
      localStorage.removeItem("token");
      localStorage.removeItem("role");
      location.reload();
    };

    // Renders User Avatar
    const getUserAvatar = () => {
      let interumProfilePic = {
        body: "body1",
        eyes: "eyes3",
        facialHair: "facialHair0",
        mouth: "mouth4",
        nose: "nose2",
        hair: "hair5",

        bodyColor: "bc1",
        facialHairColor: "fhc6",
        hairColor: "hc1",
        skinColor: "sc1",
        backgroundColor: "bgc1",
      };

      if (user.profilePic) {
        interumProfilePic = user.profilePic;
      }
      return (
        <Avatar
          size={40}
          bodyType={interumProfilePic.body}
          bodyColor={interumProfilePic.bodyColor}
          eyeType={interumProfilePic.eyes}
          facialHairType={interumProfilePic.facialHair}
          facialHairColor={interumProfilePic.facialHairColor}
          hairType={interumProfilePic.hair}
          hairColor={interumProfilePic.hairColor}
          mouthType={interumProfilePic.mouth}
          noseType={interumProfilePic.nose}
          skinColor={interumProfilePic.skinColor}
          backgroundColor={interumProfilePic.backgroundColor}
        />
      );
    };

  ////////////
  //  MAIN  //
  ////////////
  return (
    <Space>
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
        <AvatarDetails role="User Details">
          {getUserAvatar()}
          <AvatarTextDetails>
            {user.firstName && user.lastName && (
              <Content>
                <Title level={2}>
                  {capitalizeFirstLetter(user.firstName)}{" "}
                  {capitalizeFirstLetter(user.lastName)}
                </Title>
              </Content>
            )}
          </AvatarTextDetails>
        </AvatarDetails>
      </Dropdown>
    </Space>
  );
}

export default TopMenuAvatar;
