
// React Imports
import React, { useEffect, useState } from "react";
import styled from "styled-components";
import ReactPlayer from "react-player";

// Ant Design
import { message, Popconfirm, Empty, Input, Button, Form, Select, Typography, Space } from "antd";
import { Comment } from "@ant-design/compatible";
import ContentCard from "@common/content/ContentCard";

// Constants
import VIDEOS from "../../../constants/videos";

// Mutations
import { useMutation } from "@apollo/client";
import { DELETE_CHILD_CARE_PLAN_COMMENT } from "@graphql/operations";

// Styles
const CommentContainer = styled.div`
  margin-top: 40px;
`;

// Other
const { Title, Text } = Typography;
const { Option } = Select;
var dateFormat = require("dateformat");

///////////////
// COMPONENT //
///////////////
function CarePlanComments({
  comments,
  getUser,
  returnUrl,
  assignmentID,
  videoID,
  initialValues,
  handleFormSubmit,
}) {

  ///////////
  // State //
  ///////////

  // Input for staged comment
  const [newComment, setNewComment] = useState("");

  // (Optional) Video ID's related to Comment
  const [relatedIDs, setRelatedIDs] = useState([])

  useEffect(() => {
    console.log(relatedIDs)
  }, [relatedIDs])
  
  // Displayed Comments
  const [localComments, setLocalComments] = useState(comments || []);

  ///////////////
  // Mutations //
  ///////////////

  // Delete Comment Mutation Trigger
  const [deleteChildCarePlanComment] = useMutation(DELETE_CHILD_CARE_PLAN_COMMENT);

  //////////////
  // Handlers //
  //////////////

  // Handles the Deletion of a Comment
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

  // Adds a comment
  const addComment = async () => {
    if (!newComment.trim()) {
      message.warning("Comment cannot be empty!");
      return;
    }

    const addedComment = {
      id: Date.now(),
      content: newComment,
      createdAt: new Date(),
    };

    setLocalComments((prevComments) => [addedComment, ...prevComments]);
    setNewComment("");
    message.success("Comment added successfully!");
  };

  // -- Unsure
  const renderVideoOptions = () => {
    let options = [];
    for (var key in VIDEOS) {
      if (VIDEOS[key].id !== "great_job") {
        if (VIDEOS.hasOwnProperty(key)) {
          options.push({
            value: VIDEOS[key].title,
            text: `${VIDEOS[key].title}`,
          });
        }
      }
    }
    options = options.sort((a, b) => a.text.localeCompare(b.text)); // Sort alphabetically
    return options;
  };


  const renderAssignedVideos = (videoIDs) => {
    return videoIDs.map((videoID) => {
      let videoObject = VIDEOS[videoID];
      return (
        <div key={videoID} style={{ marginBottom: "20px" }}>
          <ContentCard style={{ position: "relative" }}>
            <Space direction="vertical">
              <Title style={{ margin: "0px" }} level={5}>
                {videoObject.title}
              </Title>
              <Text>{videoObject.description}</Text>
            </Space>
            <ReactPlayer
              url={videoObject.videoURL}
              controls={true}
              width="100%"
              style={{ width: "100%" }}
            />
          </ContentCard>
        </div>
      );
    });
  }; [VIDEOS]

  return (
    <div>
      <Form
        onFinish={handleFormSubmit}
        initialValues={initialValues}
        validateMessages={{
          required: "${label} is required!",
        }}
      >
        {/* Video Dropdown */}
        <Form.Item
          name="videoIDs"
          label="Related Videos (Optional)"
          rules={[{ required: false, message: "Please select videos!" }]}
        >
          <Select
            mode="multiple"
            placeholder="Select videos"
            style={{ width: "100%", marginTop: "10px" }}
            options={renderVideoOptions()}
            onChange={(e) => setRelatedIDs(e)}
          />
        </Form.Item>

        {/* New Comment Input */}
        <div style={{ marginBottom: "20px" }}>
          <Input.TextArea
            rows={2}
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Write your comment here..."
            style={{ marginBottom: "10px" }}
          />
          <Button type="primary" onClick={addComment}>
            Add Comment
          </Button>
        </div>

        <CommentContainer>
          {localComments.length === 0 ? (
            <Empty description="You have not created any comments yet" />
          ) : (
            localComments.map((commentObject) => (
              <div key={commentObject.id}>
                <Comment
                  author={"You"}
                  avatar="/logos/Main.png"
                  content={commentObject.content}
                  datetime={dateFormat(commentObject.createdAt, "m/dd hh:MM tt")}
                  actions={[
                    <Popconfirm
                      key="topLeft"
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
            ))
          )}
        </CommentContainer>
      </Form>

      {/* Render Assigned Videos */}
      <div style={{ marginTop: "30px" }}>
        <Title level={4}>Assigned Videos</Title>
        {initialValues.videoIDs ? renderAssignedVideos(initialValues.videoIDs) : <Empty description="No videos assigned" />}
      </div>
    </div>
  );
}

export default CarePlanComments;
