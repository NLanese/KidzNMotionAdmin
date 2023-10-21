// React
import React, { useState, useEffect } from "react";

// Mutations and Queries
import { useMutation } from "@apollo/client";
import {GET_ALL_CLIENTS, GET_ALL_THERAPISTS, SUPER_SET_THERAPIST } from "../../graphql/operations"
import client from "@utils/apolloClient";

// Ant Design
import { Col, Row, Button, message, Divider, Spin, DatePicker } from "antd";




function Console() {
  /////////////////////////
  // State and Constants //
  /////////////////////////

  // Client Query Data
  const [clients, setClients] = useState(false)
  const [clientsLoading, setClientsLoading] = useState(true)
  const [clientsError, setClientsError] = useState(false)

  // Selected Client
  const [selectedClient, setSelectedClient] = useState(false)


  // Therapist Query Data
  const [therapists, setTherapists] = useState(false)
  const [therapistsLoading, setTherapistsLoading] = useState(true)
  const [therapistsError, setTherapistsError] = useState(false)


  // This determines which inforomation is displayed on-screen.
  //  - None (default)
  //  - setTherapist 
  const [consoleState, setConsoleState] = useState("None")  


//////////////////////////
// Muations and Queries //
//////////////////////////

/////////////////
// Use Effects //
/////////////////

  // Queries clients and therapists
  useEffect(() => {
    
      // Get All Clients
      client
        .query({
          query: GET_ALL_CLIENTS,
          fetchPolicy: "network-only",
        })
        .then(async (resolved) => {
          setClients(resolved.data.getAllClients);
          setClientsLoading(false)
        })
        .catch((error) => {
          message.error("Sorry, there was an error getting this information");
          setClientsError(error)
          setClientsLoading(false)
        });

        // Get All Therapists
        client
          .query({
            query: GET_ALL_THERAPISTS,
            fetchPolicy: "network-only",
          })
          .then(async (resolved) => {
            setTherapists(resolved.data.getAllTherapists);
            setTherapistsLoading(false)
          })
          .catch((error) => {
            message.error("Sorry, there was an error getting this information");
            setTherapistsError(error)
            setTherapistsLoading(false)
        });
  }, [])


////////////////
// Renderings //
////////////////

  // Renders all Clients
  const renderAllClients = () => {
    return clients.map( (cli, index) => {
      return(
        <Row>
          <Button
          type="primary"
          size="small"
          onClick={() => {
            setSelectedClient(cli)
            setConsoleState("setTherapist")
          }}
          >
            {cli.firstName} {cli.lastName}
          </Button>
        </Row>
      )
    })
  }

  // Renders all Therapists
  const renderAllTherapists = () => {
    if (consoleState !== "setTherapist"){
      return
    }
    return therapists.map( (thr, index) => {
      return(
        <Row>
          <Button
          type="primary"
          size="small"
          onClick={() => {
            
          }}
          >
            {thr.firstName} {thr.lastName}
          </Button>
        </Row>
      )
    })
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

    // Both Queries Completed
    else if (clients && therapists){
      return (
        <div>
          <h1>Super console</h1>
          <Row>
            <Col>
              {renderAllClients()}
            </Col>
            <Col>
              <h2>Select a Therapist for this user</h2>
              {renderAllTherapists()}
            </Col>
          </Row>
          
        </div>
      );
    }

    // Error
    else{
      return (
        <div>
          <h1>Super console</h1>
          <p>
            Weird Error
          </p>
          <p>{clientsData}</p>
          <p>{clientsError}</p>
          <p>{clientsLoading}</p>
        </div>
      );
    }
  }

  
  return MAIN();
}
  
export default Console;