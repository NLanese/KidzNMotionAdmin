import React from "react";

import { BarcodeOutlined, ApartmentOutlined } from "@ant-design/icons";
import { Typography, Select, Table, Row, Col, Button, Popconfirm } from "antd";

import ContentCard from "@common/content/ContentCard";

const { Text } = Typography;
const { Option } = Select;

import styled from "styled-components";

function AssignDriverAssets({
  assets,
  drivers,
  driversOnShift,
  driverAssets,
  assignAssetToDriver,
  setDriverAssets,
}) {
  const renderDataRows = () => {
    let dataSource = [];

    driversOnShift.map((driverID) => {
      let driverObject = drivers.filter(
        (driverObject) => driverObject.id === driverID
      )[0];

      if (driverObject) {
        dataSource.push({
          name: driverObject.firstname + " " + driverObject.lastname,
          transporterId: driverObject.transporterId,
        });
      }
    });
    return dataSource;
  };

  const renderTableColumns = () => {
    let columns = [
      {
        title: "Name",
        dataIndex: "name",
        key: "name",
        width: 105,
      },
      {
        title: "Transport ID",
        dataIndex: "transporterId",
        key: "transporterId",
        width: 105,
      },
      {
        title: "Assigned Assets",
        children: [],
      },
    ];

    let assetTypes = [];
    let assetOptions = {};
    assets.map((assetObject) => {
      if (!assetOptions[assetObject.type]) {
        assetOptions[assetObject.type] = [
          { text: assetObject.name, value: assetObject.id },
        ];
      } else {
        assetOptions[assetObject.type].push({
          text: assetObject.name,
          value: assetObject.id,
        });
      }

      if (!assetTypes.includes(assetObject.type)) {
        assetTypes.push(assetObject.type);
      }
      return assetObject;
    });

    assetTypes.map((assetType) => {
      columns[2].children.push({
        title: assetType,
        dataIndex: assetType,
        key: assetType,
        width: 175,
        render: (text, record, index) => (
          <span>
            <Select
              style={{ width: "100%" }}
              placeholder={`Select ${assetType}`}
              size="large"
              showSearch={true}
              allowClear
              bordered={false}
              value={
                driverAssets.assigned[record.transporterId]
                  ? driverAssets.assigned[record.transporterId][assetType]
                  : null
              }
              onChange={(value) =>
                assignAssetToDriver(record.transporterId, assetType, value)
              }
              filterOption={(inputValue, option) => {
                return option.children
                  .toLowerCase()
                  .includes(inputValue.toLowerCase());
              }}
            >
              {assetOptions[assetType].map((option) => (
                <Option
                  key={option.value}
                  disabled={driverAssets.allAssets.includes(option.value)}
                >
                  {option.text}
                </Option>
              ))}
            </Select>
          </span>
        ),
      });
    });

    return columns;
  };

  const autoAssignAssets = () => {

    let newDriverAssets = {
      allAssets: [],
      assigned: {},
    };
    let assetTypes = [];
    let assetOptions = {};
    assets.map((assetObject) => {
      if (!assetOptions[assetObject.type]) {
        assetOptions[assetObject.type] = [
          { text: assetObject.name, value: assetObject.id },
        ];
      } else {
        assetOptions[assetObject.type].push({
          text: assetObject.name,
          value: assetObject.id,
        });
      }

      if (!assetTypes.includes(assetObject.type)) {
        assetTypes.push(assetObject.type);
      }
      return assetObject;
    });

    let count = 0;
    driversOnShift.map((driverID) => {
      let driverObject = drivers.filter(
        (driverObject) => driverObject.id === driverID
      )[0];

      if (driverObject) {
        newDriverAssets.assigned[driverObject.transporterId] = {};
        assetTypes.map((assetType) => {
          if (assetOptions[assetType][count]) {
            newDriverAssets.assigned[driverObject.transporterId][assetType] =
              assetOptions[assetType][count].value;
            newDriverAssets.allAssets.push(
              assetOptions[assetType][count].value
            );
          }
        });

        count++;
      }
    });
    setDriverAssets(newDriverAssets)
  };

  return (
    <ContentCard>
      <Row justify="space-between" align="middle" gutter={0}>
        <Col xs={12}>
          <Text strong>
            <BarcodeOutlined /> Step 2: Assign Driver Assets
          </Text>
        </Col>
        <Col xs={12}>
          <Popconfirm
            title="This will override all of your currently assigned assets"
            onConfirm={() => autoAssignAssets()}
            okText="Yes, Auto Assign"
            cancelText="No, Cancel"
            placement="rightBottom"
          >
            <Button type="ghost" style={{ float: "right" }}>
              <ApartmentOutlined /> Auto Assign Assets
            </Button>
          </Popconfirm>
        </Col>
      </Row>
      <br />
      <Table
        dataSource={renderDataRows()}
        bordered={false}
        scroll={{
          x: "400px",
        }}
        tableLayout="fixed"
        size="small"
        columns={renderTableColumns()}
        rowKey="transporterId"
      />
    </ContentCard>
  );
}

export default AssignDriverAssets;
