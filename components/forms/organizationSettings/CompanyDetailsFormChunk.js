import React from "react";
import { Field } from "react-final-form";
import { PlainTextField } from "@fields";
import { Col, Row } from "antd";
import { normalizePhone } from "@helpers/forms";

const CompanyDetailsFormChunk = () => {
  return (
    <Row gutter={16}>
      <Col xs={24} md={8}>
        <Field
          name="name"
          component={PlainTextField}
          htmlType="text"
          label="Name"
          size={"large"}
          placeholder=""
          required={true}
        />
      </Col>
      <Col xs={24} md={8}>
        <Field
          name="phoneNumber"
          component={PlainTextField}
          htmlType="text"
          label="Phone Number"
          parse={normalizePhone}
          placeholder=""
          size={"large"}
          required={true}
        />
      </Col>
    </Row>
  );
};

export default CompanyDetailsFormChunk;
