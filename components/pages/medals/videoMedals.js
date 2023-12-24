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

  const handleChangeComplete = (color) => {
    setFormLoading(true);
    setColor(color.hex);
    handleCreateCompanyPreferences(color.hex);
  };

  return (
    <Spin spinning={formLoading}>
        <View>

        </View>
        {/* <Row gutter={16}>
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
        </Row> */}
    </Spin>
  );
}

export default ColorThemeSettingsForm;
