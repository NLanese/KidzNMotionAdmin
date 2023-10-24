// React
import React, { useState, useEffect } from "react";

// Mutations and Queries
import { useMutation } from "@apollo/client";
import {GET_ALL_CLIENTS, GET_ALL_THERAPISTS, SUPER_SET_THERAPIST } from "../../graphql/operations"
import client from "@utils/apolloClient";

// Ant Design
import { Col, Row, Button, message, Divider, Spin, DatePicker, Modal } from "antd";

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

  // Selected Therapist
  const [selectedTherapist, setSelectedTherapist] = useState(false)


  // This determines which inforomation is displayed on-screen.
  //  - None (default)
  //  - setTherapist 
  const [consoleState, setConsoleState] = useState("None")  

  // This determines the information inside of the modal ( or if not displayed )
  // - false (default)
  // - setTherapist
  const [modalData, setModalData] = useState(false)

  const [modalOpen, setModalOpen] = useState(false)

  // Determines if the whole page is loading or not
  const [generalLoading, setGeneralLoading] = useState(false)


//////////////////////////
// Muations and Queries //
//////////////////////////

const [setTherapistMutation, {}] = useMutation(SUPER_SET_THERAPIST);

/////////////////
// Use Effects //
/////////////////

  // Queries clients and therapists
  useEffect(() => {
  
    if (!clientsError && !clients){
      // Get All Clients
      client
      .query({
        query: GET_ALL_CLIENTS,
        fetchPolicy: "network-only",
      })
      .then(async (resolved) => {
        console.log("CLIENTS::::")
        console.log(resolved.data.getAllClients)
        setClients(resolved.data.getAllClients);
        setClientsLoading(false)
      })
      .catch((error) => {
        message.error("Sorry, there was an error getting this information");
        setClientsError(error)
        setClientsLoading(false)
      });
    }

    if (!therapistsError && !therapists){
        // Get All Therapists
        client
        .query({
          query: GET_ALL_THERAPISTS,
          fetchPolicy: "network-only",
        })
        .then(async (resolved) => {
          console.log("THERAPISTS::::")
          console.log(resolved.data.getAllTherapists)
          setTherapists(resolved.data.getAllTherapists);
          setTherapistsLoading(false)
        })
        .catch((error) => {
          message.error("Sorry, there was an error getting this information");
          setTherapistsError(error)
          setTherapistsLoading(false)
      });
    }
  }, [])


///////////////
// Functions //
///////////////

async function executeSetTherapistMutation(){
  console.log("SELECTED CLIENT::::: ")
  console.log(selectedClient)
  let careID
  if (selectedClient.childCarePlans.length === 0){
    console.log("EMPTY CARE PLANS")
    careID = "false"
  }
  else{
    careID = selectedClient.childCarePlans[0].id
  }
  console.log("Mut Params")
  console.log(careID)
  console.log(selectedClient.id)
  console.log(selectedClient.guardian.id)
  console.log("executing...")
  await setTherapistMutation({
    variables: {
      childCarePlanID: careID,
      childID: selectedClient.id,
      guardianID: selectedClient.guardian.id,
      therapistID: selectedTherapist.id,
      superUserKey: process.env.SUPER_USER_SECRET_KEY
    },
  })
    .then(async (resolved) => {
      console.log("Set Therapist Complete")
      console.log("New Client Object...")
      console.log(resolved.data.superSetTherapist)
      setGeneralLoading(false)
    })
    .catch((error) => {
      message.error(error);
    });
}


////////////////
// Renderings //
////////////////

  // Renders all Clients
  const renderAllClients = () => {
    return clients.map( (cli, index) => {
      return(
        <Row key={index}>
          <Button
          type="primary"
          size="small"
          onClick={() => {
            console.log("SELECTED CLIENT::::")
            console.log(cli)
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
    if (generalLoading){
      return null
    }
    if (consoleState !== "setTherapist"){
      return null
    }
    if (!therapists){
      return null
    }
    return therapists.map( (thr, index) => {
      return(
        <Row key={index}>
          <Button
          type="primary"
          size="small"
          onClick={() => {
            console.log("SELECTED THERAPIST::::")
            console.log(thr)
            setSelectedTherapist(thr)
            setModalData("setTherapist")
            setModalOpen(true)
          }}
          >
            {thr.firstName} {thr.lastName}
          </Button>
        </Row>
      )
    })
  }

  const renderModalContent = () => {
    if (modalData === "setTherapist"){
      return(
        <div>
          Do you want to set {selectedClient.firstName} {selectedClient.lastName}'s therapist to {selectedTherapist.firstName} {selectedTherapist.lastName}
          <Button
          onClick={() => {
            console.log("Yes press")
            setGeneralLoading(true)
            executeSetTherapistMutation()
          }}
          >
            Yes
          </Button>
          <Button>
            No
          </Button>
        </div>
      )
    }
  }

  /////////////////
  // MAIN RETURN //
  /////////////////
  const MAIN = () => {

    if (generalLoading){
      return(
        <div>
          <h1>LOADING</h1>
        </div>
      )
    }

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
      console.log(modalOpen)
      return (
        <div>
          <Modal
          visible={modalOpen}
          onCancel={() => setModalOpen(false)}
          >
            {renderModalContent()}
          </Modal>
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