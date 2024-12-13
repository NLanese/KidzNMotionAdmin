
// React
import React, { useEffect, useState } from "react";

// Recoil 
import { userState, patientDataState } from "@atoms";
import { useRecoilState } from "recoil";

// Style
const IndexWrapper = styled.div`
  max-width: ${(props) => props.theme.contentSize.standard};
  margin: auto;
  .ant-typography strong {
    font-size: 16.5px;
  }
  @media (max-width: ${(props) => props.theme.breakPoints.sm}) {
    .ant-divider {
      margin: 2px 0px;
    }
  }
`;


///////////////
// Component //
///////////////

function PatientComments({router}){

  ///////////
  // State //
  ///////////

    // User
    const [user, setUser] = useRecoilState(userState);

    // Selected Patient's Details
    const [patientDetail, setPatientDetail] = useRecoilState(patientDataState);

  ////////////////
  // UseEffects //
  ////////////////

    // If not a Therapist, Prevents Access
    useEffect(() => {
        if (user.role !== "THERAPIST") {
          Router.push("/");
        }
        console.log("In COMMENTS Page with the following Data")
        console.log(patientDetail)
      }, []);


  /////////////////
  // Main Render //
  /////////////////
  return(
    <IndexWrapper>

    </IndexWrapper>
  )
}