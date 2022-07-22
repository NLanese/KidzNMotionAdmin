import React from "react";
import styled from "styled-components";
import BasicLink from "@common/BasicLink";

const LogoWrapper = styled.div`
  text-align: center;
  z-index: 999;
  display: flex;
  align-items: center;
  justify-content: center;

  & img {
    width: 65px;
    height: 65px;
  }
`;

function Logo() {
  return (
    <LogoWrapper>
      <BasicLink href='/'>
        <img alt="Kidz-N-Motion Logo" src="/logos/Main.png" />
      </BasicLink>
    </LogoWrapper>
  );
}

export default Logo;
