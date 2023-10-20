// React
import React, { useState, useEffect } from "react";

// Mutations and Queries
import { useMutation, useQuery } from "@apollo/client";
import {SUPER_GET_ALL_CLIETS, SUPER_GET_ALL_THERAPISTS} from "../../graphql/operations"
import client from "@utils/apolloClient";

// Ant Design
import { Col, Row, Button, message, Divider, Spin, DatePicker } from "antd";




function Console() {
  /////////////////////////
  // State and Constants //
  /////////////////////////

  const [clients, setClients] = useState([])

  const [therapists, setTherapists] = useState([])

  // This determines which inforomation is displayed on-screen. | None | Clients | Therapists | 
  const [consoleState, setConsoleState] = useState("None")  


//////////////////////////
// Muations and Queries //
//////////////////////////

const { clientsLoading, clientsError, clientsData } = useQuery(SUPER_GET_ALL_CLIETS);

const { therapistsLoading, therapistsError, therapistsData } = useQuery(SUPER_GET_ALL_THERAPISTS);



////////////////
// Renderings //
////////////////

  const renderAllClients = () => {

  }

  /////////////////
  // MAIN RETURN //
  /////////////////
  const MAIN = () => {

    // Still Loading Queries
    if (clientsLoading || therapistsLoading){
      return(
        <div>
          <h1>Super console</h1>
          <p>Please wait as the console data is still loading</p>
        </div>
      )
    }

    // Loading Complete, WITH ERROR
    else if (clientsError || therapistsError){
      return (
        <div>
          <h1>Super console</h1>
          <p>There was an error with one of the queries!</p>
        </div>
      );
    }
  }
  
  return (
    <div>
      <h1>Super console</h1>
      
    </div>
  );
}
  
export default Console;