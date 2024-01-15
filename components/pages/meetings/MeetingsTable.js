import React, { useState, useEffect } from "react";

import styled from "styled-components";
import { Table, Tag, Typography } from "antd";
import BasicLink from "@common/BasicLink";
import { EditOutlined } from "@ant-design/icons";
var dateFormat = require("dateformat");
import { Switch, Space } from "antd";
const { Text } = Typography;
import { changeTimeZone } from "@helpers/common";
import moment from "moment";


////////////
// STYLES //
////////////
const MeetingTableWrapper = styled.div`
  position: relative;
  min-width: 500px;
  padding-top: 10px;
  th {
    background: white !important;
    font-weight: 600 !important;
  }
  .ant-input-affix-wrapper {
    margin-bottom: 10px;
  }
  .ant-table-pagination.ant-pagination {
    margin-bottom: 23px;
  }
`;

///////////////
// FUNCTIONS //
///////////////

// Grabs and Lists Particpants of Meeting
function getMeetingParticpants(users) {
  let users2 = [];
  users.map((userObject, index) => {
    users2.push(`${userObject.firstName} ${userObject.lastName}`);
  });

  return users2.map((usersString) => {
    return (
      <>
        <Tag id={usersString}>{usersString}</Tag> <br />
      </>
    );
  });
}

// Renders APPROVED | NOT APPROVED | PENDING APPROVAL
function renderApprovalStatus(record) {
  if (record.canceled) {
    return "CANCELLED";
  }

  if (!record.approved && !record.pendingApproval) {
    return "NOT APPROVED";
  }

  if (record.approved) {
    return "Approved"
  } else {
    if (record.pendingApproval) {
      return "Pending Approval"
    }
  }
}

// Determines the color of the Approval Status
function determineApprovalColor(record) {
  if (record.canceled) {
    return "red";
  }
  if (!record.approved && !record.pendingApproval) {
    return "red";
  }

  if (record.approved) {
    return "green";
  } else {
    if (record.pendingApproval) {
      return "yellow";
    }
  }
}

///////////////
// COMPONENT //
///////////////

function MeetingsTable({ meetings, pastMeetings, userID }) {

  ///////////
  // STATE //
  ///////////
  const [showPast, setShowPast] = useState(false);


  // Disperses Selected Meetings to be Rendered in a Table
  const convertMeetingSourceData = () => {
    let assetTableSource = [];
    if (!meetings) {
      return assetTableSource;
    }

    // If showing Past Meetings
    if (showPast){
      pastMeetings.map((meetingObject) => {  
        assetTableSource.push(meetingObject);
      });
      return assetTableSource;
    }

    // If Showing Current Meetings
    else{
      meetings.map((meetingObject) => {
        if (meetingObject.canceled) return;
        assetTableSource.push(meetingObject);
      });
      return assetTableSource;
    };
    }


  // Columns to be rendered in 
  const columns = [

    // TITLE COLUMN
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
      render: (text, record, index) => (
        <BasicLink
          href={
            record.meetingOwnerID === userID
              ? `/meetings?id=${record.id}`
              : `/meetings?id=${record.id}&approve=true`
          }
        >
          {record.title} (Open)
        </BasicLink>
      ),
    },

    // PARTICIPANTS COLUMN
    {
      title: "Participants",
      dataIndex: "users",
      key: "users",
      render: (text, record, index) => (
        <>{getMeetingParticpants(record.users)}</>
      ),
    },

    // DATE / TIME COLUMN
    {
      title: "Date/Time",
      dataIndex: "meetingDateTime",
      key: "meetingDateTime",
      render: (text, record, index) => (
        <span>
          <Text>
            {dateFormat(
              changeTimeZone(
                new Date(record.meetingDateTime.toString().split(".000Z")[0]),
                "America/New_York"
              ),
              "m/dd/yy hh:MM tt"
            )}
          </Text>
        </span>
      ),
    },

    // TYPE OF MEETING
    {
      title: "Type",
      dataIndex: "type",
      key: "type",
      render: (text, record, index) => (
        <span>
          <Tag>{record.type.replace("_", " ").toString().toUpperCase()}</Tag>
        </span>
      ),
    },

    // MEETING STATUS
    {
      title: "Meeting Status",
      dataIndex: "approvalStatus",
      key: "approvalStatus",

      defaultSortOrder: "descend",
      render: (text, record, index) => (
        <span>
          <Tag color={determineApprovalColor(record)}>
            {renderApprovalStatus(record)}
          </Tag>
        </span>
      ),
    },
  ];

  return (
    <MeetingTableWrapper>
      <Space size="large">
        <Space size="small">
        </Space>
        <Space size="small">
          <Switch onChange={setShowPast} />{" "}
          <Text>Show Cancelled / Past Meetings</Text>
        </Space>
      </Space>

      <Table
        dataSource={convertMeetingSourceData()}
        bordered={false}
        tableLayout="fixed"
        size="middle"
        columns={columns}
        rowKey="meetingDateTime"
        pagination={{
          pageSize: 25,
          pageSizeOptions: [],
          position: ["bottomRight"],
        }}
      />
    </MeetingTableWrapper>
  );
}

export default MeetingsTable;
