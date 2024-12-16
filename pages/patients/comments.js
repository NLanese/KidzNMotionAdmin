    // React
    import React, { useEffect, useState } from "react";
    import { Form, Field } from "react-final-form";
    import { SelectField } from "@fields";
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

        // Selected Video to Track Progress of
        const [givenVideo, setGivenVideo] = useState(false)

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
        const filterComments = () => {
            setLoading(true)
            let datedComments = [...comments].filter(comment => {
                if (new Date(comment.createdAt) >= DateRangeStart && new Date(comment.createdAt) <= DateRangeEnd){
                    return true
                } 
                return false
            })
            setFilteredComments(datedComments)
            setLoading(false)
        };

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

        function determineSelectedVideo(){

        }

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
