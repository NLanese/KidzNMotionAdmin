import React from "react";
import { Radio } from "antd";
import { FormItem, FormLabel, ErrorText } from "@fields/styles";

const RadioField = ({ input, meta, ...props }) => (
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
    <Radio.Group
      {...input}
      buttonStyle="solid"
      onChange={input.onChange}
      value={input.value}
    >
      <Radio.Button value="a">Hangzhou</Radio.Button>
      <Radio.Button value="b">Shanghai</Radio.Button>
      <Radio.Button value="c">Beijing</Radio.Button>
      <Radio.Button value="d">Chengdu</Radio.Button>
    </Radio.Group>
    {!props.hideErrorText && meta.error && meta.touched && !meta.active && (
      <ErrorText>{meta.error}</ErrorText>
    )}
  </FormItem>
);

export default RadioField;
