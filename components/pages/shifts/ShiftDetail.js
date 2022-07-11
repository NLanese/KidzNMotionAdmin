import React, { useEffect, useState } from "react";
import { AuditOutlined, BarcodeOutlined } from "@ant-design/icons";

import { Typography, Space, Tag, Table } from "antd";
import BasicLink from "@common/BasicLink";
import styled from "styled-components";

const { Text } = Typography;

const ShiftDetailWrapper = styled.div`
  padding: 10px 0px;
  .ant-pagination {
    display: none;
  }
`;

function ShiftDetail({ shiftObject }) {
  const [formattedShiftData, setFormattedShiftData] = useState(null);

  useEffect(() => {
    setFormattedShiftData(null);
    let formattedData = structuredClone(shiftObject);

    setFormattedShiftData(formattedData);
  }, [shiftObject]);

  const renderDriversOnShift = () => {
    return formattedShiftData.allDriverShifts.map((driverShiftObject) => {
      return (
        <BasicLink
          key={driverShiftObject.driver.transporterId}
          href={`/drivers/list?id=${driverShiftObject.driver.transporterId}`}
        >
          <Tag color="blue">
            {driverShiftObject.driver.firstname}{" "}
            {driverShiftObject.driver.lastname}
          </Tag>
        </BasicLink>
      );
    });
  };

  if (!formattedShiftData) {
    return <div />;
  }

  const renderTableColumns = () => {
    let columns = [
      {
        title: "Name",
        dataIndex: "name",
        key: "name",
      },
      {
        title: "Transport ID",
        dataIndex: "transporterId",
        key: "transporterId",
      },
      {
        title: "Assigned Assets",
        children: [],
      },
    ];

    // Get unique asset types
    let assetTypesInUse = [];
    formattedShiftData.allDriverShifts.map((driverShiftObject) => {
      driverShiftObject.devices.map((deviceObject) => {
        if (!assetTypesInUse.includes(deviceObject.type)) {
          assetTypesInUse.push(deviceObject.type);
        }
      });
    });

    // Set the asset type columns
    assetTypesInUse.map((assetType) => {
      columns[2].children.push({
        title: assetType,
        dataIndex: assetType,
        key: assetType,
        width: 140,
      });
      return assetType;
    });

    return columns;
  };

  const renderTableData = () => {
    let dataSource = [];
    formattedShiftData.allDriverShifts.map((driverShiftObject) => {
      let dataRow = {};
      dataRow.name =
        driverShiftObject.driver.firstname +
        " " +
        driverShiftObject.driver.lastname;
      dataRow.transporterId = driverShiftObject.driver.transporterId;

      driverShiftObject.devices.map((deviceObject) => {
        dataRow[deviceObject.type] = deviceObject.name;
      });

      dataSource.push(dataRow);
    });
    return dataSource;
  };

  return (
    <ShiftDetailWrapper>
      <Space direction="vertical">
        <Text strong>
          <AuditOutlined /> Assigned Drivers On Shift
        </Text>
        <Space size={[5, 10]} wrap direction="horizontal">
          {renderDriversOnShift()}
        </Space>
        <br />
        <Text strong>
          <BarcodeOutlined /> Assigned Assets On Shift
        </Text>
        <Table
          dataSource={renderTableData()}
          bordered={true}
          tableLayout="fixed"
          size="middle"
          columns={renderTableColumns()}
          rowKey="transporterId"
        />
      </Space>
    </ShiftDetailWrapper>
  );
}

export default ShiftDetail;
