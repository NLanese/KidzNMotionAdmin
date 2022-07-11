import React  from "react";
import { DatePicker, Row, Col, Space, Button, Divider } from "antd";
import styled from "styled-components";
import { LeftOutlined, RightOutlined } from "@ant-design/icons";
import moment from "moment";

const ShiftDateSelectionWrapper = styled.div``;

function ShiftDateSelection({ selectedDate, setSelectedDate }) {
  const setDateShift = (direction) => {
    if (direction === "minus") {
      setSelectedDate(selectedDate.clone().subtract(1, "days"));
    } else {
      setSelectedDate(selectedDate.clone().add(1, "days"));
    }
  };

  return (
    <ShiftDateSelectionWrapper>
      <br />
      <Row gutter={16} justify="space-between" align="middle">
        <Col xs={12}>
          <DatePicker
            placeholder={"Shift Date"}
            style={{ width: "190px" }}
            size={"large"}
            inputReadOnly={true}
            value={moment(selectedDate)}
            picker={"date"}
            allowClear={false}
            use12Hours={true}
            onChange={setSelectedDate}
            mode={"date"}
            showTime={false}
            format={"MM/DD/YYYY"}
          />
        </Col>
        <Col xs={12}>
          <Space direction="horizontal" style={{ float: "right" }}>
            <Button
              type="ghost"
              onClick={() => setDateShift("minus")}
              size="middle"
              icon={<LeftOutlined />}
            />
            <Button
              type="ghost"
              onClick={() => setDateShift("add")}
              size="middle"
              icon={<RightOutlined />}
            />
          </Space>
        </Col>
      </Row>
    </ShiftDateSelectionWrapper>
  );
}

export default ShiftDateSelection;
