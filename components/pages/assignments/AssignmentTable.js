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
  function renderSeenStatusButton(record) {
    return(<View></View>)
  }

  // Column Details for Child Users
  const childColumns = (showPassed, userRole) => {
    return(
      [
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
      ]
    )
  } 

  // Column Details for all other Users
  const defaultColumns = (showPassed, userRole) => {
    return([
      // Child Name
      childNameColumn(),

      // Date Assigned
      dateAssignedColumn(),

      // Date Due
      dateDueColumn(),

      // Viewed Status
      determineViewedOrCompletedColumn(showPassed, userRole),

      // Assigned Videos
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
    ])
  }


  /////////////
  // Columns //
  /////////////
  

  // Child's Name
  const childNameColumn = () => {
    return ({
      title: "Child",
      dataIndex: "childName",
      key: "childName",
      render: (text, record, index) => (
        <Text>
          {record.child.firstName} {record.child.lastName}
        </Text>
      ),
    })
  }

  // Date Assigned
  const dateAssignedColumn = () => {
    return(
      {
        title: "Date Assigned",
        dataIndex: "users",
        key: "users",
        render: (text, record, index) => (
          <Text>
            {record.dateStart}
          </Text>
        )
      }
    )
  }

  // Date Due
  const dateDueColumn = () => {
    return(
      {
        title: "Date Due",
        dataIndex: "assignmentDateTime",
        key: "assignmentDateTime",
        render: (text, record, index) => (
          <Text>
            {record.dateDue}
          </Text>
        )
      }
    )
  }

  // Depending on Assignment Completion Date, either renders the 'Viewed' Column or "Completed" column
  function determineViewedOrCompletedColumn(showPassed, userRole){

    // If this is an Expired Assignment, shows whether completed or failed
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

    // If this is an Active Assignment, shows whether child has seen it or not
    else{
      return viewedStatusColumn(userRole)
    }
  }

  // Renders the Viewed Column
  const viewedStatusColumn = (userRole) => {
    if (userRole === "CHILD"){
      return {
        title: "Viewed Status",
        dataIndex: "type",
        key: "type",
        render: (text, record, index) => (
          renderSeenStatusButton()
        ),
      }
    }
    else {
      return {
        title: "Viewed Status",
        dataIndex: "type",
        key: "type",
        render: (text, record, index) => (
          <span>
          <Tag>{record.seen ? "Seen" : "Not Seen"}</Tag>
        </span>
        ),
      }
    }
  }

///////////////
// FUNCTIONS //
///////////////



// Based on the User role, determines the columns on the table
function determineColumns(userRole, showPassed){
  if (userRole === "THERAPIST" || userRole === "ADMIN" || userRole === "GUARDIAN"){
    return defaultColumns(showPassed, userRole).flat()
  }
  else if (userRole === "CHILD"){
    return childColumns(showPassed, userRole).flat()
  }
}

function AssignmentsTable({ assignments, passedAssignments, userID, userRole }) {

  ////////////
  // State  //
  ////////////

  const [showPassed, setshowPassed] = useState(false);

  const convertAssignmentSourceData = () => {
    if (!showPassed){
      return assignments
    }
    else if (showPassed){
      return passedAssignments
    }
    
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
