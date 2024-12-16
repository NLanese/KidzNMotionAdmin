    // React
    import React, { useEffect, useState } from "react";
    import styled from "styled-components";
    import { Comment } from '@ant-design/compatible';


    // Recoil
    import { userState, patientDataState } from "@atoms";
    import { useRecoilState } from "recoil";

    // Date
    var dateFormat = require("dateformat");

    // Videos
    import VIDEOS from "../../constants/videos";

    // Style
    const IndexWrapper = styled.div`
    max-width: ${(props) => props.theme.contentSize.standard};
    margin: auto;
    padding: 20px;

    .comments-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 20px;
    }

    .comments-toggle button {
        margin-left: 10px;
    }

    @media (max-width: ${(props) => props.theme.breakPoints.sm}) {
        .comments-header {
        flex-direction: column;
        align-items: flex-start;
        }
    }
    `;

    ///////////////
    // Component //
    ///////////////
    function PatientComments({ router }) {

    ///////////   
    // State //
    ///////////

        // Current User
        const [user, setUser] = useRecoilState(userState);

        // Page Loading
        const [loading, setLoading] = useState(true)

        // Curent Patient
        const [patientDetail, setPatientDetail] = useRecoilState(patientDataState);

        // Start Date
        const [DateRangeStart, setDateRangeStart] = useState(() => {
            const lastWeek = new Date();
            lastWeek.setDate(lastWeek.getDate() - 7);
            return lastWeek;
        });

        // End Date
        const [DateRangeEnd, setDateRangeEnd] = useState(new Date());

        // ALL Comments
        const [comments, setComments] = useState([]);

        // Comments within Date Range
        const [filteredComments, setFilteredComments] = useState([]);

        // Toggle between "ALL" and "VIDEO"
        const [viewMode, setViewMode] = useState("ALL"); 

    /////////////
    // Effects //
    /////////////

        // Reroutes off page is User is not a Therapist
        useEffect(() => {
            if (user.role !== "THERAPIST") { Router.push("/") }
        }, [user]);

        useEffect(() => {
            if(patientDetail && loading){
                setComments(patientDetail.carePlan.comments)
                setLoading(false)
            }
        }, [patientDetail])

        // Fetches all Comments, sorts within range
        useEffect(() => {
            console.log(DateRangeStart)
            console.log(DateRangeEnd)
            if (patientDetail?.id && comments.length > 0) {
                filterComments();
            }
        }, [comments, DateRangeStart, DateRangeEnd]);

    ///////////////
    // Functions //
    ///////////////

        // Filters the Comments based on Date Range
        const filterComments = async () => {
            setLoading(true)
            let datedComments = [...comments].filter(comment => {
                if (new Date(comment.createdAt) >= DateRangeStart && new Date(comment.createdAt) <= DateRangeEnd){
                    return true
                } 
                return false
            })
            console.log("Setting filtered comments...")
            console.log(datedComments)
            setFilteredComments(datedComments)
            setLoading(false)
        };

        // Changes Comment Type
        const toggleView = (mode) => {
            setViewMode(mode);
        };

        // Determines which Comments are to be displayed based off Date Range and Type
        const determineDisplayedComments = () => {
            if (viewMode === "ALL"){
                return filteredComments
            }
            else if (viewMode === "VIDEO"){
                // TO DO
                return filteredComments
            }
        }

        // Handles Date Changes for both Boundaries
        const handleDateChange = (e, type) => {
            const newDate = new Date(e.target.value);
            type === "start" ? setDateRangeStart(newDate) : setDateRangeEnd(newDate);
        };

    ////////////////
    // Renderings //
    ////////////////

        const renderComments = () => {
            if (filteredComments.length > 0 || loading){
                return filteredComments.map(commentObject => {
                    return(
                        <div key={commentObject.id} style={{padding: 3.5, borderTop: '2px solid #ffbe76', display: 'flex', flexDirection: 'row'}}>
                            <div style={{flex: 9}}>
                            <Comment
                                author={"You"}
                                key={commentObject.id}
                                avatar="/logos/Main.png"
                                content={commentObject.content}
                                datetime={dateFormat(commentObject.createdAt, "m/dd hh:MM tt")}
                            />
                            </div>
                            <div style={{flex: 3}}>
                                {renderForVideo(commentObject)}
                                {renderForAssignment(commentObject)}
                            </div>
                        </div>
                    )
                })
            }
        }

        // (In Comment -- Optional) Renders Related Video Title
        const renderForVideo = (commentObject) => {
            if (commentObject.videoId){
            return(
                <Comment
                    author={"For Video"}
                    key={(commentObject.id) + "-" + (commentObject.videoId)}
                    content={getVideoTitleById(commentObject.videoId)}
                />
            )
            }
        }

        // (In Comment -- Optional) Renders Related Assignment Title
        const renderForAssignment = (commentObject) => {
            if (commentObject.assignmentId){
            return(
                <Comment
                    author={"For Assignment"}
                    key={(commentObject.id) + "-" + (commentObject.assignmentId)}
                    content={getAssignmentTitleById(commentObject.assignmentId)}
                />
            )
            }
        }

        // Finds Assignment Title for Rendering
        function getAssignmentTitleById(id){
            if (!patientDetail || !id ){
              return
            }
            let assignments = patientDetail.carePlan.assignments
            const assign = Object.values(assignments).find(ass => ass.id === id);
            return assign ? assign.title : `Assignment not found.`;
        }

        // Finds Video Title for Rendering
        function getVideoTitleById(id) {
            if (!id || !VIDEOS){
              return
            }
            const video = Object.values(VIDEOS).find(video => video.id === id);
            return video ? video.title : `Video with id "${id}" not found.`;
          }

    /////////////////
    // Main Render //
    /////////////////
    
    return (
        <IndexWrapper>
        <div className="comments-header">
            <h2>Patient Comments</h2>
            <div>
            <label>
                Start Date:
                <input
                type="date"
                value={DateRangeStart.toISOString().slice(0, 10)}
                onChange={(e) => handleDateChange(e, "start")}
                />
            </label>
            <label>
                End Date:
                <input
                type="date"
                value={DateRangeEnd.toISOString().slice(0, 10)}
                onChange={(e) => handleDateChange(e, "end")}
                />
            </label>
            </div>
        </div>

        <div className="comments-toggle">
            <button onClick={() => toggleView("ALL")}>
            View All Comments
            </button>
            <button onClick={() => toggleView("VIDEO")}>
            View Comments by Video
            </button>
        </div>

        <div className="comments-list" style={{backgroundColor: 'white', marginTop: 35}}>
            {renderComments()}
        </div>
        </IndexWrapper>
    );
    }

    export default PatientComments;
