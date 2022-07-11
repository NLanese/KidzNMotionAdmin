import React, { useState } from "react";
import { Calendar } from "antd";
import styled from "styled-components";

const ShiftCalendarWrapper = styled.div`
  .ant-picker-calendar-header .ant-picker-calendar-mode-switch {
    display: none;
  }
`;

function ShiftCalendar({setSelectedDate}) {


  const onSelect = (newValue, mode) => {
    setSelectedDate(newValue);
  };


  return (
    <ShiftCalendarWrapper>
      <Calendar
        mode="month"
        onSelect={onSelect}
      />
    </ShiftCalendarWrapper>
  );
}

export default ShiftCalendar;
