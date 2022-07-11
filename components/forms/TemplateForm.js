import React, { useEffect } from "react";
import { Form, Field } from "react-final-form";
import {
  PlainTextField,
  SelectField,
  RadioField,
  TextAreaField,
  DateField,
  CheckBoxField,
} from "@fields";
import { Col, Row, Button, Divider } from "antd";
import { STATES, normalizeZipcode } from "@helpers/forms";

// Util function to call a function later, and return a Promise
function promiseSetTimeout(fun, time) {
  return new Promise((resolve) =>
    setTimeout(() => [fun, resolve].forEach((x) => x.call()), time)
  );
}

function countDown(time) {
  function tick() {
    const min = Math.floor(time / 60);
    let sec = time - min * 60;

    if (sec < 10) {
      sec = "0" + sec;
    }

    const message = min.toString() + ":" + sec;

    time--;
  }
  const interval = setInterval(tick, 1000);
  return promiseSetTimeout(() => clearInterval(interval), time * 1000);
}

function TemplateForm() {
  const handleLogin = async (formValues) => {
    await countDown(2).then(() => {
      
    });
  };

  return (
    <Form
      onSubmit={handleLogin}
      initialValues={{ tags: [] }}
      validate={(values) => {
        const errors = {};
        if (!values.lastName) {
          errors.lastName = "Required";
        }
        if (!values.firstName) {
          errors.firstName = "Required";
        }
        if (!values.address) {
          errors.address = "Required";
        }
        if (!values.city) {
          errors.city = "Required";
        }
        if (!values.state) {
          errors.state = "Required";
        }
        if (!values.zipCode) {
          errors.zipCode = "Required";
        }
        if (!values.startDate) {
          errors.startDate = "Required";
        }
        return errors;
      }}
      render={({
        handleSubmit,
        pristine,
        invalid,
        submitting,
        form,
        values,
      }) => (
        <form onSubmit={handleSubmit}>
          <legend>Template Form</legend>
          <Divider orientation="left" orientationMargin={0}>
            Address Information
          </Divider>
          <Row gutter={16}>
            <Col xs={24} md={12}>
              <Field
                label="First name"
                placeholder="James"
                name="firstName"
                htmlType="text"
                maxLength={5}
                component={PlainTextField}
                required={true}
                size={"large"}
                hideErrorText={true}
              />
            </Col>
            <Col xs={24} md={12}>
              <Field
                name="lastName"
                component={PlainTextField}
                htmlType="text"
                label="Last name"
                placeholder="Bond"
                size={"large"}
                required={true}
                hideErrorText={true}
              />
            </Col>
            <Col xs={24} md={24}>
              <Field
                name="company"
                component={PlainTextField}
                htmlType="text"
                label="Company"
                size={"large"}
                required={false}
                hideErrorText={true}
              />
            </Col>
            <Col xs={24} md={24}>
              <Field
                name="address"
                component={PlainTextField}
                htmlType="text"
                label="Address"
                size={"large"}
                required={true}
                hideErrorText={true}
              />
            </Col>
            <Col xs={24} md={24}>
              <Field
                name="aptNumber"
                component={PlainTextField}
                htmlType="text"
                label="Apartment, suite, etc."
                size={"large"}
                required={false}
                hideErrorText={true}
              />
            </Col>
            <Col xs={24} md={24}>
              <Field
                name="city"
                component={PlainTextField}
                htmlType="text"
                label="City"
                size={"large"}
                required={true}
                hideErrorText={true}
              />
            </Col>
            <Col xs={24} md={12}>
              <Field
                name="state"
                component={SelectField}
                label="State"
                size={"large"}
                showSearch={true}
                required={true}
                options={STATES}
                hideErrorText={true}
              />
            </Col>
            <Col xs={24} md={12}>
              <Field
                name="zipCode"
                component={PlainTextField}
                htmlType="text"
                label="Zip Code"
                size={"large"}
                parse={normalizeZipcode}
                required={true}
                hideErrorText={true}
              />
            </Col>
            <Col xs={24} md={24}>
              <Field
                name="notes"
                component={TextAreaField}
                label="Notes"
                size={"large"}
                required={false}
                hideErrorText={true}
              />
            </Col>
          </Row>
          <Divider orientation="left" orientationMargin={0}>
            Shipping Information
          </Divider>
          <Row gutter={16}>
            <Col xs={24} md={24}>
              <Field
                name="tags"
                component={SelectField}
                label="Tags (Write Your Own)"
                mode="tags"
                size={"large"}
                required={false}
                showSearch={false}
                options={[{ value: "Priority", text: "Priority" }]}
                allowClear={true}
                hideErrorText={true}
              />
            </Col>
            <Col xs={24} md={12}>
              <Field
                name="startDate"
                component={DateField}
                label="Start Date"
                allowClear={true}
                size={"large"}
                required={true}
                showTime={true}
                placeholder={"Start Date"}
                hideErrorText={true}
              />
            </Col>
            <Col xs={24} md={12}>
              <Field
                name="endDate"
                component={DateField}
                label="End Date"
                size={"large"}
                required={true}
                showTime={true}
                placeholder={"End Date"}
                hideErrorText={true}
              />
            </Col>
            <Col xs={24} md={24}>
              <Field
                name="range"
                component={DateField}
                label="Date Range"
                allowClear={true}
                size={"large"}
                required={true}
                showTime={false}
                range={true}
                hideErrorText={true}
              />
            </Col>
            <Col xs={24} md={24}>
              <Field
                name="checkBox"
                component={CheckBoxField}
                label="Driver Attributes"
                required={true}
                type="checkbox"
                checkBoxLabel={"Newby"}
                hideErrorText={true}
              />
            </Col>
            <Col xs={24} md={24}>
              <Field
                name="Radio"
                component={RadioField}
                label="Driver Diet Preferences"
                required={true}
                type="radio"
                hideErrorText={true}
              />
            </Col>
          </Row>
          <br />
          <Button
            type="primary"
            loading={submitting}
            htmlType="submit"
            block={true}
            size={"large"}
            disabled={invalid || pristine}
          >
            Create Shipment
          </Button>
        </form>
      )}
    />
  );
}

export default TemplateForm;
