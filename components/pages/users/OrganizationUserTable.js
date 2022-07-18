import React, { useState } from "react";


import styled from "styled-components";
import { Table, Tag, Input } from "antd";
import BasicLink from "@common/BasicLink";
import { EditOutlined } from "@ant-design/icons";
import { SearchOutlined } from "@ant-design/icons";

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
  const [search, setSearch] = useState(null);


  const convertUserData = () => {
    let assetTableSource = [];
    if (!organizationUsers) {
      return assetTableSource;
    }
    organizationUsers.map((assetObject) => {
      let assetFilter = false;
      if (search) {
        if (
          assetObject.name &&
          assetObject.name.toLowerCase().includes(search.toLowerCase())
        ) {
          assetFilter = true;
        }

        if (
          assetObject.type &&
          assetObject.type.toLowerCase().includes(search.toLowerCase())
        ) {
          assetFilter = true;
        }

        if (
          assetObject.name &&
          assetObject.name.toLowerCase().includes(search.toLowerCase())
        ) {
          assetFilter = true;
        }
      } else {
        assetFilter = true;
      }

      if (assetFilter) {
        assetTableSource.push({
          id: assetObject.id,
          name: assetObject.name,
          type: assetObject.type,
          number: assetObject.number,
        });
      }
      return assetObject;
    });
    return assetTableSource;
  };

  const filterUsers = (searchInput) => {
    if (searchInput === "") {
      setSearch(null);
    } else {
      setSearch(searchInput);
    }
  };

  const getTypeFilters = () => {
    const assetsTypes = [...new Set(assets.map(item => item.type))];
    let assetFilters = []
    assetsTypes.map(assetType => assetFilters.push({text: assetType, value: assetType}))
    return assetFilters;
  };

  const columns = [
    {
      title: "Asset Name",
      dataIndex: "name",
      key: "name",
      width: 45,
      render: (text, record, index) => (
        <BasicLink
          key={index}
          href={`/assets/list?id=${record.id}&edit=true`}
          shallow={true}
        >
          {record.name}
        </BasicLink>
      ),
      sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
      title: "Asset Type",
      dataIndex: "type",
      key: "type",
      width: 30,
      render: (text, record, index) => (
        <span>
          <Tag>{record.type}</Tag>
        </span>
      ),
      onFilter: (value, record) => record.type.indexOf(value) === 0,
      sorter: (a, b) => a.type.localeCompare(b.type),
      filters: getTypeFilters(),
    },
    {
      title: "Asset Number / VIN",
      dataIndex: "number",
      key: "number",
      width: 30,
      sorter: (a, b) => (a.number && b.number) ? a.number.localeCompare(b.number) : false,
    },

    {
      title: "Action",
      dataIndex: "action",
      key: "action",
      fixed: "right",
      width: 30,
      render: (text, record, index) => (
        <BasicLink
          key={record.id}
          href={`/assets/list?id=${record.id}&edit=true`}
          shallow={true}
        >
          Edit <EditOutlined />
        </BasicLink>
      ),
    },
  ];

  return (
    <UserTableWrapper>
      <Input
        placeholder="Filter users"
        size="large"
        allowClear
        onChange={(event) => filterUsers(event.target.value)}
        prefix={<SearchOutlined />}
        style={{
          width: 300,
        }}
      />
      <Table
        dataSource={convertUserData()}
        bordered={false}
        tableLayout="fixed"
        size="middle"
        columns={columns}
        rowKey="id"
        pagination={{
          pageSize: search ? 1000 : 25,
          pageSizeOptions: [],
          position: ["bottomRight"],
        }}
      />
    </UserTableWrapper>
  );
}

export default OrganizationUserTable;
