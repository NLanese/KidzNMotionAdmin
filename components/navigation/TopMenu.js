import React from "react";
import styled from "styled-components";
import { MenuOutlined } from "@ant-design/icons";
import { Button } from "antd";
import Logo from "./Logo";
import { useSetRecoilState } from "recoil";
import TopMenuAvatar from "./TopMenuAvatar";
import { menuState } from "@atoms";

const HeaderMenuWrapper = styled.div`
  height: 65px;
  position: fixed;
  margin: auto;
  left: 0px;
  top: 0px;
  right: 0px;
  background: rgb(255, 255, 255);
  background: linear-gradient(
    94deg,
    rgba(255, 255, 255, 0.62454919467787116) 0%,
    rgba(255, 255, 255, 0.62454919467787116) 95%
  );

  border-bottom: 1.5px solid #f0f0f0;
  backdrop-filter: blur(10px) !important;
  box-shadow: ${(props) => props.theme.boxShadow.hard};
  display: flex;
  justify-content: space-between;
  transition: ${(props) => props.theme.transitions.standard};
  padding: 5px 20px 5px;
  z-index: 99;
  @media (max-width: ${(props) => props.theme.breakPoints.lg}) {
    padding: 5px 18px 5px;
  }
  @media (max-width: ${(props) => props.theme.breakPoints.md}) {
    height: 55px;
    padding: 5px 12px 5px;
  }
`;

const LeftSide = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 99;
  @media (max-width: ${(props) => props.theme.breakPoints.md}) {
    display: none;
  }
`;

const LeftSideMobile = styled(LeftSide)`
  display: none;
  @media (max-width: ${(props) => props.theme.breakPoints.md}) {
    display: flex;
  }
`;

const Center = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  right: 0px;
  left: 0px;
  margin: auto;
  top: 12px;
  display: none;
  @media (max-width: ${(props) => props.theme.breakPoints.md}) {
    display: flex;
  }
`;

const RightSide = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;

function TopMenu({ router, user }) {
  const setMenuOpen = useSetRecoilState(menuState);
  
 

  return (
    <HeaderMenuWrapper>
      <LeftSide>
        <Logo />
      </LeftSide>
      <LeftSideMobile>
        <Button
          shape="circle"
          icon={<MenuOutlined />}
          size="large"
          onClick={() => setMenuOpen(true)}
        />
      </LeftSideMobile>
      <Center>
        {" "}
     
      </Center>
      <RightSide>
        <TopMenuAvatar />
      </RightSide>
    </HeaderMenuWrapper>
  );
}

export default TopMenu;
