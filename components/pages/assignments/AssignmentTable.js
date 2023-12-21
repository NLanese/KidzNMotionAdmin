// React
import React, { useState, useEffect } from "react";

// Ant Desgin
import styled from "styled-components";
import { Table, Tag, Typography } from "antd";
import BasicLink from "@common/BasicLink";
import { EditOutlined } from "@ant-design/icons";
import { Switch, Space } from "antd";

// Misc
var dateFormat = require("dateformat");
const { Text } = Typography;
import { changeTimeZone } from "@helpers/common";

////////////
// Styles //
////////////
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


////////////////
// RENDERINGS //
////////////////

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

///////////////
// FUNCTIONS //
///////////////

// Determines the color of the Approval Status
function determineApprovalStatusColor(record) {
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

// Determines Completion Status
function determineCompletionStatus(record){
  
}

// Depending on Assignment Completion Date, either renders the 'Viewed' Column or "Completed" column
function determineViewedOrCompletedColumn(showPassed){
  if (showPassed){
    return {
      title: "Completion Status",
      dataIndex: "type",
      key: "type",
      render: (text, record, index) => (
        <span>
          <Tag>{record.type.replace("_", " ").toString().toUpperCase()}</Tag>
        </span>
      ),
    }
  }
  else{
    return {
      title: "Viewed Status",
      dataIndex: "type",
      key: "type",
      render: (text, record, index) => (
        <span>
          <Tag>{record.type.replace("_", " ").toString().toUpperCase()}</Tag>
        </span>
      ),
    }
  }
}

// Based on the User role, determines the columns on the table
function determineColumns(userRole, showPassed){

  let columns

  if (userRole === "THERAPIST" || userRole === "ADMIN" || userRole === "GUARDIAN"){
    columns = [
        {
          title: "Child",
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
          title: "Date Assigned",
          dataIndex: "users",
          key: "users",
          render: (text, record, index) => (
            <>{getAssignmentParticpants(record.users)}</>
          ),
        },
        {
          title: "Date Due",
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
          title: "Viewed Status",
          dataIndex: "type",
          key: "type",
          render: (text, record, index) => (
            <span>
              <Tag>{record.type.replace("_", " ").toString().toUpperCase()}</Tag>
            </span>
          ),
        },
    
        {
          title: "Assigned Videos",
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
  }
  else if (userRole === "CHILD"){
    columns = [
      {
        title: "Date Assigned",
        dataIndex: "users",
        key: "users",
        render: (text, record, index) => (
          <>{getAssignmentParticpants(record.users)}</>
        ),
      },
      {
        title: "Date Due",
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
      {...determineViewedOrCompletedColumn(showPassed)},
      {
        title: "Assigned Videos",
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
  }
}

function AssignmentsTable({ assignments, userID, userRole }) {
  const [showPassed, setshowPassed] = useState(false);

  const convertAssignmentSourceData = () => {
    let assetTableSource = [];
    if (!assignments) {
      return assetTableSource;
    }
    assignments.map((assignmentObject) => {
      if (!showPassed && assignmentObject.canceled) return;

      assetTableSource.push(assignmentObject);
    });
    return assetTableSource;
  };

  const columns = determineColumns(userRole, showPassed)

  return (
    <AssignmentTableWrapper>
      <Space size="large">
        {/* <Space size="small">
          <Switch onChange={setShowPast} /> <Text>Show Past Assignments</Text>
        </Space> */}
        <Space size="small">
          <Switch onChange={setshowPassed} />{" "}
          <Text>Show Completed/Failed Assignments</Text>
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
