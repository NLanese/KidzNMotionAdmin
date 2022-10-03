import React, { useState } from "react";

import styled from "styled-components";
import { Comment, message, Popconfirm, Empty } from "antd";
var dateFormat = require("dateformat");

import { useMutation } from "@apollo/client";
import { DELETE_CHILD_CARE_PLAN_COMMENT } from "@graphql/operations";

const CommentContainer = styled.div`
  margin-top: 40px;
`;

function CarePlanComments({ comments, getUser, returnUrl, assignmentID }) {
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
      .then(async (resolved) => {
        await getUser();

        message.success("Successfully Deleted Comment");
      })
      .catch((error) => {
        message.error("Something went wrong here.");
      });
  };

  const renderComments = () => {
    return comments.map((commentObject) => {
      if (!assignmentID) {
        if (commentObject.assignmentId) return;
      } else {
        if (commentObject.assignmentId !== assignmentID) return;
      }

      return (
        <div key={commentObject.id}>
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
      );
    });
  };

  if (comments.length === 0) {
    return (
      <CommentContainer style={{ textAlign: "center" }}>
        <Empty description="You have not created any comments yet" />
      </CommentContainer>
    );
  }

  return <CommentContainer>{renderComments()}</CommentContainer>;
}

export default CarePlanComments;
