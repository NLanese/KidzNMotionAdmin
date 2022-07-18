import React, { useState } from "react";


import styled from "styled-components";
import { Table, Tag, Typography } from "antd";
import BasicLink from "@common/BasicLink";
import { EditOutlined } from "@ant-design/icons";

const { Text } = Typography;

const UserTableWrapper = styled.div`
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

function OrganizationUserTable({organizationUsers}) {
  

  const convertUserData = () => {
    let assetTableSource = [];
    if (!organizationUsers) {
      return assetTableSource;
    }

    return organizationUsers
 
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
          href={`/users/manage?id=${record.id}`}
          shallow={true}
        >
          {record.user.firstName} {record.user.lastName}
        </BasicLink>
      ),
      sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
      title: "Role",
      dataIndex: "role",
      key: "role",
      width: 30,
      render: (text, record, index) => (
        <span>
          <Tag>{record.user.role}</Tag>
        </span>
      ),
      sorter: (a, b) => a.type.localeCompare(b.type),
    },
    {
      title: "Email",
      dataIndex: "user.email",
      key: "user.email",
      width: 30,
      render: (text, record, index) => (
        <Text>{record.user.email}</Text>
      )
    },

    // {
    //   title: "Action",
    //   dataIndex: "action",
    //   key: "action",
    //   fixed: "right",
    //   width: 30,
    //   render: (text, record, index) => (
    //     <BasicLink
    //       key={record.id}
    //       href={`/users/manage?id=${record.id}&edit=true`}
    //       shallow={true}
    //     >
    //       Edit <EditOutlined />
    //     </BasicLink>
    //   ),
    // },
  ];

  return (
    <UserTableWrapper>
  
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
    </UserTableWrapper>
  );
}

export default OrganizationUserTable;
