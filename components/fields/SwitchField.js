import React from "react";
import {  Switch } from "antd";
import { FormItem, FormLabel, ErrorText } from "@fields/styles";

const SwitchField = ({ input, meta, ...props }) => (
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
    <Switch
      {...input}
      checked={input.checked}
      type="checkbox"
      checkedChildren={props.checkedChildren}
      unCheckedChildren={props.unCheckedChildren}
      size={props.size}
    >
        {props.checkBoxLabel}
    </Switch>
    {!props.hideErrorText && meta.error && meta.touched && !meta.active && (
      <ErrorText>{meta.error}</ErrorText>
    )}
  </FormItem>
);

export default SwitchField;
