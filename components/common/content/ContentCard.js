import React from "react";
import styled from "styled-components";
import { Card } from "antd";
import { applyStyleModifiers } from "styled-components-modifiers";

const CONTENT_CARD_MODIFIER = {
  naked: ({ theme }) => `
     box-shadow: none;
     border: none;
     background: transparent;
     @media (max-width: ${theme.breakPoints.md}) {
       .ant-card-body {
         padding-top: 8px;
         padding-bottom: 8px;
       }
    }
  `,
  noSidePadding: ({ theme }) => `
  .ant-card-body {
    padding-left: 0px;
    padding-right: 0px;
  }
  `,
  tightPadding: ({ theme }) => `
  .ant-card-body {
    padding: 10px;
  }
  `,
  noPadding: ({ theme }) => `
  .ant-card-body {
    padding: 0px;
  }
  `,
};

const ContentCardWrapper = styled(Card)`
  box-shadow: ${(props) => props.theme.boxShadow.hard};
  border: 1px solid white;
  margin-bottom: 20px;
  .ant-card-head {
    padding: 0px 20px;
    min-height: 34px;
  }
  .ant-card-body {
    padding: 18px 20px;
  }
  .ant-card-head-title {
    padding: 12px 0px;
  }
  .ant-card-extra {
    padding: 12px 0px;
  }
  ${applyStyleModifiers(CONTENT_CARD_MODIFIER)};
`;

function ContentCard({ children, title, extra, modifiers }) {
  return (
    <ContentCardWrapper title={title} extra={extra} modifiers={modifiers}>
      {children}
    </ContentCardWrapper>
  );
}

export default ContentCard;
