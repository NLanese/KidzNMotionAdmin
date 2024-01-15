import React from "react";
import { Drawer, Descriptions, Divider, Typography, Tabs, Image } from "antd";
import styled from "styled-components";
var dateFormat = require("dateformat");
import VIDEOS from "@constants/videos";

function PatientInformation({ patientDetail, user }) {
  const renderBlockedVideos = () => {
    let videoString = "";
    if (patientDetail.carePlan.blockedVideos) {
      if (patientDetail.carePlan.blockedVideos.ids) {
        patientDetail.carePlan.blockedVideos.ids.map((videoID, index) => {
          if (VIDEOS[videoID]) {
            videoString += `${VIDEOS[videoID].title} - Level: ${VIDEOS[videoID].level}, `;
          }
        });
      }
    }

    return videoString;
  };
  return (
    <>
      <Descriptions
        title="Basic Information"
        bordered
        size="small"
        layout="vertical"
        column={{ lg: 2, md: 2, sm: 1, xs: 1 }}
      >
        <Descriptions.Item label="Name">
          {patientDetail.firstName} {patientDetail.lastName}
        </Descriptions.Item>
        <Descriptions.Item label="Assigned Level">
          {patientDetail.carePlan.level}
        </Descriptions.Item>
        <Descriptions.Item label="Date of Birth">
          {dateFormat(patientDetail.childDateOfBirth, "mmm dd, yyyy")}
        </Descriptions.Item>
        {/* <Descriptions.Item label="Diagnosis">
          {patientDetail.carePlan.child.diagnosis}
        </Descriptions.Item> */}

        <Descriptions.Item label="Therapist">
          {patientDetail.carePlan.therapist.firstName}{" "}
          {patientDetail.carePlan.therapist.firstName}{" "}
          {patientDetail.carePlan.therapist.id === user.id && "(ME)"}
        </Descriptions.Item>
        <Descriptions.Item label="Guardian Name">
          {patientDetail.carePlan.child.guardian.firstName}{" "}
          {patientDetail.carePlan.child.guardian.lastName}
        </Descriptions.Item>
        <Descriptions.Item label="Guardian email">
          {patientDetail.carePlan.child.guardian.email}
        </Descriptions.Item>
        <Descriptions.Item label="Guardian Phone Number">
          {patientDetail.carePlan.child.guardian.phoneNumber}
        </Descriptions.Item>
        <Descriptions.Item label="Blocked Vidoes">
          {renderBlockedVideos()}
        </Descriptions.Item>
      </Descriptions>
      <Divider />
    </>
  );
}

export default PatientInformation;
