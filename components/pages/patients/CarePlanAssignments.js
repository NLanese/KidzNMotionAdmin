// React and AntD
import React, { useState, useEffect } from "react";
import styled from "styled-components";
import {
  Card,
  Empty,
  Col,
  Row,
  Typography,
  Descriptions,
  Tag,
  Divider,
  Avatar,
  Drawer,
  Button,
  Tooltip,
} from "antd";
const { Text, Title, Link } = Typography;
import ContentCard from "@common/content/ContentCard";
import BasicLink from "@common/BasicLink";
import { Collapse } from "antd";
const { Panel } = Collapse;
import ReactPlayer from "react-player";

// Pages
import CarePlanComments from "@pages/patients/CarePlanComments";
import CreateCarePlanComment from "@forms/patients/CreateCarePlanComment";
import VideoCommentForm from "@forms/patients/VideoCommentForm";
import AssignMedalsForm from "./AssignMedals";
import VideoMedals from "../medals/videoMedals";

// Next
import { withRouter } from "next/router";
import Router from "next/router";

// Date
var dateFormat = require("dateformat");

// Style
const AssignmentContainer = styled.div`
  margin-top: 40px;
`;


///////////////
// Component // 
///////////////
function CarePlanAssignments({
  assignments,
  returnUrl,
  getUser,
  patient,
  comments,
  initialValues,
  router,
  medals,
}) {

  ////////////
  // States //
  ////////////


  ////////////////
  // Renderings //
  ////////////////

  // Renders Medals per Video in Assignment Block
  const renderMedals = (video) => {
   return <VideoMedals videoTitle={video.contentfulID} userMedals={medals} size={"sm"}/>
  };

  const renderAssignMedalsButton = (videoObject) => {
    return(
      <Col xs={24} sm={12}>
        <Button
          onClick={() =>
            Router.push(
              "/patients/manage?id=" +
                router.query.id +
                "&video=" +
                videoObject.id +
                "&video_id=" +
                videoObject.file.id,
              null,
              {
                shallow: true,
              }
            )
          }
          style={{ float: "right" }}
        >
          Assign Medal For Video
        </Button>
    </Col>
    )
  }


  const renderVideoDetails = (assignmentObject) => {
    return assignmentObject.videos.map((videoObject) => {
      return (

        <Row gutter={[16, 3]} key={videoObject.id}>

          {/* Video Title */}
          <Col xs={24} sm={12}>
            <h2> {videoObject.file.title.toString()}</h2>
          </Col>

          {/* Assign Medal Button */}
          {renderAssignMedalsButton(videoObject)}

          {/* Video Description and Medals */}
          <Col xs={24} sm={16}>
            <Descriptions
              size="small"
              bordered
              layout="vertical"
              column={{ lg: 2, md: 2, sm: 2, xs: 1 }}
            >

              {/* Description */}
              <Descriptions.Item label="Video Description">
                {videoObject.file.description.toString()}
              </Descriptions.Item>

              {/* Completion Status */}
              <Descriptions.Item label="Completed">
                {videoObject.completed
                  ? "Video Completed"
                  : "Not Yet Completed"}
              </Descriptions.Item>

              {/* Medals */}
              <Descriptions.Item label="Medals">
                <Avatar.Group>{renderMedals(videoObject)}</Avatar.Group>
              </Descriptions.Item>

            </Descriptions>
          </Col>

          {/* Video */}
          <Col xs={24} sm={8}>
            <ReactPlayer
              url={videoObject.file.videoURL}
              controls={true}
              width="100%"
              height="200px"
            />
          </Col>

          <Col xs={24} sm={24}>
            <Collapse defaultActiveKey={[]} bordered={true}>
              <Panel
                header={`${videoObject.file.title.toString()} Comments`}
                key="1"
              >
                <VideoCommentForm
                  getUser={getUser}
                  returnUrl={returnUrl}
                  initialValues={{
                    ...initialValues,
                    videoID: videoObject.id,
                  }}
                />
                <Divider />
                <CarePlanComments
                  getUser={getUser}
                  comments={comments}
                  assignmentID={assignmentObject.id}
                  videoID={videoObject.id}
                  showOnly={"squat"}
                />
              </Panel>
            </Collapse>
          </Col>
          <Divider />
        </Row>
      );
    });
  };

  const renderAssignments = () => {
    let sortedAssignments = JSON.parse(JSON.stringify(assignments));
    sortedAssignments = sortedAssignments.sort((a, b) =>
      a.dateStart > b.dateStart ? 1 : b.dateStart > a.dateStart ? -1 : 0
    );

    return sortedAssignments.map((assignmentObject) => {
      if (
        router.query.assignmentId &&
        assignmentObject.id !== router.query.assignmentId
      )
        return null;

      return (
        <Col xs={24} sm={24} key={assignmentObject.id}>
          <ContentCard key={assignmentObject.id}>
            <Descriptions
              title={"Assignment: " + assignmentObject.title}
              size="small"
              bordered
              layout="vertical"
              column={{ lg: 4, md: 3, sm: 2, xs: 1 }}
            >
              <Descriptions.Item label="Title">
                {assignmentObject.title}
              </Descriptions.Item>
              <Descriptions.Item label="Assignment Seen">
                <Tag>{!assignmentObject.seen ? "Not Seen" : "Seen"}</Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Date Start">
                {dateFormat(assignmentObject.dateStart, "mmm dd, yyyy")}
              </Descriptions.Item>
              <Descriptions.Item label="Date End">
                {dateFormat(assignmentObject.dateDue, "mmm dd, yyyy")}
              </Descriptions.Item>
              <Descriptions.Item label="Description">
                {assignmentObject.description}
              </Descriptions.Item>
              <Descriptions.Item label="Number of Videos">
                {assignmentObject.videos.length}
              </Descriptions.Item>
            </Descriptions>
            <Divider />

            <Collapse defaultActiveKey={[]} bordered={true}>
              <Panel header="Video Details" key="1">
                {renderVideoDetails(assignmentObject)}
              </Panel>
              <Panel header="Assignment Progress" key="2">
                <CreateCarePlanComment
                  getUser={getUser}
                  returnUrl={returnUrl}
                  assignment={true}
                  initialValues={{
                    ...initialValues,
                    assignmentID: assignmentObject.id,
                  }}
                />
                <Divider />
                <CarePlanComments
                  getUser={getUser}
                  comments={comments}
                  assignmentID={assignmentObject.id}
                />
              </Panel>
            </Collapse>
          </ContentCard>
        </Col>
      );
    });
  };

  if (assignments.length === 0) {
    return (
      <AssignmentContainer style={{ textAlign: "center" }}>
        <Empty description="You have not created any assignments yet" />
      </AssignmentContainer>
    );
  }

  return (
    <AssignmentContainer>
      {router.query.assignmentId && (
        <>
          <Button
            onClick={() =>
              Router.push("/patients/manage?id=" + router.query.id, null, {
                shallow: true,
              })
            }
          >
            Show All Assignments
          </Button>
          <br />
          <br />
        </>
      )}

      <Row gutter={[16, 3]}>{renderAssignments()}</Row>
      <Drawer
        title={"Assign Video Medals"}
        placement="right"
        width={550}
        onClose={() =>
          Router.push("/patients/manage?id=" + router.query.id, null, {
            shallow: true,
          })
        }
        open={router.query.video}
      >
        <AssignMedalsForm getUser={getUser} router={router} childID={patient.id}/>
      </Drawer>
    </AssignmentContainer>
  );
}

export default withRouter(CarePlanAssignments);
