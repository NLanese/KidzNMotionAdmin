import React, { useState } from "react";

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
  Button,
  Tooltip,
} from "antd";
const { Text, Title, Link } = Typography;
import ContentCard from "@common/content/ContentCard";
import BasicLink from "@common/BasicLink";
import { Collapse } from "antd";
const { Panel } = Collapse;
import ReactPlayer from "react-player";
import CarePlanComments from "@pages/patients/CarePlanComments";
import CreateCarePlanComment from "@forms/patients/CreateCarePlanComment";

var dateFormat = require("dateformat");

const AssignmentContainer = styled.div`
  margin-top: 40px;
`;

function CarePlanAssignments({
  assignments,
  returnUrl,
  getUser,
  comments,
  initialValues,
}) {
  const renderMedals = (medals) => {
    return medals.map((medalObject) => {
      return (
        <Tooltip
          title={`${medalObject.level} | Completed: ${dateFormat(
            medalObject.createdAt,
            "mmmm dd, yyyy"
          )}`}
        >
          <Avatar src={medalObject.description} />
        </Tooltip>
      );
    });
  };
  const renderVideoDetails = (assignmentObject) => {
    return assignmentObject.videos.map((videoObject) => {
      return (
        <Row gutter={[16, 3]} key={videoObject.id}>
          <Col xs={24} sm={16}>
            <Descriptions
              title={videoObject.file.title.toString()}
              size="small"
              bordered
              layout="vertical"
              column={{ lg: 2, md: 2, sm: 2, xs: 1 }}
            >
              <Descriptions.Item label="Video Description">
                {videoObject.file.description.toString()}
              </Descriptions.Item>
              <Descriptions.Item label="Completed">
                {videoObject.completed
                  ? "Video Completed"
                  : "Not Yet Completed"}
              </Descriptions.Item>
              <Descriptions.Item label="Medals">
                <Avatar.Group>{renderMedals(videoObject.medals)}</Avatar.Group>
              </Descriptions.Item>
            </Descriptions>
          </Col>
          <Col xs={24} sm={8}>
            <ReactPlayer
              url={videoObject.file.videoURL}
              controls={true}
              width="100%"
              height="200px"
            />
          </Col>
          <Divider />
        </Row>
      );
    });
  };

  const renderAssignments = () => {
    return assignments.map((assignmentObject) => {
      console.log(assignmentObject);
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
                {dateFormat(assignmentObject.dateEnd, "mmm dd, yyyy")}
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
              <Panel header="Assignment Comments" key="2">
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
                <CarePlanComments getUser={getUser} comments={comments} assignmentID={assignmentObject.id}/>
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
      <Row gutter={[16, 3]}>{renderAssignments()}</Row>
    </AssignmentContainer>
  );
}

export default CarePlanAssignments;
