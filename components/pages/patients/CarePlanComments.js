// React and Antd
import React, { useState } from "react";
import styled from "styled-components";
import { message, Popconfirm, Empty } from "antd";
// import { Comment } from '@ant-design/compatible';
import Comment from "antd";

// Date
import dateFormat from "dateformat";

// Apollo / GraphQl
import { useMutation } from "@apollo/client";
import { DELETE_CHILD_CARE_PLAN_COMMENT } from "@graphql/operations";

// Videos
import VIDEOS from "../../../constants/videos"


// Style
const CommentContainer = styled.div`
  margin-top: 40px;
`;

///////////////
// Component //
///////////////

function CarePlanComments({
  comments,
  getUser,
  patientDetail,
  showOnlyVid,
  showOnlyAssign,
}) {


  // Mutations
  const [deleteChildCarePlanComment, {}] = useMutation(
    DELETE_CHILD_CARE_PLAN_COMMENT
  );

  const deleteComment = async (commentID) => {
    await deleteChildCarePlanComment({
      variables: {
        commentID: commentID,
      },
    })
      .then(async () => {
        await getUser();
        message.success("Successfully Deleted Comment");
        setLocalComments((prevComments) =>
          prevComments.filter((comment) => comment.id !== commentID)
        );
      })
      .catch(() => {
        message.error("Something went wrong here.");
      });
  };

  // Renders Comments
  const renderComments = () => {
    return comments.map((commentObject) => {
      if (showOnlyVid){
        if (commentObject.videoId !== showOnlyVid){
          return false
        }
      }
      if (showOnlyAssign){
        if (commentObject.assignmentId !== showOnlyAssign){
          return false
        }
      }
      return (
        <div key={commentObject.id} style={{padding: 3.5, borderTop: '2px solid #ffbe76', display: 'flex', flexDirection: 'row'}}>
          <div style={{flex: 9, height: '100%'}}>
            <Comment
              author={"You"}
              key={commentObject.id}
              avatar="/logos/Main.png"
              content={commentObject.content}
              datetime={dateFormat(commentObject.createdAt, "m/dd hh:MM tt")}
              actions={[
                <Popconfirm
                    key={"topLeft"}
                    placement="topLeft"
                    title={"Are you sure you want to delete this comment?"}
                    onConfirm={() => deleteComment(commentObject.id)}
                    okText="Yes, Delete"
                    cancelText="No, Cancel"
                >
                    <span style={{ color: "#e74c3c" }}>Delete Comment</span>
                </Popconfirm>,
                ]}
            />
          </div>
          <div style={{flex: 3, height: '100%'}}>
              {renderForVideo(commentObject)}
              {renderForAssignment(commentObject)}
          </div>
        </div>
      );
    });
  };

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

  function getVideoTitleById(id) {
    if (!id || !VIDEOS){
      return
    }
    const video = Object.values(VIDEOS).find(video => video.id === id);
    return video ? video.title : `Video with id "${id}" not found.`;
  }

  function getAssignmentTitleById(id){
    if (!patientDetail || !id ){
      return
    }
    let assignments = patientDetail.carePlan.assignments
    const assign = Object.values(assignments).find(ass => ass.id === id);
    return assign ? assign.title : `Assignment not found.`;
  }

  // Returns Empty Container if no Comments
  if (comments.length === 0) {
    return (
      <CommentContainer style={{ textAlign: "center" }}>
        <Empty description="You have not created any comments yet" />
      </CommentContainer>
    );
  }

  // Main Return
  return <CommentContainer>{renderComments()}</CommentContainer>;
}

export default CarePlanComments;