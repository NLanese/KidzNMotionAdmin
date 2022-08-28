import React from "react";

import styled from "styled-components";
import { Table, Tag, Typography } from "antd";
import BasicLink from "@common/BasicLink";
import { EditOutlined } from "@ant-design/icons";
var dateFormat = require("dateformat");

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
  let usersString = ""
  users.map((userObject, index) => {
      

      usersString += `${userObject.firstName} ${userObject.lastName} (${userObject.role})`

      if (index+1 !== users.length) {
          usersString += ", "
      }
  }) 
  return usersString;
}

function MeetingsTable({ meetings }) {
  const convertMeetingSourceData = () => {
    let assetTableSource = [];
    if (!meetings) {
      return assetTableSource;
    }

    return meetings;
  };

  const columns = [
    {
      title: "Participants",
      dataIndex: "users",
      key: "users",
      render: (text, record, index) => (
        <BasicLink href={`/meetings?id=${record.id}`}>
          {getMeetingParticpants(record.users)}
        </BasicLink>
      ),
    },
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
 
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
      title: "Pending Approval",
      dataIndex: "pendingApproval",
      key: "pendingApproval",
      sorter: (a, b) => a.type.localeCompare(b.type),
      defaultSortOrder: "descend",
      render: (text, record, index) => (
        <span>
          <Tag color={record.pendingApproval ? "green" : "red"}>
            {record.pendingApproval.toString().toUpperCase()}
          </Tag>
        </span>
      ),
    },
    {
      title: "Approved",
      dataIndex: "approved",
      key: "approved",
      sorter: (a, b) => a.type.localeCompare(b.type),
      defaultSortOrder: "descend",
      render: (text, record, index) => (
        <span>
          <Tag color={record.completed ? "green" : "red"}>
            {record.completed.toString().toUpperCase()}
          </Tag>
        </span>
      ),
    },
  ];

  return (
    <MeetingTableWrapper>
      <Table
        dataSource={convertMeetingSourceData()}
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
    </MeetingTableWrapper>
  );
}

export default MeetingsTable;
