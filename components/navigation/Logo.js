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
    width: 70px;
  }
`;

function Logo() {
  return (
    <LogoWrapper>
      <BasicLink href='/'>
        <img alt="Tom App Logo" src="/logos/LogoSVG.svg" />
      </BasicLink>
    </LogoWrapper>
  );
}

export default Logo;
