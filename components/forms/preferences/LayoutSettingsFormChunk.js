import React from "react";
import { Field } from "react-final-form";
import { PlainNumberField } from "@fields";
import { Col, Row } from "antd";

const LayoutSettingsFormChunk = () => {
  return (
    <Row gutter={16}>
      <Col xs={24} md={12}>
        <Field
          name="layoutSettings.topCardLimits"
          component={PlainNumberField}
          label="Top Performers Shown"
          size={"large"}
          min={0}
          required={true}
          wideAddon={true}
        />
      </Col>
      <Col xs={24} md={12}>
        <Field
          name="layoutSettings.smallCardLimits"
          component={PlainNumberField}
          htmlType="text"
          label="Small Cards Shown"
          min={0}
          wideAddon={true}
          size={"large"}
          required={true}
        />
      </Col>
    </Row>
  );
};

export default LayoutSettingsFormChunk;
