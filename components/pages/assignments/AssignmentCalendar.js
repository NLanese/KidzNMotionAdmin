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

function MeetingCalendar({ router, meetings }) {
  const dateCellRender = (value) => {
    return meetings.map((meetingObject) => {
      if (moment(meetingObject.meetingDateTime).isSame(value, "date")) {
        return (
          <li key={meetingObject.id}>
            <Badge status="success" text={meetingObject.title } />
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

export default withRouter(MeetingCalendar);
