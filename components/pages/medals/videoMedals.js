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

function VideoMedals({videoTitle, userMedals }) {

    ///////////////
    // Rendering //
    ///////////////

    function renderMedal(color, unlocked=false){
        if (!unlocked){
            color = "rgba(203,237,255, 0.85)"
        }
        else if (color === "bronze"){
            color = "#EEAB25"
        }
        else if (color === "silver"){
            color = "#A0AAB7"
        }
        else if (color === "gold"){
            "#FFEF00"
        }
        return(
            <div style={{borderColor: color, borderWidth: 8, padding: 5, borderStyle: "solid",  borderRadius: 45, justifyContent: 'center', margin: 10}}>
                <StarFilled style={{ fontSize: "64px", color: color}}/>
            </div>
        )
    }

    function renderTitle(){
        let displayTitleArray = videoTitle.split("_")
        displayTitleArray = displayTitleArray.map(word => {
            return word.charAt(0).toUpperCase() + word.slice(1)
        })
        let title = ""
        displayTitleArray.forEach(word => {
            if (title !== ""){
                title = title + " "
            }
            title = title + word
        });
        return title
    }

    function determineUnlocked(color, title){
        if (userMedals[title]){
            if (userMedals[title][color.toUpperCase()]){
                return true
            }
        }
        return false
    }

    return(
        <div style={{margin: 10, backgroundColor: 'rgba(236,236,236,0.65)', borderRadius: 35, justifyContent: 'center'}}>
            <p style={{fontSize: 28, fontWeight: 700, textAlign: 'center'}}>
                {renderTitle()
            }</p>
            <div style={{display: 'flex', flexDirection: "row", justifyContent: 'space-between', paddingRight: 75, paddingLeft: 75}}>
                {renderMedal("bronze", determineUnlocked("bronze", videoTitle))}
                {renderMedal("silver", determineUnlocked("silver", videoTitle))}
                {renderMedal("gold", determineUnlocked("gold", videoTitle))}
            </div>
        </div>
        
    )
}



export default VideoMedals;
