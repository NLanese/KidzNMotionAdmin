import React, { useState } from "react";
import { CirclePicker } from "react-color";
import styled from "styled-components";
import { useRecoilValue } from "recoil";
import { userState } from "@atoms";
import axios from "axios";
import ContentCard from "@common/content/ContentCard";
import { Typography, Divider, Space, Col, Row, Button, Spin } from "antd";
const { Text } = Typography;

function VideoMedals({ video }) {
  const user = useRecoilValue(userState);
  const [color, setColor] = useState("#ff9800");
  const [formLoading, setFormLoading] = useState(false);

  const handleCreateCompanyPreferences = async (color) => {
    setFormLoading(true);

    // Rest function to update a users stripe subscription id
    await axios({
      method: "post",
      url: "/api/edit-web-app-color-settings",
      data: {
        token: localStorage.getItem("token"),
        color: color,
      },
    })
      .then(({ data }) => {
        window.location.reload();
      })
      .catch(({ response }) => {
        return null;
      });

    setFormLoading(false);
  };

  const handleChangeComplete = (color) => {
    setFormLoading(true);
    setColor(color.hex);
    handleCreateCompanyPreferences(color.hex);
  };

  return (
    <Spin spinning={formLoading}>
      <Row gutter={16}>
        <Col xs={24} md={5}>
          <ContentCard modifiers={["naked", "noSidePadding"]}>
            <Space direction="vertical" size="small">
              <Text strong>Color Theme</Text>
              <Text type="secondary">
                Set the default color of the web app by selecting one of the
                colors listed
              </Text>
            </Space>
          </ContentCard>
        </Col>
        <Col xs={24} md={{ span: 18, offset: 1 }}>
          <ContentCard>
            <CirclePicker
              width={"100%"}
              circleSize={50}
              onChangeComplete={handleChangeComplete}
              color={user.webAppColorSettings}
            />
          </ContentCard>
        </Col>
      </Row>
    </Spin>
  );
}

export default ColorThemeSettingsForm;
