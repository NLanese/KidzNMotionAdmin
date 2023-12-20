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
    return assignments.map((assignmentObject) => {
      if (moment(assignmentObject.assignmentDateTime).isSame(value, "date")) {
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
