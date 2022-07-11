import React from "react";
import { Field } from "react-final-form";
import { PlainTextField, SelectField } from "@fields";
import { Col, Row } from "antd";
import { parseUpperCase } from "@helpers/forms";


const CompanyDetailsFormChunk = () => {
  return (
    <Row gutter={16}>
      <Col xs={24} md={8}>
        <Field
          name="companyDetails.name"
          component={PlainTextField}
          htmlType="text"
          label="Name"
          parse={parseUpperCase}
          size={"large"}
          placeholder="Rocky Montain Delivery"
          required={true}
        />
      </Col>
      <Col xs={24} md={8}>
        <Field
          name="companyDetails.shortcode"
          component={PlainTextField}
          htmlType="text"
          label="Short Code"
          parse={parseUpperCase}
          placeholder="RMD"
          size={"large"}
          required={true}
        />
      </Col>
      <Col xs={24} md={8}>
        <Field
          name="companyDetails.timeZone"
          component={SelectField}
          htmlType="text"
          label="Time Zone"
          options={[
            {
              value: "EST",
              text: "Eastern Standard Time",
            },
            {
              value: "CT",
              text: "Central Time",
            },
            {
              value: "MT",
              text: "Mountain Time",
            },
            {
              value: "PST",
              text: "Pacific Standard Time",
            },
          ]}
          size={"large"}
          required={true}
        />
      </Col>
    </Row>
  );
};

export default CompanyDetailsFormChunk;
