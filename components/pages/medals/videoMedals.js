import React, { useState } from "react";
import { CirclePicker } from "react-color";
import styled from "styled-components";
import { useRecoilValue } from "recoil";
import { userState } from "@atoms";
import axios from "axios";
import ContentCard from "@common/content/ContentCard";
import { Typography, Divider, Space, Col, Row, Button, Spin } from "antd";
import { StarFilled } from "@ant-design/icons";
const { Text } = Typography;

function VideoMedals({ videoMedals }) {

  const handleChangeComplete = (color) => {
    setFormLoading(true);
    setColor(color.hex);
    handleCreateCompanyPreferences(color.hex);
  };

  function renderMedal(medals, type, color){
    if (medals.type > 0){
        return(
        <Row>
            <StarFilled 
                style={{ fontSize: "32px", color: "orange"}}
            />
        </Row>
        )
    }
    else{
        return(
            <Row>
                <Text>Not Unlocked!</Text>
            </Row>
        )
    }
}

  function determineMedals(){
    if (videoMedals.medals === "None"){
        return (
            <Text>
                No Medals for this Video yet!
            </Text>
        )
    }

    else{
        return(
            <Row>
                <Col>
                    <Row> Bronze</Row>
                    {renderMedal(videoMedals.medals, "bronze", "orange")}
                </Col>
                <Col>
                    <Row> Silver</Row>
                        {renderMedal(videoMedals.medals, "silver", "grey")}
                </Col>
                <Col>
                    <Row> Gold</Row>
                    {renderMedal(videoMedals.medals, "gold", "gold")}
                </Col>
            </Row>
        )
    }
  }

  return (
    <Spin spinning={formLoading}>
       <Row>
            <Text>Title: </Text>
            <Text>{videoMedals.title}</Text>
       </Row>
       <Row>
            {determineMedals()}
       </Row>
    </Spin>
  );
}

export default VideoMedals;
