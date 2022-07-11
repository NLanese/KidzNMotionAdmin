import React from "react";
import { Field } from "react-final-form";
import { TextAreaField, SwitchField } from "@fields";
import { Col, Row } from "antd";

const NotificationSettingsFormChunk = ({type}) => {
  return (
    <Row gutter={16}>
      <Col xs={24} md={24}>
        <Field
          name={`feedbackNotifications.${type}.message`}
          component={TextAreaField}
          label="Message"
          size={"large"}
          required={true}
          height={"130px"}
        />
      </Col>
      <Col xs={24} md={24}>
        <Field
          name={`feedbackNotifications.${type}.autoSend`}
          component={SwitchField}
          label="Auto Send?"
          required={true}
          type="checkbox"
          checkedChildren={"Enabled"}
          unCheckedChildren={"Disabled"}
          size={"large"}
        />
      </Col>
    </Row>
  );
};

export default NotificationSettingsFormChunk;
