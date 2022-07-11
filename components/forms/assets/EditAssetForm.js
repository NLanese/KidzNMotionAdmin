import React, { useState } from "react";
import { Form, Field } from "react-final-form";
import { PlainTextField } from "@fields";

import { Col, Row, Button, Spin, message } from "antd";

import { userState, assetState } from "@atoms";
import { useRecoilValue, useSetRecoilState } from "recoil";

import { DYNAMIC_UPDATE_ASSET } from "@graphql/operations";
import { useMutation } from "@apollo/client";

import { getAssets } from "@helpers/assets";

function EditAssetForm({ initialValues }) {
  const [loading, setLoading] = useState(false);

  const user = useRecoilValue(userState);
  const setAssets = useSetRecoilState(assetState);

  // Mutations
  const [updateAsset, {}] = useMutation(DYNAMIC_UPDATE_ASSET);

  const handleAssetSubmit = async (formValues) => {
    setLoading(true);
    await updateAsset({
      variables: {
        dspId: user.dsp.id,
        token: localStorage.getItem("token"),
        role: user.role,

        name: formValues.name,
        type: formValues.type,
        number: formValues.number,
        deviceIndex: initialValues.deviceIndex,
        id: parseInt(initialValues.id)
      },
    })
      .then(async (resolved) => {
        message.success("Asset Saved");
        const assetInformation = await getAssets(user.role);

        setAssets(assetInformation);
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
        onSubmit={handleAssetSubmit}
        initialValues={initialValues}
        mutators={{
          setValue: ([field, value], state, { changeValue }) => {
            changeValue(state, field, () => value);
          },
        }}
        validate={(values) => {
          const errors = {};

          if (!values.name) {
            errors.name = "Required";
          }
          if (!values.type) {
            errors.type = "Required";
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
            <legend>Asset Edit Form</legend>
            <Row gutter={16}>
              <Col xs={24} md={24}>
                <Field
                  label="Asset Name"
                  name="name"
                  htmlType="text"
                  component={PlainTextField}
                  required={true}
                  size={"large"}
                  hideErrorText={false}
                />
              </Col>
              <Col xs={24} md={24}>
                <Field
                  label="Asset Type"
                  name="type"
                  htmlType="text"
                  component={PlainTextField}
                  required={true}
                  size={"large"}
                  hideErrorText={false}
                />
              </Col>
              <Col xs={24} md={24}>
                <Field
                  label="Asset Number"
                  name="number"
                  htmlType="text"
                  component={PlainTextField}
                  required={false}
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
              Update Asset
            </Button>
          </form>
        )}
      />
    </Spin>
  );
}

export default EditAssetForm;
