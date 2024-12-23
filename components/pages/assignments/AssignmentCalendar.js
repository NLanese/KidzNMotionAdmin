import { Badge, Calendar } from "antd";
import React from "react";
import { withRouter } from "next/router";
import styled from "styled-components";
import dayjs from 'dayjs';;

const CalenderContainer = styled.div`
  & ul {
    padding: 0px;
  }
  & li {
    padding: 0px;
  }
`;

function AssignmentCalendar({ router, assignments }) {


  const dateCellRender = (value) => {
    return assignments.map((assignmentObject, index) => {

      const endOfDueDate = new Date(assignmentObject.dateDue);
      endOfDueDate.setHours(23, 59, 59, 999);

      if (
        // IF Due Date is after Current Date AND Start Date is before current date
          new Date(assignmentObject.dateStart) <= new Date(value.$d)
          && 
          new Date(endOfDueDate) >= new Date(value.$d)
        ) {
        return (
          <li key={assignmentObject.id}>
            <Badge status="success" text={assignmentObject.title } />
          </li>
        );
      }
    });
  };

  return (
    <CalenderContainer>
      <Calendar dateCellRender={dateCellRender} />
    </CalenderContainer>
  );
}

export default withRouter(AssignmentCalendar);
