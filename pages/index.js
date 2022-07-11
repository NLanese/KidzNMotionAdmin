import React from "react";
import styled from "styled-components";
import {
  Col,
  Space,
  Alert,
  Button,
} from "antd";
import ContentCard from "@common/content/ContentCard";

import { userState } from "@atoms";
import { useRecoilValue } from "recoil";


const IndexWrapper = styled.div`
  max-width: 800px;
  margin: auto;
`;

function Index() {
  const user = useRecoilValue(userState);



  const renderSignUpTag = () => {
    if (user.role !== "OWNER") return;
    if (!user.dsp) return;
    if (user.dsp.paid) return;
    if (localStorage.getItem("stripeSessionID")) return;

    if (user.dsp.accountStanding === "Free") {
      let daysLeft = parseInt(
        16 -
          (new Date().getTime() - new Date(user.dsp.createdAt).getTime()) /
            (1000 * 3600 * 24)
      );
      return (
        <Col xs={24} sm={24}>
          <Alert
            message={`${daysLeft} Days Left On Trial (Activate)`}
            description="Activate your subscription to manage your team and get the most out of Kids In Motion"
            type="info"
            showIcon
            action={
              <Space>
                <Button onClick={() => checkout()} size="small" type="primary">
                  Activate
                </Button>
              </Space>
            }
          />
          <br />
        </Col>
      );
    }
  };

  return <IndexWrapper></IndexWrapper>;
}

export default Index;
