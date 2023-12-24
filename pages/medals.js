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
import { forEachObjectKeys } from "../functions/objectHandlers";

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
        getVideosAndRelatedMedals()
    }

    ///////////////
    // FUNCTIONS //
    ///////////////

    async function getUserMedals(){
        const token = localStorage.getItem("token")

        if (token){
            const resolved = await client.query({
                query: GET_CHILD_VIDEO_STATISTICS,
                variables: { childID: selectedChild.id },
                fetchPolicy: 'network-only'
            })

            if (resolved.data.getChildVideoStatistics){
                console.log(resolved)
                setAllMedals(resolved.data.getChildVideoStatistics.allTimeStats.individualVideoDetailedStats)
            }
            else{
                console.log("Query Failed")
            }
        }
    }

    function getVideosAndRelatedMedals(){
        function setVideoMedals(video){
            if (video.level > 0){
                setVideoMedals(videoMedals => ({...videoMedals, 
                    [video.id]: {
                        title: video.title,
                        medals: allMedals.video.id ? allMedals.video.id : "None"
                    }
                }))
            }
        }
        forEachObjectKeys(VIDEOS, setVideoMedals)
        setLoading(false)
    }
    
    useEffect(() => {
        getUserMedals()
        getVideosAndRelatedMedals()
    }, [selectedChild])


    /////////////////
    // MAIN RETURN //
    /////////////////
    return (
        <IndexWrapper>
        <NextSeo title="Medals" />
        <PageHeader title="All Video Medals" />
        <ColorThemeSettingsForm
            initialValues={user}
            // submitOrganizationSettings={submitUserProfile}
        />
        <Divider />
        <AvatarSettingsForm
            initialValues={user}
            // submitOrganizationSettings={submitUserProfile}
        />
        </IndexWrapper>
    );
}

export default MedalsPage;
