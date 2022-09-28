import React from "react";
import styled from "styled-components";
import { setTwoToneColor } from "@ant-design/icons";
import { Typography, Space } from "antd";
import BasicLink from "@common/BasicLink";

const { Text } = Typography;
setTwoToneColor("#f0932b");

const ArticleIconWrapper = styled.div`
  border-radius: 7px;
  padding: 32px 24px;
  cursor: pointer;
  border: 2px solid transparent;
  transition: ${(props) => props.theme.transitions.short};
  :hover {
    border: 2px solid ${(props) => props.theme.colors.darkPrimary};
    box-shadow: -1px 3px 11px 2px rgb(55 55 55 / 18%);
    transform: translate(0, -8px);
  }
  & svg {
    font-size: 40px;
    color: ${(props) => props.theme.colors.darkPrimary};
    margin-right: 10px;
    margin-top: 10px;
  }
  & strong {
    font-size: 19px;
    font-weight: 600;
    color: ${(props) => props.theme.colors.darkPrimary};
  }
  @media (max-width: ${(props) => props.theme.breakPoints.md}) {
    padding: 18px 14px;
  }
`;

function SupportArticleIcon({ href, title, description, icon }) {
  return (
    <BasicLink href={href ? href : "/"}>
      <ArticleIconWrapper>
        <Space align="start">
          {icon}
          <Space direction="vertical" size={7}>
            <Text strong>{title}</Text>
            <Text>{description}</Text>
          </Space>
        </Space>
      </ArticleIconWrapper>
    </BasicLink>
  );
}

export default SupportArticleIcon;
