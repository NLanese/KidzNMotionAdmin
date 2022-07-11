import React from "react";
import {  Checkbox } from "antd";
import { FormItem, FormLabel, ErrorText } from "@fields/styles";

const CheckBoxField = ({ input, meta, ...props }) => (
  <FormItem
    validateStatus={
      (meta.error && meta.touched && props.required)
        ? "error"
        : meta.dirty && meta.touched && !meta.active && "success"
    }
    hasFeedback
  >
    {props.label && (
      <FormLabel>
        {props.label}
        {props.required && <span>*</span>}
      </FormLabel>
    )}
    <Checkbox
      {...input}
      checked={input.checked}
      type="checkbox"
    >
        {props.checkBoxLabel}
    </Checkbox>
    {!props.hideErrorText && meta.error && meta.touched && !meta.active && (
      <ErrorText>{meta.error}</ErrorText>
    )}
  </FormItem>
);

export default CheckBoxField;
