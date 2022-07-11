import React, { useState } from "react";

import styled from "styled-components";
import { Table, Tag } from "antd";
import BasicLink from "@common/BasicLink";
var dateFormat = require("dateformat");

import { LinkOutlined } from "@ant-design/icons";


const AccidentTableWrapper = styled.div`
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

function AccidentTable({ accidents }) {
  const [search, setSearch] = useState(null);

  const renderDataSource = () => {
    let dataSource = [];
    accidents.map((accidentObject) => {
      let dataRow = {};
      dataRow.date = dateFormat(
        accidentObject.createdAt,
        "mm/dd/yyyy hh:MM tt"
      );
      dataRow.id = accidentObject.id;
      dataRow.createdAt = accidentObject.createdAt;
      dataRow.driver =
        accidentObject.driver.firstname + " " + accidentObject.driver.lastname;
      dataRow.driverID = accidentObject.driver.transporterId;
      dataRow.location = accidentObject.location;
      dataRow.hasPoliceReport = accidentObject.police_report;
      dataRow.driverInjury = accidentObject.selfInjuryAccidents.length > 0;
      dataRow.propertyDamage = accidentObject.propertyAccidents.length > 0;
      dataRow.vehicleCollision = accidentObject.collisionAccidents.length > 0;
      dataRow.pedestrianInjury = accidentObject.injuryAccidents.length > 0;
      dataRow.driverVehicleDamage = accidentObject.selfDamage.damaged;
      dataSource.push(dataRow);
      return accidentObject;
    });
    return dataSource;
  };

  const renderDriverFilters = () => {
    let driverFilters = [];
    let duplicateCheck = [];
    accidents.map((accidentObject) => {
      let driverName =
        accidentObject.driver.firstname + " " + accidentObject.driver.lastname;
      if (!duplicateCheck.includes(driverName)) {
        duplicateCheck.push(driverName);
        driverFilters.push({
          text: driverName,
          value: driverName,
        });
      }
      return accidentObject;
    });
    return driverFilters;
  };

  const columns = [
    {
      title: "Action",
      dataIndex: "date",
      key: "date",
      render: (text, record, index) => (
        <BasicLink
          key={index}
          href={`/drivers/accidents?id=${record.id}`}
          shallow={true}
        >
          View Details
        </BasicLink>
      ),
    },
    {
      title: "Date Occurred",
      dataIndex: "date",
      key: "date",
      defaultSortOrder: "descend",
      sorter: (a, b) => new Date(a.createdAt) > new Date(b.createdAt),
    },
    {
      title: "Driver Involved",
      dataIndex: "driver",
      key: "driver",
      render: (text, record, index) => (
        <BasicLink
          key={index}
          href={`/drivers/list?id=${record.driverID}`}
          shallow={true}
        >
          <LinkOutlined /> {record.driver}
        </BasicLink>
      ),
      sorter: (a, b) => a.driver.localeCompare(b.driver),
      filters: renderDriverFilters(),
      filterMode: "menu",
      filterSearch: true,
      onFilter: (value, record) => record.driver === value,
    },
    {
      title: "Location",
      dataIndex: "location",
      key: "location",

      sorter: (a, b) => a.location.localeCompare(b.location),
    },

    {
      title: "Accident Details",
      children: [
        {
          title: "Has Police Report",
          dataIndex: "hasPoliceReport",
          key: "hasPoliceReport",
          render: (text, record, index) => (
            <span>
              {record.hasPoliceReport ? (
                <Tag color="green">YES</Tag>
              ) : (
                <Tag color="red">NO</Tag>
              )}
            </span>
          ),
          filters: [
            {
              text: "Yes",
              value: true,
            },
            {
              text: "No",
              value: false,
            },
          ],
          defaultFilteredValue: [],
          onFilter: (value, record) => record.hasPoliceReport === value,
        },

        {
          title: "Pedestiran Injury",
          dataIndex: "pedestrianInjury",
          key: "pedestrianInjury",
          render: (text, record, index) => (
            <span>
              {record.pedestrianInjury ? (
                <Tag color="green">YES</Tag>
              ) : (
                <Tag color="red">NO</Tag>
              )}
            </span>
          ),
          filters: [
            {
              text: "Yes",
              value: true,
            },
            {
              text: "No",
              value: false,
            },
          ],
          defaultFilteredValue: [],
          onFilter: (value, record) => record.pedestrianInjury === value,
        },
        {
          title: "Driver Injury ",
          dataIndex: "driverInjury",
          key: "driverInjury",
          render: (text, record, index) => (
            <span>
              {record.driverInjury ? (
                <Tag color="green">YES</Tag>
              ) : (
                <Tag color="red">NO</Tag>
              )}
            </span>
          ),
          filters: [
            {
              text: "Yes",
              value: true,
            },
            {
              text: "No",
              value: false,
            },
          ],
          defaultFilteredValue: [],
          onFilter: (value, record) => record.driverInjury === value,
        },
        {
          title: "Property Damage ",
          dataIndex: "propertyDamage",
          key: "propertyDamage",
          render: (text, record, index) => (
            <span>
              {record.propertyDamage ? (
                <Tag color="green">YES</Tag>
              ) : (
                <Tag color="red">NO</Tag>
              )}
            </span>
          ),
          filters: [
            {
              text: "Yes",
              value: true,
            },
            {
              text: "No",
              value: false,
            },
          ],
          defaultFilteredValue: [],
          onFilter: (value, record) => record.propertyDamage === value,
        },
        {
          title: "Vehicle Collision ",
          dataIndex: "vehicleCollision",
          key: "vehicleCollision",
          render: (text, record, index) => (
            <span>
              {record.vehicleCollision ? (
                <Tag color="green">YES</Tag>
              ) : (
                <Tag color="red">NO</Tag>
              )}
            </span>
          ),
          filters: [
            {
              text: "Yes",
              value: true,
            },
            {
              text: "No",
              value: false,
            },
          ],
          defaultFilteredValue: [],
          onFilter: (value, record) => record.vehicleCollision === value,
        },
        {
          title: "Driver Vehicle Damange ",
          dataIndex: "driverVehicleDamage",
          key: "driverVehicleDamage",
          render: (text, record, index) => (
            <span>
              {record.driverVehicleDamage ? (
                <Tag color="green">YES</Tag>
              ) : (
                <Tag color="red">NO</Tag>
              )}
            </span>
          ),
          filters: [
            {
              text: "Yes",
              value: true,
            },
            {
              text: "No",
              value: false,
            },
          ],
          defaultFilteredValue: [],
          onFilter: (value, record) => record.driverVehicleDamage === value,
        },
      ],
    },
  ];

  return (
    <AccidentTableWrapper>
      <Table
        dataSource={renderDataSource()}
        bordered={false}
        size="middle"
        columns={columns}
        rowKey="date"
        scroll={{
          x: 600,
        }}
        pagination={{
          pageSize: search ? 1000 : 15,
          position: ["bottomRight"],
        }}
      />
    </AccidentTableWrapper>
  );
}

export default AccidentTable;
