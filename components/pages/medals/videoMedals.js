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

function VideoMedals({ videoMedals, key, formLoading }) {


    // Renders a single Medal
    function renderMedal(medals, type, color){
    if (medals[type] > 0){
        return(
        <Row>
            <StarFilled 
                style={{ fontSize: "32px", color: color}}
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

    // Renders "No Medals" or the Title and 3 Medal Slots for One Video
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

    /////////////////
    // Main Return //
    /////////////////
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
