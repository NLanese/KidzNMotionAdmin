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
        <Row gutter={16} justify="center" align="middle" style={{width: '100px'}}>
            <StarFilled 
                style={{ fontSize: "32px", color: color}}
            />
        </Row>
        )
    }
    else{
        return(
            <Row gutter={16} justify="space-between" align="middle">
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
                <Row gutter={16} justify="space-between" align="middle">
                    <Col>
                    <ContentCard>
                    <Row style={{textAlign: 'center'}}>
                            <h3>Bronze</h3> 
                        </Row>
                        {renderMedal(videoMedals.medals, "bronze", "orange")}
                    </ContentCard>
                    </Col>
                    <Col>
                    <ContentCard>
                    <Row style={{textAlign: 'center'}}>
                            <h3>Silver</h3> 
                        </Row>
                        {renderMedal(videoMedals.medals, "silver", "silver")}
                    </ContentCard>
                    </Col>
                    <Col>
                    <ContentCard>
                    <Row style={{textAlign: 'center'}}>
                            <h3>Gold</h3> 
                        </Row>
                        {renderMedal(videoMedals.medals, "gold", "yellow")}
                    </ContentCard>
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
            <ContentCard>
                <Row gutter={16} justify="space-between" align="middle">
                    <h3>{videoMedals.title}</h3>
                </Row>
                <Row gutter={16} justify="space-between" align="middle">
                    {determineMedals()}
                </Row>
            </ContentCard>
        </Spin>
    );
}

export default VideoMedals;
