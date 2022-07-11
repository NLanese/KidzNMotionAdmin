import React, { useState } from "react";

import { driverState } from "@atoms";
import { useRecoilValue } from "recoil";
import styled from "styled-components";
import { Table, Tag, Input } from "antd";
import BasicLink from "@common/BasicLink";
import { EditOutlined } from "@ant-design/icons";
import { SearchOutlined } from "@ant-design/icons";




const columns = [
  {
    title: "Driver ID",
    dataIndex: "id",
    key: "id",
    width: 45,
    render: (text, record, index) => (
      <BasicLink
        key={index}
        href={`/drivers/list?id=${record.id}`}
        shallow={true}
      >
        {record.id}
      </BasicLink>
    ),
    sorter: (a, b) => a.id.localeCompare(b.id),
  },
  {
    title: "First Name",
    dataIndex: "firstname",
    key: "firstname",
    width: 30,

  },
  {
    title: "Last Name",
    dataIndex: "lastname",
    key: "lastname",
    width: 30,
  },
  {
    title: "Email",
    dataIndex: "email",
    key: "email",
    width: 50,
    sorter: (a, b) => a.email.localeCompare(b.email),
  },
  {
    title: "Phone Number",
    dataIndex: "phonenumber",
    key: "phonenumber",
    width: 50,
  },
  {
    title: "Status",
    dataIndex: "deleted",
    key: "deleted",
    width: 20,
    render: (deleted) => (
      <span>
        {deleted ? (
          <Tag color="red">Inactive</Tag>
        ) : (
          <Tag color="green">Active</Tag>
        )}
      </span>
    ),
  },
  {
    title: "Has Scorecard Report",
    dataIndex: "hasScoreCard",
    key: "hasScoreCard",
    width: 20,
    render: (hasScoreCard) => (
      <span>
        {hasScoreCard ? (
          <Tag color="green">YES</Tag>
          ) : (
          <Tag color="red">NO</Tag>
        )}
      </span>
    ),
    sorter: (a, b) =>  a.hasScoreCard - b.hasScoreCard,
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
        href={`/drivers/list?id=${record.id}&edit=true`}
        shallow={true}
      >
        Edit <EditOutlined />
      </BasicLink>
    ),
  },
];

const DriverTableWrapper = styled.div`
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

function DriversTable() {
  const [search, setSearch] = useState(null);
  const drivers = useRecoilValue(driverState);

  const convertDriverData = () => {
    let driverTableSource = [];
    if (!drivers) {
      return driverTableSource;
    }
    drivers.map((driverObject) => {
      let driverFilter = false;
      if (search) {
        if (
          driverObject.transporterId &&
          driverObject.transporterId
            .toLowerCase()
            .includes(search.toLowerCase())
        ) {
          driverFilter = true;
        }
        if (
          driverObject.firstname &&
          driverObject.firstname.toLowerCase().includes(search.toLowerCase())
        ) {
          driverFilter = true;
        }
        if (
          driverObject.lastname &&
          driverObject.lastname.toLowerCase().includes(search.toLowerCase())
        ) {
          driverFilter = true;
        }
        if (
          driverObject.email &&
          driverObject.email.toLowerCase().includes(search.toLowerCase())
        ) {
          driverFilter = true;
        }
      } else {
        driverFilter = true;
      }

      if (driverFilter) {
        driverTableSource.push({
          id: driverObject.transporterId,
          firstname: driverObject.firstname,
          lastname: driverObject.lastname,
          email: driverObject.email,
          phonenumber: driverObject.phoneNumber,
          deleted: driverObject.deleted,
          hasScoreCard: driverObject.weeklyReport && driverObject.weeklyReport.length > 0,
        });
      }
      return driverObject;
    });
    return driverTableSource;
  };

  const filterDrivers = (searchInput) => {
    if (searchInput === "") {
      setSearch(null);
    } else {
      setSearch(searchInput);
    }
  };

  return (
    <DriverTableWrapper>
      <Input
        placeholder="Filter drivers"
        size="large"
        allowClear
        onChange={(event) => filterDrivers(event.target.value)}
        prefix={<SearchOutlined />}
        style={{
          width: 300,
        }}
      />
      <Table
        dataSource={convertDriverData()}
        bordered={false}
        size="middle"
        columns={columns}
        rowKey="id"
        scroll={{
          x: 600,
        }}
        pagination={{
          pageSize: search ? 1000 : 15,
          position: ["bottomRight"],
        }}
      />
    </DriverTableWrapper>
  );
}

export default DriversTable;
