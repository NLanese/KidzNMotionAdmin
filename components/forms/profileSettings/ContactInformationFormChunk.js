import React from "react";
import { Field } from "react-final-form";
import { PlainTextField } from "@fields";
import { Col, Row } from "antd";
import { normalizePhone } from "@helpers/forms";

const ContactInformationFormChunk = () => {
  return (
    <Row gutter={16}>
      <Col xs={24} md={12}>
        <Field
          name="firstName"
          component={PlainTextField}
          htmlType="text"
          label="First Name"
          size={"large"}
          placeholder=""
          required={true}
        />
      </Col>
      <Col xs={24} md={12}>
        <Field
          name="lastName"
          component={PlainTextField}
          htmlType="text"
          label="Last Name"
          size={"large"}
          placeholder=""
          required={true}
        />
      </Col>
      <Col xs={24} md={12}>
        <Field
          name="email"
          component={PlainTextField}
          htmlType="email"
          label="Email"
          placeholder=""
          size={"large"}
          required={true}
        />
      </Col>
      <Col xs={24} md={12}>
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
      <Col xs={24} md={12}>
        <Field
          name="title"
          component={PlainTextField}
          htmlType="text"
          label="Title"
          placeholder=""
          size={"large"}
          required={false}
        />
      </Col>
    </Row>
  );
};

export default ContactInformationFormChunk;
