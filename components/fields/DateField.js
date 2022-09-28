import React from "react";
import { DatePicker } from "antd";
import { FormItem, FormLabel, ErrorText } from "@fields/styles";
import moment from 'moment';
const { RangePicker } = DatePicker;


function getFormat(showTime, picker) {
  if (picker) {
    if (picker === "year") {
      return "YYYY";
    } else if (picker === "month") {
      return "MM/YYYY";
    } else if (picker === "time") {
      return "h:mm A";
    }
  } else {
    if (showTime) {
      return "MM/DD/YYYY h:mm A";
    } else {
      return "MM/DD/YYYY";
    }
  }
}
const disabledDate = (current) => {
  // Can not select days before today and today
  return current && current < moment().startOf("day");
};

const DateField = ({ input, meta, ...props }) => (
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
    {props.range ? (
      <RangePicker
        {...input}
        placeholder={props.placeholder}
        style={{ width: "100%" }}
        size={props.size}
        inputReadOnly={true}
        picker={props.picker}
        use12Hours={true}
        mode={props.picker}
        allowClear={props.allowClear}
        showTime={props.showTime ? { format: "h:mm A" } : null}
        format={getFormat(props.showTime, props.picker)}
      />
    ) : (
      <DatePicker
        {...input}
        placeholder={props.placeholder}
        style={{ width: "100%" }}
        size={props.size}
        disabledDate={disabledDate}
        inputReadOnly={true}
        picker={props.picker}
        use12Hours={true}
        mode={props.picker}
        allowClear={props.allowClear}
        showTime={props.showTime ? { format: "h:mm A" } : null}
        format={getFormat(props.showTime, props.picker)}
      />
    )}

    {!props.hideErrorText && meta.error && meta.touched && !meta.active && (
      <ErrorText>{meta.error}</ErrorText>
    )}
  </FormItem>
);

export default DateField;
