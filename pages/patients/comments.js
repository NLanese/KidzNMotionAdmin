    // React
    import React, { useEffect, useState } from "react";
    import { Form, Field } from "react-final-form";
    import { SelectField } from "@fields";
    import styled from "styled-components";
    import { Comment } from '@ant-design/compatible';

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

        // Filtered Medals by Date
        const [filteredMedals, setFilteredMedals] = useState([])

        // Medals and Comment Render Chunks
        const [renderList, setRenderList] = useState([])

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

        // Selected Video to Track Progress of
        const [givenVideo, setGivenVideo] = useState(false)

    /////////////
    // Effects //
    /////////////

        // Reroutes off page is User is not a Therapist
        useEffect(() => {
            if (user.role !== "THERAPIST") { Router.push("/") }
            console.log(patientDetail)
        }, [user]);

        useEffect(() => {
            if(patientDetail && loading){
                setComments(patientDetail.carePlan.comments)
                getChildsMedals().then(() => {

                })
                .catch(() => {setLoading(false)})
               
            }
        }, [patientDetail])

        // Fetches all Comments and Medals; sorts within range
        useEffect(() => {
            if (patientDetail?.id && comments.length > 0) {
                handleContent()
            }
        }, [comments, medals, DateRangeStart, DateRangeEnd]);

    ///////////////
    // Functions //
    ///////////////

        //////////
        // Page //
        //////////

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

            const handleContent = async () => {
                await filterComments()
                await processMedalData(medals)
                let fullList = [...comments, ...medals]
                fullList = fullList.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt)); 
                console.log("Full List")
                console.log(fullList)
                setRenderList(fullList)
                setLoading(false)
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

            // Finds Comments that have a Video ID
            const extractVideoComments = (these) => {
                let videoComments = these.filter(comment => {
                    console.log(comment)
                    if (comment.videoID){
                        return true
                    }
                    else{
                        return false
                    }
                })
            }

            function determineSelectedVideo(){

            }

        ////////////
        // Medals //
        ////////////

            // Gets all Medals from Relevant Child
            async function getChildsMedals(){
                console.log("Querying medals....")
                // QUERY
                await client.query({
                    query: GET_ALL_USER_MEDALS,
                    fetchPolicy: 'network-only',
                    variables: {
                        childCareID: patientDetail.carePlan.id
                    }
                }).then( (resolved) => {
                    console.log("Setting Medals")
                    console.log(resolved.data.getAllUserMedals)
                    setMedals(resolved.data.getAllUserMedals)
                    setLoading(false)
                    return
                }).catch(err => {
                    console.log("Query done goofed")
                    console.warn("Error getting the Medals: ", err)
                    setLoading(false)
                })
            }

            // Filters and Sorts Medals by Date
            async function processMedalData(getAllUserMedals) {
                console.log("Processing Medal Data")
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
                return options;
            };

            const renderVideoSelectionDropdown = () => {
                return(
                <Form
                    onSubmit={determineSelectedVideo}
                    mutators={{
                        setValue: ([field, value], state, { changeValue }) => {
                        changeValue(state, field, () => value);
                        },
                    }}
                    render={({
                        handleSubmit,
                        pristine,
                        invalid,
                        submitting,
                        form,
                        values,
                    }) => (
                        <form
                        onSubmit={(event) => {
                            handleSubmit(event).then((event) => {
                            form.mutators.setValue("commentContent", "");
                            });
                        }}
                        >
                        <Field
                            name="videoID"
                            component={SelectField}
                            options={renderVideoOptions()} 
                            htmlType="dropdown"
                            label="Attach a Related Video if Necessary"
                            placeholder="No Related Video"
                            size={"large"}
                            required={false}
                        />
                        <Button
                            type="primary"
                            loading={submitting}
                            htmlType="submit"
                            block={true}
                            size={"large"}
                            disabled={invalid || pristine}
                            >
                            Search for Video Progress
                        </Button>
                        </form>
                    )}
                />
                )
            }

            function formatDateString(dateString) {
                const date = new Date(dateString);
                const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based
                const day = String(date.getDate()).padStart(2, '0');
                const year = String(date.getFullYear()).slice(-2); // Get last 2 digits of year
                return `${month}-${day}-${year}`;
            }

            const renderContent = () => {
                return renderList.map(obj => {
                    console.log(obj)
                    console.log(obj.__typename)
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
                console.log(medal)
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

        <div className="comments-toggle">
            <button onClick={() => toggleView("ALL")}>
            View All Progress
            </button>
            <button onClick={() => toggleView("VIDEO")}>
            View Specific Video Progress
            </button>
            <button onClick={() => print()}>
            Generate PDF
            </button>
        </div>

        <div className="comments-list" style={{backgroundColor: 'white', marginTop: 35}}>
            {renderContent()}
        </div>
        </IndexWrapper>
    );
    }

    export default PatientComments;
