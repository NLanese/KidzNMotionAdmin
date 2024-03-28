import React, { useState } from "react";

import styled from "styled-components";
import { Table, Tag, Typography, Dropdown, Collapse } from "antd";
import BasicLink from "@common/BasicLink";
import { EditOutlined } from "@ant-design/icons";
var dateFormat = require("dateformat");
import Router from "next/router";
import orderAssignmentsByStartDate from "../../../functions/orderAssignmentsByStartDate";
const { Panel } = Collapse;

const { Text } = Typography;

const PatientTableWrapper = styled.div`
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

function PatientTable({ patientData, user }) {
  const convertUserData = () => {
    return patientData;
  };

  const renderUserAssignments = (record) => {
    let assignments = [];
    if (record.carePlan) {
      let sortedAssignments = JSON.parse(
        JSON.stringify(record.carePlan.assignments)
      );
      sortedAssignments = sortedAssignments.sort((a, b) =>
        a.dateStart > b.dateStart ? 1 : b.dateStart > a.dateStart ? -1 : 0
      );

      sortedAssignments = orderAssignmentsByStartDate(sortedAssignments)
      
      sortedAssignments.map((assignmentObject) => {
        assignments.push({
          title: assignmentObject.title,
          id: assignmentObject.id,
          dateStart: dateFormat(assignmentObject.dateStart, "ddd (mm/dd)"),
          dateDue: dateFormat(assignmentObject.dateDue, "ddd (mm/dd)"),
        });
      });
    }
    return assignments.map((assignmentObject) => {
      return (
        <BasicLink
          key={assignmentObject.id}
          href={`/patients/manage?id=${record.id}&assignmentId=${assignmentObject.id}`}
          shallow={true}
        >
          <Tag>
            {assignmentObject.title} | {assignmentObject.dateStart} -{" "}
            {assignmentObject.dateDue}
          </Tag>
        </BasicLink>
      );
    });
    return "";
  };

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      width: 45,
      render: (text, record, index) => (
        <BasicLink
          key={index}
          href={`/patients/manage?id=${record.id}`}
          shallow={true}
        >
          {record.firstName} {record.lastName} <EditOutlined />
        </BasicLink>
      ),
    },
    {
      title: "Assignments",
      dataIndex: "Assignments",
      key: "Assignments",
      width: 45,
      render: (text, record, index) => (
        <Collapse accordion>
          <Panel header="View Assignments" key="1">
            {renderUserAssignments(record)}
          </Panel>
        </Collapse>
      ),
    },
    {
      title: "Guardian",
      dataIndex: "guardianName",
      key: "guardianName",
      width: 45,
      render: (text, record, index) => (
        <Text>
          {record.carePlan.child.guardian.firstName}{" "}
          {record.carePlan.child.guardian.lastName}
        </Text>
      ),
    },
    {
      title: "Therapist",
      dataIndex: "therapist",
      key: "therapist",
      width: 45,
      render: (text, record, index) => (
        <Text>
          {record.carePlan.therapist.firstName}{" "}
          {record.carePlan.therapist.lastName}{" "}
          {record.carePlan.therapist.id === user.id && "(ME)"}
        </Text>
      ),
    },
    {
      title: "Level",
      dataIndex: "level",
      key: "level",
      width: 45,
      render: (text, record, index) => <Tag>{record.carePlan.level}</Tag>,
    },
  ];

  return (
    <PatientTableWrapper>
      <Table
        dataSource={convertUserData()}
        bordered={false}
        tableLayout="fixed"
        size="middle"
        columns={columns}
        rowKey="id"
        pagination={{
          pageSize: 25,
          pageSizeOptions: [],
          position: ["bottomRight"],
        }}
      />
    </PatientTableWrapper>
  );
}

export default PatientTable;
