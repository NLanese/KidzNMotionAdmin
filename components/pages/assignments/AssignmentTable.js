// React
import React, { useState, useEffect } from "react";

// Ant Desgin
import styled from "styled-components";
import { Table, Tag, Typography, Row } from "antd";
import BasicLink from "@common/BasicLink";
import { Switch, Space, Button, message } from "antd";

// Misc
var dateFormat = require("dateformat");
const { Text } = Typography;
import { changeTimeZone } from "@helpers/common";

// Mutations and Queries
import { useMutation } from "@apollo/client";
import { TOGGLE_ASSGINMENT_SEEN, GET_USER_ASSIGNMENTS } from "@graphql/operations";
import client from "@utils/apolloClient";


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

function AssignmentsTable({ assignments, setAssignments, passedAssignments, userID, userRole }) {

  ///////////
  // State //
  ///////////

  const [showPassed, setshowPassed] = useState(false);

///////////////
// Mutations //
///////////////

  const [confirmAssignment, {}] = useMutation(TOGGLE_ASSGINMENT_SEEN)

  const handleConfirmAssignment = async (record) => {
    return await confirmAssignment({
      variables: {
        assignmentID: record.id,
        hasSeen: true
      }
    })
    .then( async (resolved) => {
      message.success("Assignment Seen!");
      await client
      .query({
        query: GET_USER_ASSIGNMENTS,
        fetchPolicy: "network-only",
      })
      .then(async (resolved) => {
        setAssignments(resolved.data.getAssignments);
      })
      .catch((error) => {
        message.error("Sorry, there was an error getting this information");
      });
    })
  }

////////////////
// RENDERINGS //
////////////////

  // Renders APPROVED | NOT APPROVED | PENDING APPROVAL
  function renderSeenStatusButton(record) {
    if (record.seen){
      return(
        <h3>Assignment Seen</h3>
      )
    }
    else{
      return(
        <Button
          onClick={() => handleConfirmAssignment(record)}
          type="primary"
          block
        >
        Confirm
        </Button>
      )
    }
  }

  // Renders List of Videos per Assignment
  function renderVideoList(record){
      return record.videos.map(vid => {
        return(
          <Row key={vid.title}>
            <Text>{vid.title} - {vid.completed ? "Complete!" : "Not Done"}</Text>
          </Row>
        )
      })
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
      videoListColumn()
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
          {record.childCarePlan.child.firstName} {record.childCarePlan.child.lastName}
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
          <Text>
            TO DO
          </Text>
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
    if (userRole === "CHILD" || userRole === "GUARDIAN"){
      return {
        title: "Viewed Status",
        dataIndex: "type",
        key: "type",
        render: (text, record, index) => (
          renderSeenStatusButton(record)
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

  const videoListColumn = () => {
    return(
      {
        title: "Assigned Videos",
        dataIndex: "approvalStatus",
        key: "approvalStatus",

        defaultSortOrder: "descend",
        render: (text, record, index) => (
          renderVideoList(record)
        ),
      }
    )
  }

  const columns = determineColumns(userRole, showPassed)

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

  const convertAssignmentSourceData = () => {
    if (!showPassed){
      return assignments
    }
    else if (showPassed){
      return passedAssignments
    }
    
  };


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
