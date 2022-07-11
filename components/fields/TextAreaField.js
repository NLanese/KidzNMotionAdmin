import React from "react";
import {  Input } from "antd";
import { FormItem, FormLabel, ErrorText } from "@fields/styles";
const { TextArea } = Input;

const TextAreaField = ({ input, meta, ...props }) => (
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
    <TextArea
      {...input}
      placeholder={props.placeholder}
      size={props.size}
      allowClear={props.allowClear}
      prefix={props.prefix}
      suffix={props.suffix}
      id={props.htmlID}
      style={{ height: props.height }}
      inputMode={props.inputMode}
      showCount={props.showCount}
      aria-label={props.label}
      type="text"
      autoComplete={props.autoComplete}
    />
    {!props.hideErrorText && meta.error && meta.touched && !meta.active && (
      <ErrorText>{meta.error}</ErrorText>
    )}
  </FormItem>
);

export default TextAreaField;
