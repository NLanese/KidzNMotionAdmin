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

const AssignmentTableWrapper = styled.div`
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

// Grabs and Lists Particpants of Assignment
function getAssignmentParticpants(users) {
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
function renderApprovalStatusColor(record) {
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

function AssignmentsTable({ assignments, userID }) {
  const [showCancelled, setShowCancelled] = useState(false);
  const [showPast, setShowPast] = useState(false);

  const convertAssignmentSourceData = () => {
    let assetTableSource = [];
    if (!assignments) {
      return assetTableSource;
    }
    assignments.map((assignmentObject) => {
      if (!showCancelled && assignmentObject.canceled) return;

      assetTableSource.push(assignmentObject);
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
            record.assignmentOwnerID === userID
              ? `/assignments?id=${record.id}`
              : `/assignments?id=${record.id}&approve=true`
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
        <>{getAssignmentParticpants(record.users)}</>
      ),
    },
    {
      title: "Date/Time",
      dataIndex: "assignmentDateTime",
      key: "assignmentDateTime",
      render: (text, record, index) => (
        <span>
          <Text>
            {dateFormat(
              changeTimeZone(
                new Date(record.assignmentDateTime.toString().split(".000Z")[0]),
                "America/New_York"
              ),
              "m/dd/yy hh:MM tt"
            )}
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
      title: "Assignment Status",
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
    <AssignmentTableWrapper>
      <Space size="large">
        {/* <Space size="small">
          <Switch onChange={setShowPast} /> <Text>Show Past Assignments</Text>
        </Space> */}
        <Space size="small">
          <Switch onChange={setShowCancelled} />{" "}
          <Text>Show Cancelled Assignments</Text>
        </Space>
      </Space>

      <Table
        dataSource={convertAssignmentSourceData()}
        bordered={false}
        tableLayout="fixed"
        size="middle"
        columns={columns}
        rowKey="assignmentDateTime"
        pagination={{
          pageSize: 25,
          pageSizeOptions: [],
          position: ["bottomRight"],
        }}
      />
    </AssignmentTableWrapper>
  );
}

export default AssignmentsTable;
