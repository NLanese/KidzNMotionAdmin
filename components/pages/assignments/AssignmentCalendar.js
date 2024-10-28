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
      console.log(moment(assignmentObject.dateStart).isBefore(value, "date"))
      console.log(moment(assignmentObject.dateDue).isBefore(value, "date"))
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
      else{
        console.log("=-=-=-=-=-=-")
        console.log("START::: ", moment(assignmentObject.dateStart))
        console.log("DUE::: ", moment(assignmentObject.dateDue))
        console.log(value.$d)
        console.log("AFTER ", assignmentObject.dateStart, "? ", moment(assignmentObject.dateStart).isBefore(value, "date"))
        console.log("BEFORE ", assignmentObject.dateDue, "? ", moment(assignmentObject.dateDue).isAfter(value, "date"))
        console.log("=-=-=-=-=-=-")
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
