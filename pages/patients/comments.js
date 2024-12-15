    // React
    import React, { useEffect, useState } from "react";
    import styled from "styled-components";

    // Recoil
    import { userState, patientDataState } from "@atoms";
    import { useRecoilState } from "recoil";

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

    // Component
    function PatientComments({ router }) {
    // State
    const [user, setUser] = useRecoilState(userState);
    const [patientDetail, setPatientDetail] = useRecoilState(patientDataState);
    const [DateRangeStart, setDateRangeStart] = useState(() => {
        const lastWeek = new Date();
        lastWeek.setDate(lastWeek.getDate() - 7);
        return lastWeek;
    });
    const [DateRangeEnd, setDateRangeEnd] = useState(new Date());
    const [comments, setComments] = useState([]);
    const [filteredComments, setFilteredComments] = useState([]);
    const [viewMode, setViewMode] = useState("ALL"); // Toggle between "ALL" and "VIDEO"

    // Effects
    useEffect(() => {
        // Reroutes off page is User is not a Therapist
        if (user.role !== "THERAPIST") { Router.push("/") }
        console.log("In COMMENTS Page with the following Data:", patientDetail);
    }, [user, patientDetail]);

    useEffect(() => {
        // Fetch comments within the selected date range
        if (patientDetail?.id) {
        fetchComments();
        }
    }, [DateRangeStart, DateRangeEnd, patientDetail]);

    // Functions
    const fetchComments = async () => {
        try {
        const response = await fetch(
            `/api/comments?patientId=${patientDetail.id}&start=${DateRangeStart.toISOString()}&end=${DateRangeEnd.toISOString()}`
        );
        const data = await response.json();
        setComments(data);
        setFilteredComments(data);
        } catch (error) {
        console.error("Error fetching comments:", error);
        }
    };

    const handleDateChange = (e, type) => {
        const newDate = new Date(e.target.value);
        type === "start" ? setDateRangeStart(newDate) : setDateRangeEnd(newDate);
    };

    const toggleView = (mode) => {
        setViewMode(mode);
        if (mode === "ALL") {
        setFilteredComments(comments);
        } else if (mode === "VIDEO") {
        setFilteredComments(comments.filter((comment) => comment.type === "video"));
        }
    };

    // Main Render
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

        <div className="comments-list">
            {filteredComments.length > 0 ? (
            filteredComments.map((comment) => (
                <div key={comment.id} className="comment-item">
                <p>
                    <strong>{comment.author}</strong> ({new Date(comment.date).toLocaleString()}):
                </p>
                <p>{comment.content}</p>
                {comment.type === "video" && <p><em>Type: Video</em></p>}
                </div>
            ))
            ) : (
            <p>No comments found for the selected range.</p>
            )}
        </div>
        </IndexWrapper>
    );
    }

    export default PatientComments;
