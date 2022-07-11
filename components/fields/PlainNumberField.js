import React from "react";
import { InputNumber } from "antd";
import { FormItem, FormLabel, ErrorText } from "@fields/styles";
import styled from "styled-components";

const NumberFieldWrapper = styled.div`
  .ant-input-number-group-addon {
    width: ${(props) => props.wideAddon && "50%"};
  }
  .ant-input-number-affix-wrapper {
    padding-left:${(props) => props.wideAddon && "0px !important"};
  }
  input {
    text-align: ${(props) => props.wideAddon && "center"};
  }
  .ant-form-item-feedback-icon-success {
    display: ${props => props.removeSuccessIcon && "none"};
  }
`;

const NumberField = ({ input, meta, ...props }) => (
  <NumberFieldWrapper wideAddon={props.wideAddon} removeSuccessIcon={props.removeSuccessIcon}>
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
      <InputNumber
        {...input}
        placeholder={props.placeholder}
        size={props.size}
        prefix={props.prefix}
        suffix={props.suffix}
        bordered={props.bordered}
        id={props.htmlID}
        addonAfter={props.addonAfter}
        addonBefore={props.addonBefore}
        maxLength={props.maxLength}
        
        aria-label={props.label}
        style={{ width: "100%" }}
        max={props.max}
        min={props.min}
      />
      {!props.hideErrorText && meta.error && meta.touched && !meta.active && (
        <ErrorText>{meta.error}</ErrorText>
      )}
    </FormItem>
  </NumberFieldWrapper>
);

export default NumberField;
