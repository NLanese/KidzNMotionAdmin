import React from "react";
import {  Input } from "antd";
import { FormItem, FormLabel, ErrorText } from "@fields/styles";

const TextField = ({ input, meta, ...props }) => (
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
    <Input
      {...input}
      placeholder={props.placeholder}
      size={props.size}
      prefix={props.prefix}
      suffix={props.suffix}
      id={props.htmlID}
      inputMode={props.inputMode}
      maxLength={props.maxLength}
      aria-label={props.label}
      showCount={props.showCount}
      addonAfter={props.addonAfter}
      addonBefore={props.addonBefore}
      allowClear={props.allowClear}
      type={props.htmlType}
      autoComplete={props.autoComplete}
    />
    {!props.hideErrorText && meta.error && meta.touched && !meta.active && (
      <ErrorText>{meta.error}</ErrorText>
    )}
  </FormItem>
);

export default TextField;
