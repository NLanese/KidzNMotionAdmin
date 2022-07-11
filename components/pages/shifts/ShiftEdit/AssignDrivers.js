import React from "react";
import { AuditOutlined } from "@ant-design/icons";


import { Typography, Select } from "antd";
import ContentCard from "@common/content/ContentCard";
const { Text } = Typography;
const { Option } = Select;

function AssignDrivers({ drivers, driversOnShift, setDriversOnShift }) {
  const renderDriverOptions = () => {
    return drivers.map((driverObject) => {
      return (
        <Option key={driverObject.id} disabled={false}>
          {driverObject.firstname} {driverObject.lastname} -{" "}
          {driverObject.transporterId}
        </Option>
      );
    });
  };


  return (
    <ContentCard>
      <Text strong>
        <AuditOutlined /> {" "}
        Step 1: Assign Drivers On Shift
      </Text>
      <br />
      <br />
      <Select
        mode="multiple"
        style={{ width: "100%" }}
        placeholder="Please select drivers for the shift"
        size="large"
        value={driversOnShift}
        onChange={(value) => setDriversOnShift(value)}
        showSearch={true}
        filterOption={(inputValue, option) => {
          return option.children
            .toString()
            .toLowerCase()
            .includes(inputValue.toLowerCase());
        }}
      >
        {renderDriverOptions()}
      </Select>
    </ContentCard>
  );
}

export default AssignDrivers;
