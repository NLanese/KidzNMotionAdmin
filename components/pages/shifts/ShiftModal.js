import React, { useState, useEffect } from "react";
import { Modal, Select, Typography, Divider, Table } from "antd";
import styled from "styled-components";

const { Title } = Typography;
const { Option } = Select;

const ShiftModalWrapper = styled.div`
  & h5 {
  }
`;

function ShiftModal({ selectedDate, drivers, assets }) {
  const [modalOpen, setModalOpen] = useState(false);
  const [firstModalOpen, setFirstModalOpen] = useState(true);
  const [assignedDrivers, setAssignedDrivers] = useState([]);
  const [assignedAssets, setAssignedAssets] = useState({});

  useEffect(() => {
    if (selectedDate && !firstModalOpen) {
      setModalOpen(true);
    } else {
      setFirstModalOpen(false);
    }
  }, [selectedDate]);

  const closeModal = () => {
    setAssignedDrivers([]);
    setModalOpen(false);
  };

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

  const assignAssetToDriver = (assetType, value) => {
    let assignedAssetsClone = structuredClone(assignedAssets);
    if (assignedAssetsClone[assetType]) {
      assignedAssetsClone[assetType].push(value);
    } else {
      assignedAssetsClone[assetType] = [value];
    }
    setAssignedAssets(assignedAssetsClone);

  };

  const renderAssetColumns = () => {
    let columns = [
      {
        title: "Driver",
        dataIndex: "transporterId",
        key: "transporterId",
        width: 55,
        fixed: "left",
      },
    ];

    // Get asset columns
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
      columns.push({
        title: assetType,
        dataIndex: assetType,
        key: assetType,
        width: 55,
        render: (text, record, index) => (
          <span>
            <Select
              style={{ width: "100%" }}
              placeholder="Please select drivers for the shift"
              size="small"
              showSearch={true}
              allowClear
              bordered={false}
              onChange={(value) => assignAssetToDriver(assetType, value)}
            >
              {assetOptions[assetType].map((option) => (
                <Option
                  key={option.value}
                  disabled={
                    assignedAssets[assetType]
                      ? assignedAssets[assetType].includes(option.value)
                      : false
                  }
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

  return (
    <Modal
      title={`Drivers Queued To Work On: ${selectedDate.format(
        "dddd - MM/DD/YYYY"
      )}`}
      footer={null}
      onOk={null}
      visible={modalOpen}
      closable={true}
      onCancel={() => closeModal()}
      width={1000}
      maskClosable={false}
      wrapClassName="shiftManagementModal"
    >
      <ShiftModalWrapper>
        <Title level={5}>Step 1: Assign Drivers</Title>
        <Select
          mode="multiple"
          style={{ width: "100%" }}
          placeholder="Please select drivers for the shift"
          size="large"
          value={assignedDrivers}
          onChange={(value) => setAssignedDrivers(value)}
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
        <Divider />
        {assignedDrivers.length > 0 && (
          <>
            <Title level={5}>Step 2: Assign Assets</Title>
            <Table
              dataSource={[{}, {}, {}, {}, {}]}
              bordered={false}
              tableLayout="fixed"
              size="middle"
              columns={renderAssetColumns()}
              rowKey="transporterId"
            />
            <Divider />
            <Title level={5}>Step 3: Set Shift Message</Title>
          </>
        )}
      </ShiftModalWrapper>
    </Modal>
  );
}

export default ShiftModal;
