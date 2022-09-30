import React, { useState, useEffect } from "react";

import styled from "styled-components";
import { Table, Tag, Typography } from "antd";
import BasicLink from "@common/BasicLink";
import { EditOutlined } from "@ant-design/icons";
var dateFormat = require("dateformat");
import { Switch, Space } from "antd";
const { Text } = Typography;

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

function renderApprovalStatus(record) {
  if (record.canceled) {
    return "CANCELLED";
  }

  if (record.approved) {
    return "Approved".toUpperCase();
  } else {
    if (record.pendingApproval) {
      return "Pending Approval".toUpperCase();
    }
  }
}

function renderApprovalStatusColor(record) {
  if (record.canceled) {
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

function MeetingsTable({ meetings, userID }) {
  const [showCancelled, setShowCancelled] = useState(false);
  const [showPast, setShowPast] = useState(false);

  const convertMeetingSourceData = () => {
    let assetTableSource = [];
    if (!meetings) {
      return assetTableSource;
    }
    meetings.map((meetingObject) => {
      if (!showCancelled && meetingObject.canceled) return;

      assetTableSource.push(meetingObject);
    });
    return assetTableSource;
  };

  const columns = [
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
    {
      title: "Participants",
      dataIndex: "users",
      key: "users",
      render: (text, record, index) => (
        <>{getMeetingParticpants(record.users)}</>
      ),
    },
    {
      title: "Date/Time",
      dataIndex: "meetingDateTime",
      key: "meetingDateTime",
      render: (text, record, index) => (
        <span>
          <Text>
            {dateFormat(new Date(record.meetingDateTime), "m/dd/yy hh:MM tt")}
          </Text>
        </span>
      ),
    },
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

    {
      title: "Meeting Status",
      dataIndex: "approvalStatus",
      key: "approvalStatus",

      defaultSortOrder: "descend",
      render: (text, record, index) => (
        <span>
          <Tag color={renderApprovalStatusColor(record)}>
            {renderApprovalStatus(record)}
          </Tag>
        </span>
      ),
    },
  ];

  return (
    <MeetingTableWrapper>
      <Space size="large">
        {/* <Space size="small">
          <Switch onChange={setShowPast} /> <Text>Show Past Meetings</Text>
        </Space> */}
        <Space size="small">
          <Switch onChange={setShowCancelled} />{" "}
          <Text>Show Cancelled Meetings</Text>
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
