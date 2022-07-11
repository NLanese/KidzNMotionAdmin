import React from "react";
import { Select } from "antd";
import { FormItem, FormLabel, ErrorText } from "@fields/styles";
const { Option } = Select;

const SelectField = ({ input, meta, ...props }) => (
  <FormItem
    validateStatus={
      meta.error && meta.touched && props.required
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
    <Select
      {...input}
      placeholder={props.placeholder}
      size={props.size}
      mode={props.mode}
      dropdownStyle={props.dropdownStyle}
      id={props.htmlID}
      aria-label={props.label}
      showSearch={props.showSearch}
      allowClear={props.allowClear}
      filterOption={(inputValue, option) => {
        return option.children.toLowerCase().includes(inputValue.toLowerCase());
      }}
    >
      {props.options.map((option) => (
        <Option key={option.value}>{option.text}</Option>
      ))}
    </Select>
    {!props.hideErrorText && meta.error && meta.touched && !meta.active && (
      <ErrorText>{meta.error}</ErrorText>
    )}
  </FormItem>
);

export default SelectField;
