    // React
    import React, { useEffect, useState, useRef } from "react";
    import { Form, Field } from "react-final-form";
    import styled from "styled-components";
    import { Comment } from '@ant-design/compatible';
    import { message, Popconfirm, Button, Row, Col, Select, Spin } from "antd";
    import TextArea from "antd/lib/input/TextArea";


    // Recoil
    import { userState, patientDataState } from "@atoms";
    import { useRecoilState } from "recoil";

    // Query
    import client from "@utils/apolloClient";
    import { GET_ALL_USER_MEDALS } from "@graphql/operations";


    // Date
    import dateFormat from "dateformat";

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

        // Users // 

            // Current User
            const [user, setUser] = useRecoilState(userState);

        // Patient //

            // Curent Patient
            const [patientDetail, setPatientDetail] = useRecoilState(patientDataState);

            // ALL Curent Patient Medals
            const [medals, setMedals] = useState([])

            // Date Filtered Patient Medals
            const [filteredMedals, setFilteredMedals] = useState([])

            // Patient Assignments
            const [patientAssigns, setPatientAssigns] = useState([])

            // Selected Patient Assignments
            const [selectedAssign, setSelectedAssign] = useState(false)

            // Selected Video to Track Progress of
            const [givenVideo, setGivenVideo] = useState(false)



        // Page //

            // Page Loading
            const [loading, setLoading] = useState(true)

            // Medals and Comment Render Chunks
            const [renderList, setRenderList] = useState([])

            // Filtered Render List for Specific Videos
            const [filteredRenderList, setFilteredRenderList] = useState([])

            // Toggle between "ALL" and "VIDEO"
            const [viewMode, setViewMode] = useState("ALL"); 


        // Date //

            // Start Date
            const [DateRangeStart, setDateRangeStart] = useState(() => {
                const lastWeek = new Date();
                // lastWeek.setDate(lastWeek.getDate() - 7);
                return lastWeek;
            });

            // End Date
            const [DateRangeEnd, setDateRangeEnd] = useState(new Date());


        // Comments //

            // ALL Comments
            const [comments, setComments] = useState([]);

            // Filtered Comments
            const [filteredComments, setFilteredComments] = useState([]);

            const [assignComments, setAssignComments] = useState([])

        // Document //

            const [progress, setProgress] = useState("")

            const [showProgressInput, setShowProgressInput] = useState(false)

            const [dia, setDia] = useState(false)

            const [showDiaInput, setShowDiaInput] = useState(false)

            const [dur, setDur] = useState(false)

            const [showDurInput, setShowDurInput] = useState(false)

            const [goal, setGoal] = useState(false)

            const [showGoalInput, setShowGoalInput] = useState(false)

    
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
                setPatientAssigns(patientDetail.carePlan.assignments)
                getChildsMedals()
            }
        }, [patientDetail])

        // Fetches all Comments and Medals; sorts within range
        useEffect(() => {
            if (patientDetail?.id && comments.length > 0) {
                handleContent().then( (res) => {
                    stageContent(res).then( (res) => {
                        setRenderList(prev => [...res])
                    })
                })
            }
        }, [comments, medals, DateRangeStart, DateRangeEnd]);

        // Adjusts final Render List 
        useEffect(() => {
            setLoading(true)
            if (givenVideo && viewMode === "VIDEO"){
                filterContentForVideos()
            }
            else{
                setViewMode("ALL")
            }
            setLoading(false)
        }, [givenVideo])

        // Finishes Loading when RenderList is complete
        useEffect(() => {
            if (viewMode === "ALL" || viewMode === "ASSIGN"){
                if (renderList){
                    setLoading(false)
                }
            }
        }, [renderList])

        // Finishes Loading when FilteredRenderList is complete
        useEffect(() => {
            if (viewMode === "VIDEO"){
                if (filteredRenderList){
                    setLoading(false)
                }
            }
        }, [filteredRenderList])

        // Sets Date Ranges based on View Mode (i.e. sets all dates for VIDEO and ASSIGN)
        useEffect(() =>{
            if (viewMode === "VIDEO"){
                setShowProgressInput(false)
                setSelectedAssign(false)
                setRenderList([])
                setDateRangeStart(new Date("Jan 01 1999"))
            }
            else if (viewMode === "ASSIGN"){
                setGivenVideo(false)
                setRenderList([])
                setDateRangeStart(new Date("Jan 01 1999"))
            }
            else if (viewMode === "ALL"){
                setSelectedAssign(false)
                setGivenVideo(false)
                setShowProgressInput(false)
                const lastWeek = new Date();
                lastWeek.setDate(lastWeek.getDate() - 7);
                setDateRangeStart(lastWeek)
            }
        }, [viewMode])

        useEffect(() => {
            if (selectedAssign && viewMode === "ASSIGN"){
                console.log(patientAssigns)
                setDateRangeStart( new Date(selectedAssign.dateStart) )
                setDateRangeEnd( new Date(selectedAssign.dateDue) )
            }
        }, [selectedAssign])


    ///////////////
    // Functions //
    ///////////////

        //////////
        // Page //
        //////////

            // Handles Date Changes for both Boundaries
            const handleDateChange = (e, type) => {
                const newDate = new Date(e.target.value);
                    setDateRangeStart(newDate)
                    setDateRangeEnd(newDate)
            };

            // Handles the Changing of Data based on Date Ranges
            const handleContent = async () => {
                setLoading(true)
                if (selectedAssign){
                    let obj = filterContentForAssign()
                    let med = await processMedalData(medals)
                    let com = await filterComments(obj.com)
                    return [...com, ...med]
                }
                else{
                    let com = await filterComments()
                    let med = await processMedalData(medals)
                    return [...com, ...med]
                }
            }

            // Handles the Dropdown Selection of Document / Progression Type
            const handleTypeChange = (input, value) => {
                setViewMode(value)
                input.onChange(value)
            }

            // Additional Async Prep to ensure proper rendering on state changes
            const stageContent = async (prepList) => {
                console.log("PREP LIST")
                console.log(prepList)
                let fullList = prepList.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt)); 
                console.log("FULL LIST")
                console.log(fullList)
                return fullList
            }

            // Handles Submission of Specific Video of Progress Tracking
            const handleSubmitVideoFilter = (formValues) => {
                setGivenVideo(formValues.videoID)
            }

        //////////////
        // Comments //
        //////////////

            // Filters the Comments based on Date Range
            const filterComments = async (input=false) => {
                if (input){
                    let datedComments = [...input].filter(comment => {
                        if (new Date(comment.createdAt) >= DateRangeStart){
                            console.log(comment.createdAt , " is after ", DateRangeStart)
                            if (new Date(comment.createdAt) <= DateRangeEnd){
                                console.log(comment.createdAt , " is before ", DateRangeEnd)
                                return true
                            }
                        } 
                        return false
                    })
                    setFilteredComments([...datedComments])
                    return datedComments
                }
                else{
                    console.log(comments)
                    console.log("Looking for comments made on ", DateRangeStart)
                    let datedComments = [...comments].filter(comment => {
                        const isSameDate = new Date(comment.createdAt).toISOString().split("T")[0] === DateRangeStart.toISOString().split("T")[0];
                        if (isSameDate){
                            return true
                        }
                        // if (new Date(comment.createdAt) >= DateRangeStart){
                        //     console.log(comment.createdAt , " is after ", DateRangeStart)
                        //     if (new Date(comment.createdAt) <= DateRangeEnd){
                        //         console.log(comment.createdAt , " is before ", DateRangeEnd)
                        //         return true
                        //     }
                        // } 
                        return false
                    })
                    setFilteredComments([...datedComments])
                    return datedComments
                }
                
            };

        ////////////
        // Videos //
        ////////////

            const handleVideoChange = () => {

            }

            // Filters the Comments for a specific Video
            const filterContentForVideos = () => {
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
                setFilteredRenderList([...newRenderList])
            }


        /////////////////
        // Assignments //
        /////////////////

            const handleAssignmentChange = (input, value) => {
                input.onChange(value)
                let selected = {}
                patientAssigns.forEach(assign => {
                    if (assign.id === value){
                        setSelectedAssign(assign)
                    }
                })
            }

            // Filters the Comments for a specific Assignmnet
            const filterContentForAssign = () => {
                const thisID = selectedAssign.id
                const includedVideos = selectedAssign.videos.map(vid => {
                    return vid.contentfulID.toLowerCase().replace(" ", "_")
                })
                console.log("Looking for comments with assignment id of ", thisID, " or with videos named ")
                console.log(includedVideos)
                let thisAssignComments = []
                let com = []
                let med = []
                renderList.filter(itm => {

                    if (itm.__typename === "Medal"){
                        console.log("----------")
                        console.log("Medal for")
                        console.log(itm.title)
                        if (includedVideos.includes(itm.title)){
                            console.log("FOUND")
                            med = [...med, itm]
                        }
                        else{
                            console.log("Not found...")
                        }
                    }

                    else if (itm.__typename === "Comment"){
                        if (itm.assignmentId){
                            console.log("----------")
                            console.log("Assignment Comment for")
                            console.log("Assignment Comment, does it match the id?")
                            console.log(itm.assignmentId, " -- ", thisID)
                            if (itm.assignmentId === thisID){
                                console.log("FOUND")
                                thisAssignComments = [...thisAssignComments, itm]
                            }
                            else{
                                console.log("Not found...")
                            }
                        }
                        
                        else if (itm.videoId){
                            console.log("----------")
                            console.log("Video Comment for")
                            console.log(itm.videoId)
                            if (includedVideos.includes(itm.videoId)){
                                console.log("FOUND")
                                com = [...com, itm]
                            }
                        }

                        else{
                            console.log("----------")
                            console.log("Not Relevant...")
                        }
                    }
                })
               return {com: com, med: med}
            }

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
                    return
                }).catch(err => {
                    console.warn("Error getting the Medals: ", err)
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
                console.log(filteredAndSortedMedals)
                setFilteredMedals([...filteredAndSortedMedals]);
                return filteredAndSortedMedals
            }

    ////////////////
    // Renderings //
    ////////////////

        //////////
        // Page //
        //////////

            // Renders View Mode Dropdown
            const renderProgressionTypeDropdown = () => {
                return(
                    <Form
                    style={{width: '70%'}}
                    onSubmit={handleSubmitVideoFilter}
                    render={({ pristine, invalid, submitting, handleSubmit }) => (
                      <form onSubmit={handleSubmit}>
                        <Field
                          name="videoID"
                          render={({ input }) => (
                            <Select
                              {...input}
                              options={[{label: "General Progress", value: "ALL"}, {label: "Execrise Progress", value: "VIDEO"}, {label: "Assignment Progress", value: 'ASSIGN'}]} // Ant Design's Select expects 'options'
                              placeholder="Nothing Selected"
                              size="large"
                              onChange={(value) => handleTypeChange(input, value)} // Update form state
                              value={input.label} 
                              style={{minWidth: 150, paddingLeft: 5, marginBottom: 15}}
                            />
                          )}
                        />
                      </form>
                    )}
                  />
                )
            }

            // Sets values for Videos Dropdown
            const renderVideoOptions = () => {
                let options = [];
                for (var key in VIDEOS) {
                if (VIDEOS[key].id !== "great_job") {
                    if (VIDEOS.hasOwnProperty(key)) {
                    options.push({
                        value: VIDEOS[key].id,
                        label: VIDEOS[key].title,
                    });
                    }
                }
                }
                options = options.sort((a, b) => a.label.localeCompare(b.label)); // Sort alphabetically
                options.unshift({label: "None", value: false})
                return options;
            };

            // Renders Dropdown for all Videos to pick a Specific one
            const renderVideoSelectionDropdown = () => {
                return(
                    <div style={{height: '100%', justifyContent: 'center', alignItems: 'center', justifyItems: 'center', alignContent: 'center'}}>
                        <Form
                        onSubmit={handleSubmitVideoFilter}
                        render={({ pristine, invalid, submitting, handleSubmit }) => (
                        <form onSubmit={handleSubmit}>
                            <Field
                            name="videoID"
                            render={({ input }) => (
                                <Select
                                {...input}
                                options={renderVideoOptions()} // Ant Design's Select expects 'options'
                                placeholder="No Selected Video"
                                size="large"
                                onChange={(value) => handleVideoChange(input, value)} // Update form state
                                value={input.label} 
                                style={{minWidth: 150, paddingLeft: 5, marginBottom: 15}}
                                />
                            )}
                            />
                        </form>
                        )}
                        />
                    </div>
                    
                )
            }


            // Sets values for Videos Dropdown
            const renderAssignOptions = () => {
                let options = [];
                options = patientAssigns.map(assign => {
                    return {label: assign.title, value: assign.id}
                })
                return options;
            };

            // Renders Dropdown for all Assignments to pick a Specific one (If applicable)
            const renderAssignmentSelectionDropdown = () => {
                return(
                    <div style={{height: '100%', justifyContent: 'center', alignItems: 'center', justifyItems: 'center', alignContent: 'center'}}>
                        <Form
                        onSubmit={handleSubmitVideoFilter}
                        render={({ pristine, invalid, submitting, handleSubmit }) => (
                            <form onSubmit={handleSubmit}>
                            <Field
                                name="videoID"
                                render={({ input }) => (
                                <Select
                                    {...input}
                                    options={renderAssignOptions()} // Ant Design's Select expects 'options'
                                    placeholder="No Related Video"
                                    size="large"
                                    onChange={(value) => handleAssignmentChange(input, value)} // Update form state
                                    value={input.label} 
                                    style={{minWidth: 150, paddingLeft: 5, marginBottom: 15}}
                                />
                                )}
                            />
                            </form>
                        )}
                        />
                    </div>
                )
            }

            // Renders the Filtered (or all) Content 
            const renderContent = () => {
                if (loading){
                    console.log("LOADING")
                    return 
                }
                console.log("NOT LOADING -- ", viewMode)
                if (viewMode === "ALL"){
                    return renderList.map(obj => {
                        if (obj.__typename === "Comment"){
                            return renderSingleComment(obj)
                        }
                        else if (obj.__typename === "Medal"){
                            return renderSingleMedal(obj)
                        }
                    })
                }
                else if (viewMode === "VIDEO"){
                    return filteredRenderList.map(obj => {
                        if (obj.__typename === "Comment"){
                            return renderSingleComment(obj)
                        }
                        else if (obj.__typename === "Medal"){
                            return renderSingleMedal(obj)
                        }
                    })
                }
                else if (viewMode === "ASSIGN"){
                    return renderList.map(obj => {
                        if (obj.__typename === "Comment"){
                            return renderSingleComment(obj)
                        }
                        else if (obj.__typename === "Medal"){
                            return renderSingleMedal(obj)
                        }
                    })
                }
                
            }

            // Renders a top level document dropdown depending on the ViewMode
            const renderFinalDropdown = () => {
                // if (viewMode === "ALL"){
                    return(
                        <div style={{display: 'flex', flexDirection: 'row', paddingTop: 25}}>
                            <div style={{padding: 5}}>
                                <label>
                                    Selected Date:
                                    <input
                                    type="date"
                                    value={DateRangeStart.toISOString().slice(0, 10)}
                                    // onChange={(e) => handleDateChange(e, "start")}
                                    onChange={(e) => handleDateChange(e, "all")}
                                    />
                                </label>
                            </div>
                            {/* <div style={{padding: 5}}>
                                <label>
                                    Selected End Date:
                                    <input
                                    type="date"
                                    value={DateRangeEnd.toISOString().slice(0, 10)}
                                    onChange={(e) => handleDateChange(e, "end")}
                                    />
                                </label>
                            </div> */}
                        </div>
                    )
                // }

                // else if (viewMode === "VIDEO"){
                //     return renderVideoSelectionDropdown()
                // }

                // else if (viewMode === "ASSIGN"){
                //     return renderAssignmentSelectionDropdown()
                // }

                // else return(
                //     <div>
                //         No Document Type selected
                //     </div>
                // )
            }

            // Renders Top Document Section
            const renderTopSection = () => {
                return(
                    <div className="comments-header">
                    <div style={{width: '100%'}}>
                        <div style={{padding: 1.5, display: 'flex', flexDirection: 'row', border: "1px solid grey", width: '100%'}}>
                            <div style={{width: '50%', borderRight: "1px solid grey", paddingLeft: 5}}>
                            <p><strong>Name:</strong> {patientDetail.firstName} {patientDetail.lastName}</p>
                            </div>      
                            <div style={{width: '50%', paddingLeft: 5}}>
                            <p><strong>DOB:</strong> {patientDetail.childDateOfBirth.toString().substring(0,10)}</p>
                            </div>          
                        </div>
                        <div style={{padding: 1.5, display: 'flex', flexDirection: 'row', border: "1px solid grey", width: '100%'}}>
                            <div style={{width: '50%', borderRight: "1px solid grey", paddingLeft: 5}}>
                                {renderDiagnosisSection()}
                                {/* <p>Diagnosis: {patientDetail.carePlan.child.diagnosis ? patientDetail.carePlan.child.diagnosis.length > 0 ? patientDetail.carePlan.child.diagnosis: "No Given Diagnosis" : "No Given Diagnosis"}</p> */}
                            </div>      
                            <div style={{width: '50%', paddingLeft: 5}}>
                                {/* <p>Functional Level: {patientDetail.carePlan.level}</p> */}
                                {renderDurationSection()}
                            </div>          
                        </div>
                        {/* <div style={{padding: 1.5, display: 'flex', flexDirection: 'row', border: "1px solid grey", width: '100%'}}>
                            <div style={{width: '50%', borderRight: "1px solid grey", paddingLeft: 5}}>
                                <p>Progression of</p>
                                {renderProgressionTypeDropdown()}
                            </div>      
                            <div style={{width: '50%', paddingLeft: 5}}>
                                {renderFinalDropdown()}
                            </div>          
                        </div> */}
                        <div style={{padding: 1.5, display: 'flex', flexDirection: 'row', border: "1px solid grey", width: '100%', height: '200%'}}>
                            <div style={{width: '50%', borderRight: "1px solid grey", paddingLeft: 5}}>
                                <p><strong>Functional Level:</strong>  {patientDetail.carePlan.level}</p>
                            </div>      
                            <div style={{width: '50%', paddingLeft: 5}}>
                                {renderGoalSection()}
                            </div>          
                        </div>
                        <div style={{padding: 1.5, display: 'flex', flexDirection: 'row', border: "1px solid grey", width: '100%'}}>
                            {renderProgressSection()}
                        </div>

                        {/* {renderTopSectionContinued()} */}
                    </div>
                </div>
                )
            }

            // More content for Assignments 
            const renderTopSectionContinued = () => {
                if (!selectedAssign){
                    return null
                }
                else if (viewMode === "ASSIGN"){
                    return(
                        <>
                            <div style={{padding: 1.5, display: 'flex', flexDirection: 'row', border: "1px solid grey", width: '100%'}}>
                                <div style={{width: '100%', paddingLeft: 5}}>
                                    <p>Goal: {selectedAssign.description ? selectedAssign.description : "No Specific Goal Provided"}</p>
                                </div>        
                            </div>
                            <div style={{padding: 1.5, display: 'flex', flexDirection: 'row', border: "1px solid grey", width: '100%'}}>
                                {renderProgressSection()}
                            </div>
                            {renderAssignmentCommentsOnTop()}
                        </>
                        
                    )
                }
            }

            const renderAssignmentCommentsOnTop = () => {
                return assignComments.map(com => {
                    <>
                        <div style={{padding: 1.5, display: 'flex', flexDirection: 'row', border: "1px solid grey", width: '100%'}}>
                            <div style={{width: '100%', paddingLeft: 5}}>
                                <p>Observation: {com}</p>
                            </div>        
                        </div>
                    </>
                })
            }

            // Progress Text or Input Area
            const renderProgressSection= () => {
                if (!showProgressInput){
                    return(
                        <div style={{width: '100%', paddingLeft: 5, display: 'flex', flexDirection: 'row'}}>
                            <div style={{flex: 9}}>
                                <p>Progress: {progress ? progress : "No Input Provided"}</p>
                            </div>
                            <div style={{flex: 3, marginLeft: 50, justifyContent: 'center', alignContent: 'center', justifyItems: 'center', alignItems: 'center'}}>
                                <Button type="round" style={{backgroundColor: 'lightgrey'}}
                                onClick={() => setShowProgressInput(true)}
                                >
                                Add Input
                                </Button>
                            </div>
                        </div>
                    )
                }
                else if (showProgressInput){
                    return(
                        <div style={{width: '100%', paddingLeft: 5, display: 'flex', flexDirection: 'row'}}>
                            <div style={{flex: 9}}>
                                <TextArea 
                                    onChange={(event) => setProgress(event.target.value)}
                                />
                            </div>
                            <div style={{flex: 3, marginLeft: 50, justifyContent: 'center', alignContent: 'center', justifyItems: 'center', alignItems: 'center'}}>
                                <Button type="round" style={{backgroundColor: 'lightgrey'}}
                                onClick={() => setShowProgressInput(false)}
                                >
                                Enter
                                </Button>
                            </div>
                           
                        </div>
                    )
                }
            }

            // Diagnosis Text or Input Area
            const renderDiagnosisSection= () => {
                if (!showDiaInput){
                    return(
                        <div style={{width: '100%', display: 'flex', flexDirection: 'row'}}>
                            <div style={{flex: 9}}>
                            <p><strong>Diagnosis:</strong> {dia ? dia : "No Input Provided"}</p>
                            </div>
                            <div style={{flex: 3, marginLeft: 20, justifyContent: 'center', alignContent: 'center', justifyItems: 'center', alignItems: 'center'}}>
                                <Button type="round" style={{backgroundColor: 'lightgrey'}}
                                onClick={() => setShowDiaInput(true)}
                                >
                                Add Input
                                </Button>
                            </div>
                        </div>
                    )
                }
                else if (showDiaInput){
                    return(
                        <div style={{width: '100%', display: 'flex', flexDirection: 'row'}}>
                            <div style={{flex: 9}}>
                                <TextArea 
                                    onChange={(event) => setDia(event.target.value)}
                                />
                            </div>
                            <div style={{flex: 3, marginLeft: 50, justifyContent: 'center', alignContent: 'center', justifyItems: 'center', alignItems: 'center'}}>
                                <Button type="round" style={{backgroundColor: 'lightgrey'}}
                                onClick={() => setShowDiaInput(false)}
                                >
                                Enter
                                </Button>
                            </div>
                           
                        </div>
                    )
                }
            }

            const renderDurationSection= () => {
                if (!showDurInput){
                    return(
                        <div style={{width: '100%', paddingLeft: 5, display: 'flex', flexDirection: 'row'}}>
                            <div style={{flex: 9}}>
                                <p><strong>Duration:</strong> {dur ? dur : "No Input Provided"}</p>
                            </div>
                            <div style={{flex: 2, marginLeft: 20, justifyContent: 'center', alignContent: 'center', justifyItems: 'center', alignItems: 'center'}}>
                                <Button type="round" style={{backgroundColor: 'lightgrey'}}
                                onClick={() => setShowDurInput(true)}
                                >
                                Add Input
                                </Button>
                            </div>
                        </div>
                    )
                }
                else if (showDurInput){
                    return(
                        <div style={{width: '100%', paddingLeft: 5, display: 'flex', flexDirection: 'row'}}>
                            <div style={{flex: 9}}>
                                <TextArea 
                                    onChange={(event) => setDur(event.target.value)}
                                />
                            </div>
                            <div style={{flex: 2, marginLeft: 20, justifyContent: 'center', alignContent: 'center', justifyItems: 'center', alignItems: 'center'}}>
                                <Button type="round" style={{backgroundColor: 'lightgrey'}}
                                onClick={() => setShowDurInput(false)}
                                >
                                Enter
                                </Button>
                            </div>
                           
                        </div>
                    )
                }
            }

            const renderGoalSection= () => {
                if (!showGoalInput){
                    return(
                        <div style={{width: '100%', paddingLeft: 5, display: 'flex', flexDirection: 'row'}}>
                            <div style={{flex: 9}}>
                                <p><strong>Goal:</strong> {goal ? goal : "No Input Provided"}</p>
                            </div>
                            <div style={{flex: 2, marginLeft: 20, justifyContent: 'center', alignContent: 'center', justifyItems: 'center', alignItems: 'center'}}>
                                <Button type="round" style={{backgroundColor: 'lightgrey'}}
                                onClick={() => setShowGoalInput(true)}
                                >
                                Add Input
                                </Button>
                            </div>
                        </div>
                    )
                }
                else if (showGoalInput){
                    return(
                        <div style={{width: '100%', paddingLeft: 5, display: 'flex', flexDirection: 'row'}}>
                            <div style={{flex: 9}}>
                                <TextArea 
                                    onChange={(event) => setGoal(event.target.value)}
                                />
                            </div>
                            <div style={{flex: 2, marginLeft: 20, justifyContent: 'center', alignContent: 'center', justifyItems: 'center', alignItems: 'center'}}>
                                <Button type="round" style={{backgroundColor: 'lightgrey'}}
                                onClick={() => setShowGoalInput(false)}
                                >
                                Enter
                                </Button>
                            </div>
                           
                        </div>
                    )
                }
            }

        /////////////
        // Comment //
        /////////////

            // Renders a Single Comment
            const renderSingleComment = (commentObject) => {
                return(
                    <div key={commentObject.id} style={{padding: 3.5, borderTop: '2px solid #ffbe76', display: 'flex', flexDirection: 'row'}}>
                        <div style={{flex: 8}}>
                        <Comment
                            author={`${user.firstName} ${user.lastName}`}
                            key={commentObject.id}
                            avatar="/logos/Main.png"
                            content={commentObject.content}
                            datetime={dateFormat(commentObject.createdAt, "m/dd hh:MM tt")}
                        />
                        </div>
                        <div style={{flex: 4}}>
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
                        author={"Exercise:"}
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
                
                return video ? `${video.title}${getMuscleGroupsForVideo(video.title)}` : `Video with id "${id}" not found.`;
            }

            function getMuscleGroupsForVideo(video){
                if (video.toUpperCase() === "SQUAT"){
                    return " : (Gluteus Maximus and Quadriceps Femoris strength)"
                }
                else if (video.toUpperCase() === "LEG LIFTS"){
                    return " : (Pelvis drop on lifted leg indicates contralateral Gluteus Medius and Minimus weakness)"
                }
                else if (video.toUpperCase() === "ROLLING"){
                    return " : (Trunk Strength, Symmetry)"
                }
                else{
                    return ""
                }
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
        <h2 style={{textAlign: 'center'}}>Status Report</h2>
        {renderTopSection()}
        <div style={{display: 'flex', flexDirection: 'row'}}>
            <div style={{flex: 8}}>
                {renderFinalDropdown()}
            </div>
            <div style={{flex: 2, alignContent: 'flex-end', alignContent: 'flex-start', paddingTop: 5}}>
                <button onClick={() => print()}>
                Generate PDF
                </button>
            </div>
        </div>
        
        <div className="comments-toggle" style={{display: 'flex', justifyContent: 'row', width: '80%'}}>
            <div style={{flex: 7}}>
                {/* {renderVideoSelectionDropdown()} */}
            </div>
            <div style={{flex: 1}}/>
            
        </div>

        <div className="comments-list" style={{backgroundColor: 'white', marginTop: 35}}>
            {renderContent()}
        </div>
        </IndexWrapper>
    );
    }

    export default PatientComments;
