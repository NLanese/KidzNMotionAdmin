// React
import React, { useEffect, useState } from "react";

// Ant Design
import styled from "styled-components";
import { Divider, message } from "antd";

// Next
import { NextSeo } from "next-seo";

// Components
import PageHeader from "@common/PageHeader";
import VideoMedals from "../components/pages/medals/videoMedals";

// Recoil 
import { userState } from "@atoms";
import { useRecoilState } from "recoil";

// Mutations and Queries
import { GET_CHILD_VIDEO_STATISTICS, GET_ALL_USER_MEDALS } from "../graphql/operations";
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

    // User
    const [user, setUser] = useRecoilState(userState);

    // Child who's medal is rendering
    const [selectedChild, setSelectedChild] = useState(user.role === "CHILD" ? user : user.children[0])

    // User Medals
    const [medals, setMedals] = useState([])

    // Loading
    const [loading, setLoading] = useState(true)

    
    ////////////////
    // RENDERINGS //
    ////////////////

    function renderVidMedal(vid, key){
        if (vid.id === "great_job"){
            return
        }
        return <VideoMedals videoTitle={vid.id} userMedals={medals} key={key}/>
    }

    const renderMedalsDisplay = () => {
        return mapObjectKeys(VIDEOS, renderVidMedal)
    }

    ///////////////
    // FUNCTIONS //
    ///////////////

    // Grabs Medals
    async function getChildsMedals(){

        // QUERY
        await client.query({
            query: GET_ALL_USER_MEDALS,
            fetchPolicy: 'network-only',
            variables: {
                childCareID: (
                    user.role === "THERAPIST" ? selectedClient.plan.id : selectedChild.childCarePlans[0].id
                )
            }
        }).then( (resolved) => {
            setMedals(processMedalData(resolved.data.getAllUserMedals))
            setLoading(false)
            return
        }).catch(err => {
            setLoading(false)
        })
    }

    // Processes the Query Data into Object Format
    function processMedalData(getAllUserMedals){
        let rObj = {}
        getAllUserMedals.forEach(medal => {
            rObj = ({...rObj, [medal.title]: addToMedalKey(rObj[medal.title], medal)})
        })
        return rObj
    }

    // Handles Object Data Additionl
    function addToMedalKey(obj, medal){
        return {...obj, [medal.level]: [medal]}
    }

    // Gets Medals, sets object
    useEffect(() => {
        getChildsMedals()
    }, [selectedChild])

    /////////////////
    // MAIN RETURN //
    /////////////////
    if (loading){
        <IndexWrapper>
        <NextSeo title="Medals" />
        <PageHeader title="All Video Medals" />

        </IndexWrapper>
    }
    return (
        <IndexWrapper>
            <NextSeo title="Medals" />
            <PageHeader title="All Video Medals" />
            <div style={{width: '100%', justifyContent: 'center', alignItems: 'center', padding: 25, margin: 10}}>
                {renderMedalsDisplay()}
            </div>
        </IndexWrapper>
    );
}

export default MedalsPage;
