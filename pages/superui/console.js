// React
import React, { useState, useEffect } from "react";

// Mutations and Queries
import { useMutation, useQuery } from "@apollo/client";
import {GET_ALL_CLIENTS, GET_ALL_THERAPISTS} from "../../graphql/operations"
import client from "@utils/apolloClient";

// Ant Design
import { Col, Row, Button, message, Divider, Spin, DatePicker } from "antd";




function Console() {
  /////////////////////////
  // State and Constants //
  /////////////////////////

  const [clients, setClients] = useState(false)
  const [clientsLoading, setClientsLoading] = useState(true)
  const [clientsError, setClientsError] = useState(false)

  const [therapists, setTherapists] = useState(false)
  const [therapistsLoading, setTherapistsLoading] = useState(true)
  const [therapistsError, setTherapistsError] = useState(false)


  // This determines which inforomation is displayed on-screen. | None | Clients | Therapists | 
  const [consoleState, setConsoleState] = useState("None")  


//////////////////////////
// Muations and Queries //
//////////////////////////

// const { clientsLoading, clientsError, clientsData } = useQuery(GET_ALL_CLIENTS, {
//   onError: (error) => {
//     console.error("Error occurred during query execution:", error);
//   },
// });

// const { therapistsLoading, therapistsError, therapistsData } = useQuery(GET_ALL_THERAPISTS);

/////////////////
// Use Effects //
/////////////////

  // useEffect(() => {
  //   if (!clientsError && !clientsLoading){
  //     console.log("CLIENTS DATA::: ")
  //     console.log(clientsData)
  //     setClients(clientsData)
  //   }
  // }, [clientsData])

  // useEffect(() => {
  //   if (!therapistsError && !therapistsLoading){
  //     console.log("THERAPIST DATA::: ")
  //     console.log(therapistsData)
  //     setTherapists(therapistsData)
  //   }
  // }, [therapistsData])

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

  const renderAllClients = () => {
    return clients.map( (cli, index) => {
      return(
        <Button
          type="primary"
          size="small"
          onClick={() => {
            return
          }}
        >
          {cli.firstName} {cli.lastName}
        </Button>
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
          <p>
            {renderAllClients()}
          </p>
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