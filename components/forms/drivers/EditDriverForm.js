import React, { useState } from "react";
import { Form, Field } from "react-final-form";
import { PlainTextField } from "@fields";
import Router from "next/router";

import { Col, Row, Button, Spin, message } from "antd";
import { normalizePhone, emailIsValid } from "@helpers/forms";

import { userState, driverState } from "@atoms";
import { useRecoilValue, useSetRecoilState } from "recoil";

import { DYNAMIC_UPDATE_DRIVER } from "@graphql/operations";
import { useMutation } from "@apollo/client";

import { getUserDrivers } from "@helpers/drivers";

function EditDriverForm({ initialValues, driverDetail }) {
  const [loading, setLoading] = useState(false);

  const user = useRecoilValue(userState);
  const setDrivers = useSetRecoilState(driverState);

  // Mutations
  const [updateDriver, {}] = useMutation(DYNAMIC_UPDATE_DRIVER);

  const handleDriverSubmit = async (formValues) => {
    setLoading(true);
    await updateDriver({
      variables: {
        dspId: user.dsp.id,
        token: localStorage.getItem("token"),
        role: user.role,
        driverId: driverDetail.id,
        firstname: formValues.firstName,
        lastname: formValues.lastName,
        email: formValues.email,
        transporterId: driverDetail.transporterId,
        phoneNumber: formValues.phoneNumber,
      },
    })
      .then(async (resolved) => {
        message.success("Driver Saved");
        const driverInformation = await getUserDrivers(user.role);
        Router.push("/drivers/list?id=" + driverDetail.transporterId)
        setDrivers(driverInformation);
        setLoading(false);
      })
      .catch((error) => {
        message.error("Sorry, there was an error on our end");
        setLoading(false);
      });
  };

  return (
    <Spin spinning={loading}>
      <Form
        onSubmit={handleDriverSubmit}
        initialValues={initialValues}
        mutators={{
          setValue: ([field, value], state, { changeValue }) => {
            changeValue(state, field, () => value);
          },
        }}
        validate={(values) => {
          const errors = {};

          if (!values.firstName) {
            errors.firstName = "Required";
          }
          if (!values.lastName) {
            errors.lastName = "Required";
          }
          if (!values.phoneNumber) {
            errors.phoneNumber = "Required";
          }
          if (!values.email) {
            errors.email = "Required";
          } else {
            if (!emailIsValid(values.email)) {
              errors.email = "Email is not valid";
            }
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
          <form
            onSubmit={(event) => {
              handleSubmit(event).then((event) => {});
            }}
          >
            <legend>Driver Edit Form</legend>
            <Row gutter={16}>
              <Col xs={24} md={12}>
                <Field
                  label="First Name"
                  name="firstName"
                  htmlType="text"
                  component={PlainTextField}
                  required={true}
                  size={"large"}
                  hideErrorText={false}
                />
              </Col>
              <Col xs={24} md={12}>
                <Field
                  label="Last Name"
                  name="lastName"
                  htmlType="text"
                  component={PlainTextField}
                  required={true}
                  size={"large"}
                  hideErrorText={false}
                />
              </Col>
              <Col xs={24} md={24}>
                <Field
                  label="Your Email"
                  name="email"
                  htmlType="email"
                  component={PlainTextField}
                  required={true}
                  size={"large"}
                  hideErrorText={false}
                />
              </Col>
              <Col xs={24} md={24}>
                <Field
                  label="Phone Number"
                  name="phoneNumber"
                  htmlType="text"
                  component={PlainTextField}
                  required={true}
                  parse={normalizePhone}
                  size={"large"}
                  hideErrorText={false}
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
              Update Driver
            </Button>
          </form>
        )}
      />
    </Spin>
  );
}

export default EditDriverForm;
