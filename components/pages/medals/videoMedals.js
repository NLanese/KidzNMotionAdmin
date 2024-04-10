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

function VideoMedals({videoTitle, userMedals, size="md" }) {

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

        let medalSize = "64px"
        if (size === "sm"){
            medalSize = "32px"
        }


        return(
            <div style={{borderColor: color, borderWidth: 8, padding: 5, borderStyle: "solid",  borderRadius: 45, justifyContent: 'center', margin: 10}}>
                <StarFilled style={{ fontSize: medalSize, color: color}}/>
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

    function renderTitleDiv(){
        if (size == "sm"){
            return null
        }
        else{
            return(
                <div>
                    <p style={{fontSize: 28, fontWeight: 700, textAlign: 'center'}}>
                        {renderTitle()}
                    </p>
                </div>
            )
        }
    }

    let padding = 75
    if (size === "sm"){
        padding = 20
    }
    return(
        <div style={{margin: 10, backgroundColor: 'rgba(236,236,236,0.65)', borderRadius: 35, justifyContent: 'center'}}>
            {renderTitleDiv()}
            <div style={{display: 'flex', flexDirection: "row", justifyContent: 'space-between', paddingRight: padding, paddingLeft: padding}}>
                {renderMedal("bronze", determineUnlocked("bronze", videoTitle))}
                {renderMedal("silver", determineUnlocked("silver", videoTitle))}
                {renderMedal("gold", determineUnlocked("gold", videoTitle))}
            </div>
        </div>
        
    )
}



export default VideoMedals;
