import { Badge, Calendar } from "antd";
import React from "react";
import { withRouter } from "next/router";
import styled from "styled-components";
import moment from "moment";

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
      console.log("=-=-=----=-=-=---=-=-=---=-=---=-==-=-=---=-")
      console.log("ASSIGNMENT ", index)
      console.log("STARTED ON: ", assignmentObject.dateStart)
      console.log("ENDS ON: ", assignmentObject.dateDue)
      console.log(value)
      // console.log(moment(assignmentObject.dateStart).isBefore(value, "date"))
      // console.log(moment(assignmentObject.dateDue).isBefore(value, "date"))
      // console.log(moment(assignmentObject.dateStart).isAfter(value, "date"))
      // console.log(moment(assignmentObject.dateDue).isAfter(value, "date"))
      console.log("==---=-=--===-=-=---=-=-===---=-=-=---=-=-=")
      if (

        // IF Due Date is after Current Date AND Start Date is before current date
        (
          moment(assignmentObject.dateStart).isBefore(value, "date") && 
          moment(assignmentObject.dateDue).isAfter(value, "date"
        )

        ||

        // IF Due Date is the Current Date OR Start Date is the current date
        (
          moment(assignmentObject.dateStart).isSame(value, "date") || 
          moment(assignmentObject.dateDue).isSame(value, "date")
        )
      )) {
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
