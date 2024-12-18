    // React
    import React, { useEffect, useState } from "react";
    import { Form, Field } from "react-final-form";
    import { SelectField } from "@fields";
    import styled from "styled-components";
    import { Comment } from '@ant-design/compatible';
    import { message, Popconfirm, Button, Row, Col, Select, Spin } from "antd";


    // Recoil
    import { userState, patientDataState } from "@atoms";
    import { useRecoilState } from "recoil";

    // Query
    import client from "@utils/apolloClient";
    import { GET_ALL_USER_MEDALS } from "@graphql/operations";


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

        // ALL Curent Patient Medals
        const [medals, setMedals] = useState([])


        // Medals and Comment Render Chunks
        const [renderList, setRenderList] = useState([])

        const [filteredRenderList, setFilteredRenderList] = useState([])

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

        // Filtered Comments
        const [filteredComments, setFilteredComments] = useState([]);

        // Toggle between "ALL" and "VIDEO"
        const [viewMode, setViewMode] = useState("ALL"); 

        // Selected Video to Track Progress of
        const [givenVideo, setGivenVideo] = useState(false)

    /////////////
    // Effects //
    /////////////

        // Reroutes off page is User is not a Therapist
        useEffect(() => {
            if (user.role !== "THERAPIST") { Router.push("/") }
        }, [user]);

        // Fetches Data upon Page Entrance
        useEffect(() => {
            if(patientDetail && loading){
                setComments(patientDetail.carePlan.comments)
                getChildsMedals()
            }
        }, [patientDetail])

        // Fetches all Comments and Medals; sorts within range
        useEffect(() => {
            if (patientDetail?.id && comments.length > 0) {
                handleContent()
            }
        }, [comments, medals, DateRangeStart, DateRangeEnd]);

        // Adjusts final Render List 
        useEffect(() => {
            setLoading(true)
            if (givenVideo){
                setViewMode("VIDEO")
                let newRenderList = renderList.filter(itm => {
                    if (itm.__typename === "Medal"){
                        if (itm.title === givenVideo){
                            return true
                        }
                        return false
                    }
                    else if (itm.__typename === "Comment"){
                        if (itm.videoId === givenVideo){
                            return true
                        }
                        return false
                    }
                })
                setFilteredRenderList(newRenderList)
            }
            else{
                setViewMode("ALL")
            }
            setLoading(false)
        }, [givenVideo])

    ///////////////
    // Functions //
    ///////////////

        //////////
        // Page //
        //////////

            // Handles Date Changes for both Boundaries
            const handleDateChange = (e, type) => {
                const newDate = new Date(e.target.value);
                type === "start" ? setDateRangeStart(newDate) : setDateRangeEnd(newDate);
            };

            // Handles the Changing of Data based on Date Ranges
            const handleContent = async () => {
                await filterComments()
                await processMedalData(medals)
                let fullList = [...comments, ...medals]
                fullList = fullList.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt)); 
                setRenderList(fullList)
                setLoading(false)
            }

            // Handles Submission of Specific Video of Progress Tracking
            const handleSubmitVideoFilter = (formValues) => {
                setGivenVideo(formValues.videoId)
            }

        //////////////
        // Comments //
        //////////////

            // Filters the Comments based on Date Range
            const filterComments = async () => {
                setLoading(true)
                let datedComments = [...comments].filter(comment => {
                    if (new Date(comment.createdAt) >= DateRangeStart && new Date(comment.createdAt) <= DateRangeEnd){
                        return true
                    } 
                    return false
                })
                setFilteredComments(datedComments)
            };


        ////////////
        // Medals //
        ////////////

            // Gets all Medals from Relevant Child
            async function getChildsMedals(){
                // QUERY
                await client.query({
                    query: GET_ALL_USER_MEDALS,
                    fetchPolicy: 'network-only',
                    variables: {
                        childCareID: patientDetail.carePlan.id
                    }
                }).then( (resolved) => {
                    setMedals(resolved.data.getAllUserMedals)
                    setLoading(false)
                    return
                }).catch(err => {
                    console.warn("Error getting the Medals: ", err)
                    setLoading(false)
                })
            }

            // Filters and Sorts Medals by Date
            async function processMedalData(getAllUserMedals) {
                const filteredMedals = getAllUserMedals.filter(medal => {
                    if (new Date(medal.createdAt) >= DateRangeStart && new Date(medal.createdAt) <= DateRangeEnd){
                        return true
                    } 
                    return false
                })
                const filteredAndSortedMedals = filteredMedals.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt)); 
                return filteredAndSortedMedals;
            }

    ////////////////
    // Renderings //
    ////////////////

        //////////
        // Page //
        //////////

            // Sets values for Videos Dropdown
            const renderVideoOptions = () => {
                let options = [];
                for (var key in VIDEOS) {
                if (VIDEOS[key].id !== "great_job") {
                    if (VIDEOS.hasOwnProperty(key)) {
                    options.push({
                        value: VIDEOS[key].id,
                        text: VIDEOS[key].title,
                    });
                    }
                }
                }
                options = options.sort((a, b) => a.text.localeCompare(b.text)); // Sort alphabetically
                options.unshift({text: "None", value: false})
                return options;
            };

            // Renders Dropdown for all Videos to pick a Specific one
            const renderVideoSelectionDropdown = () => {
                return(
                <Form
                    onSubmit={handleSubmitVideoFilter}
                    mutators={{
                        setValue: ([field, value], state, { changeValue }) => {
                        changeValue(state, field, () => value);
                        },
                    }}
                    render={({
                        pristine,
                        invalid,
                        submitting,
                        form,
                        handleSubmit
                    }) => (
                        <form
                            onSubmit={(event) => {
                                handleSubmit(event)
                                form.mutators.setValue("videoId", "");
                            }}
                        >
                        <Field
                            name="videoID"
                            component={SelectField}
                            options={[...renderVideoOptions()]} 
                            htmlType="dropdown"
                            label="Attach a Related Video if Necessary"
                            placeholder="No Related Video"
                            size={"large"}
                            required={false}
                        />
                        <Button
                            type="default"
                            loading={submitting}
                            htmlType="submit"
                            block={true}
                            size={"small"}
                            disabled={invalid || pristine}
                            >
                            Filter for This Video
                        </Button>
                        </form>
                    )}
                />
                )
            }

            // Renders the Filtered (or all) Content 
            const renderContent = () => {
                const toRender = (viewMode === ("VIDEO"))? filteredRenderList : renderList
                return toRender.map(obj => {
                    if (obj.__typename === "Comment"){
                        return renderSingleComment(obj)
                    }
                    else if (obj.__typename === "Medal"){
                        return renderSingleMedal(obj)
                    }
                })
            }


        /////////////
        // Comment //
        /////////////

            // Renders a Single Comment
            const renderSingleComment = (commentObject) => {
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
         
        ///////////
        // Medal //
        ///////////

            // Renders a Single Comment
            const renderSingleMedal = (medal) => {
                return(
                    <div key={medal.id} style={{padding: 3.5, borderTop: '2px solid #ffbe76', display: 'flex', flexDirection: 'row'}}>
                        <div style={{flex: 9}}>
                        <Comment
                            author={`${patientDetail.firstName} ${patientDetail.lastName}`}
                            key={medal.id}
                            avatar="/logos/Main.png"
                            content={`${medal.level} Medal For ${getTitleFromSlug(medal.title)}`}
                            datetime={dateFormat(medal.createdAt, "m/dd hh:MM tt")}
                        />
                        </div>
                        {/* <div style={{flex: 3}}>
                            {renderForVideo(commentObject)}
                            {renderForAssignment(commentObject)}
                        </div> */}
                    </div>

                    // <div>
                    //     <p>{medal.level} Medal For {getTitleFromSlug(medal.title)} on {medal.createdAt} </p>
                    // </div>
                )
            }

            // Gets the Video Title from_a_slug
            const getTitleFromSlug = (slug) => {
                let words = slug.split("_");
                let capWords = words.map(word => {
                    return `${word[0].toUpperCase()}${word.slice(1)}`;
                });
            
                if (capWords.length > 1) {
                    return capWords.join(" ");
                } else {
                    return capWords[0]; // Return the single word as a string
                }
            };

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

        <div className="comments-toggle" style={{display: 'flex', justifyContent: 'row', width: '40%'}}>
            <div style={{flex: 4}}>
                {renderVideoSelectionDropdown()}
            </div>
            <div style={{flex: 2}}/>
            <div style={{flex: 6}}>
                <button onClick={() => print()}>
                Generate PDF
                </button>
            </div>
        </div>

        <div className="comments-list" style={{backgroundColor: 'white', marginTop: 35}}>
            {renderContent()}
        </div>
        </IndexWrapper>
    );
    }

    export default PatientComments;
