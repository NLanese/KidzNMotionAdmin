// React
import React, { useEffect, useState } from "react";

// Ant Design
import styled from "styled-components";
import { Divider, message } from "antd";

// Next
import { NextSeo } from "next-seo";

// Components
import PageHeader from "@common/PageHeader";
import ColorThemeSettingsForm from "@forms/profileSettings/ColorThemeSettingsForm";
import AvatarSettingsForm from "@forms/profileSettings/AvatarSettingsForm";
import VideoMedals from "../components/pages/medals/videoMedals";

// Recoil 
import { userState } from "@atoms";
import { useRecoilState } from "recoil";

// Mutations and Queries
import { GET_CHILD_VIDEO_STATISTICS } from "../graphql/operations";
import client from "@utils/apolloClient";
import VIDEOS from "@constants/videos";
import { forEachObjectKeys, mapObjectKeys } from "../functions/objectHandlers";

const IndexWrapper = styled.div`
  max-width: ${(props) => props.theme.contentSize.tight};
  margin: auto;
  .ant-typography strong {
    font-size: 16.5px;
  }
  @media (max-width: ${(props) => props.theme.breakPoints.sm}) {
    .ant-divider {
      margin: 2px 0px;
    }
  }
`;


///////////////
// COMPONENT //
///////////////

function MedalsPage() {

    ///////////
    // STATE //
    ///////////

    const [user, setUser] = useRecoilState(userState);
    const [selectedChild, setSelectedChild] = useState(user.role === "CHILD" ? user : user.children[0])
    const [videoMedals, setVideoMedals] = useState({})
    const [allMedals, setAllMedals] = useState({})
    const [loading, setLoading] = useState(true)

    
    ////////////////
    // RENDERINGS //
    ////////////////

    const renderChildVideoMedalList = () => {
        if (loading){
            return(
                <span></span>
            ) 
        }
        function renderVidMed(vidMed, key){
            console.log(vidMed)
            return <VideoMedals videoMedals={vidMed} key={key} formLoading={loading}/>
        }
        return mapObjectKeys(videoMedals, renderVidMed)
    }

    ///////////////
    // FUNCTIONS //
    ///////////////

    // Gets all the Videos and Assigns them to a State
    async function getUserMedals(){
        const token = localStorage.getItem("token")

        if (token){
            const resolved = await client.query({
                query: GET_CHILD_VIDEO_STATISTICS,
                variables: { childID: selectedChild.id },
                fetchPolicy: 'network-only'
            })

            if (resolved.data.getChildVideoStatistics){
                console.log(resolved.data.getChildVideoStatistics.allTimeStats)
                setAllMedals(resolved.data.getChildVideoStatistics.allTimeStats.individualVideoDetailedStats)
                console.log("All Medals Set")
            }
            else{
                console.log("Query Failed")
            }
        }
        return
    }

    // Using Videos and Medal State, creates VideoMedal objects for Rendering
    function getVideosAndRelatedMedals(){

        // Function for Iteration. Adds an individual Medal to State
        function determineVideoMedals(video) {
            if (video.level > 0) {
                console.log(video.id)
                console.log(allMedals)
                console.log(allMedals[video.id])
                setVideoMedals(prevVideoMedals => {
                    const newVideoMedals = {
                        ...prevVideoMedals,
                        [video.id]: {
                            title: video.title,
                            medals: allMedals[video.id] ? allMedals[video.id] : "None"
                        }
                    };
                    console.log("Video Medals", newVideoMedals); // Log the updated state
                    return newVideoMedals;
                });
            }
        }

        // Runs Iteration
        forEachObjectKeys(VIDEOS, determineVideoMedals)
        setLoading(false)
    }
    
    // Gets Medals, sets object
    useEffect(() => {
        getUserMedals()
    }, [selectedChild])

    useEffect(() => {
        console.log("All Medals Change Caught")
        console.log(allMedals)
        if (Object.keys(allMedals).length > 0){
            getVideosAndRelatedMedals()
        }
    }, [allMedals])


    /////////////////
    // MAIN RETURN //
    /////////////////
    return (
        <IndexWrapper>
        <NextSeo title="Medals" />
        <PageHeader title="All Video Medals" />
        {renderChildVideoMedalList()}
        </IndexWrapper>
    );
}

export default MedalsPage;
