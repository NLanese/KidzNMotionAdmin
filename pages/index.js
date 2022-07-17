import React from "react";
import styled from "styled-components";
import { Col, Space, Alert, Button } from "antd";
import ContentCard from "@common/content/ContentCard";
import PageHeader from "@common/PageHeader";
import { userState } from "@atoms";
import { useRecoilValue } from "recoil";

const IndexWrapper = styled.div`
  max-width: 800px;
  margin: auto;
`;

function Index() {
  const user = useRecoilValue(userState);

  return (
    <IndexWrapper>
      <PageHeader title="Welcome To Kids In Motion " />
    </IndexWrapper>
  );
}

export default Index;
