// React
import React, { useState, useEffect } from "react";

// Mutations and Queries
import { useMutation } from "@apollo/client";
import {
  GET_ALL_CLIENTS, GET_ALL_THERAPISTS,
  SUPER_SET_THERAPIST, SUPER_DELETE_ASSIGNMENTS, SUPER_DELETE_USER,
  SUPER_CREATE_EXPIRED_ASSIGNMENTS, SUPER_ACTIVATE_USERS
} from "../../graphql/operations"
import client from "@utils/apolloClient";

// Ant Design
import { Col, Row, Button, message, Divider, Spin, DatePicker, Modal } from "antd";
import TextArea from "antd/lib/input/TextArea";

function Console() {
  /////////////////////////
  // State and Constants //
  /////////////////////////

  ////////////////////
  // Client Query Data
  const [clients, setClients] = useState(false)
  const [clientsLoading, setClientsLoading] = useState(true)
  const [clientsError, setClientsError] = useState(false)

  ///////////////////////
  // Therapist Query Data
  const [therapists, setTherapists] = useState(false)
  const [therapistsLoading, setTherapistsLoading] = useState(true)
  const [therapistsError, setTherapistsError] = useState(false)

  
  // Selected Client
  const [selectedClient, setSelectedClient] = useState(false)

  // Selected Therapist
  const [selectedTherapist, setSelectedTherapist] = useState(false)


  //////////////////
  // SELECTED IDS //

    // Holds selected IDs for really anything, since most operations iterate by ID
    const [arrayIDText, setArrayIDText] = useState("")
    const [arrayIDs, setArrayIDs] = useState([])

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
const [deleteAssignments, {}] = useMutation(SUPER_DELETE_ASSIGNMENTS);
const [deleteUser, {}] = useMutation(SUPER_DELETE_USER);
const [createExpiredAssignment, {}] = useMutation(SUPER_CREATE_EXPIRED_ASSIGNMENTS)
const [superActivateUsers, {}] = useMutation(SUPER_ACTIVATE_USERS)


/////////////////
// Use Effects //
/////////////////

  // Queries clients and therapists
  useEffect(() => {
  
    // GETS ALL CLIENTS \\
    if (!clientsError && !clients){
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

    // GETS ALL THERAPISTS \\
    if (!therapistsError && !therapists){
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

  ////////////////////////
  // EXPIRED ASSIGNMENT //
  ////////////////////////

    async function createExpiredAssignmentFunction(){
      console.log("Creating Expired Assignment")
      await createExpiredAssignment({
        variables: {
          superUserKey: process.env.SUPER_USER_SECRET_KEY
        }
      })
    }

  ///////////////////
  // SET THERAPIST //
  ///////////////////
  
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

  ////////////////////////////////////////
  // DELETE ASSIGNMENTS / ACIVATE USERS //
  ////////////////////////////////////////

    // Adds a chosen ID from the Selected ID Array
    function addToArrayID(){
      if (arrayIDText.length > 2){
        setArrayIDs( prev => [...prev, arrayIDText])
        setArrayIDText("")
      }
    }

    // Removes a chosen ID from the Selected ID Array
    function removeIDFromArray(id){
      setArrayIDs( prev => prev.filter(savedID => {
        if (id !== savedID){
          return savedID
        }
      }))
    }

  ///////////////////////
  // Mutation Handlers //
  ///////////////////////

  // Handles the deletion of an Assignment 
  async function handleDeleteAssignments(){
    await deleteAssignments({
      variables: {
        idArray: arrayIDs,
        superUserKey: process.env.SUPER_USER_SECRET_KEY
      }
    })
  }

  // Handles the deletion of a User 
  async function handleDeleteUsers(){
    arrayIDs.forEach( async id => {
      console.log("Deleting user ", id)
      console.log(process.env.SUPER_USER_SECRET_KEY)
      try{
        await deleteUser({
          variables: {
            userId: id,
            superUserKey: process.env.SUPER_USER_SECRET_KEY
          }
        })
      }
      catch(err){
        console.log(err)
      }
    })
  }

  // Handles the Activation of a User(s) 
  async function handleActivateUsers(){
    await superActivateUsers({
      variables: {
        idArray: arrayIDs,
        superUserKey: process.env.SUPER_USER_SECRET_KEY
      }
    })
  }

////////////////
// Renderings //
////////////////

  ////////////////////////
  // EXPIRED ASSIGNMENT //
  ////////////////////////

    const renderSendExpiredAssignmentButton = () => {
      return(
        <Button
        type="primary"
            size="small"
            onClick={() => { createExpiredAssignmentFunction()}}>
          Send Expired Assignment to Ostrich Test
        </Button>
      )
    }

  ///////////////////
  // SET THERAPIST //
  ///////////////////

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
      // if (consoleState !== "setTherapist"){
      //   return null
      // }
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

    // Renders Modal Content
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

  ////////////////////////////////////////////////////////
  // DELETE ASSIGNMENTS / ACTIVATE USERS / DELETE USERS //
  ////////////////////////////////////////////////////////

    // Renders Delete Assginments ID text box
    const renderArrayIDTextBox = () => {
      return(
        <TextArea
          value={arrayIDText}
          onChange={(event) => {
            console.log(event.target.value)
            setArrayIDText(event.target.value)
          }}
        />
      )
    }

    // Renders the Button to Add the Entered ID
    const renderAddID = () => {
      return(
        <Button
          onClick={() => addToArrayID()}
          size="middle"
        >
          Add ID
        </Button>
      )
    }

    // Renders the Assignments that have been added 
    const renderArrayIDs = () => {
      return arrayIDs.map(id => {
        console.log("THIS IS A CURRENT ID")
        console.log(id)
        return(
          <Row key={id}>
            {id}
            <Button
              onClick={(id) => removeIDFromArray(id)}
              size="middle"
            >
              Remove
            </Button>
          </Row>
        )
      })
    }

      // Renders the Button to submit Delete Assignments
      const renderActivateButton = () => {
        return (
          <Button 
            onClick={() => handleActivateUsers()}
            disabled={ arrayIDs.length > 0 ? false : true}
          >
            ACTIVATE SELECTED USERS
          </Button>
        )
      }

      // Renders the Button to submit Delete Assignments
      const renderDeleteButton = () => {
        return (
          <Button 
            onClick={() => handleDeleteAssignments()}
            disabled={ arrayIDs.length > 0 ? false : true}
          >
            DELETE LISTED ID
          </Button>
        )
      }

      // Renders the Button to submit Delete Assignments
      const renderDeleteUserButton = () => {
        return (
          <Button 
            onClick={() => handleDeleteUsers()}
            disabled={ arrayIDs.length > 0 ? false : true}
          >
            DELETE LISTED USER ID(s)
          </Button>
        )
      }

  /////////////////
  // MAIN RETURN //
  /////////////////
  const therapistMAIN = () => {

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
          open={modalOpen}
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

  // Renders the console to Delete Assignments
  const renderAssignmentMAIN = () => {
    return (
      <div>
        <h4>Assignments to Delete...</h4>
        {renderArrayIDs()}
        <Row>
          <Col>
            {renderArrayIDTextBox()}
          </Col>
          <Col>
            {renderAddID()}
          </Col>
        </Row>
        <Row>
          {renderDeleteButton()}
        </Row>
      </div>
    )
  }

  // Renders Console to Create an Expired Assignment
  const expiredAssignmentMAIN = () => {
    return(
      <div>
        {renderSendExpiredAssignmentButton()}
      </div>
    )
  }

  // Renders the Activate Users console
  const renderActivateUsersMAIN = () => {
    return (
      <div>
        <h4>Accounts to Activate...</h4>
        {renderArrayIDs()}
        <Row>
          <Col>
            {renderArrayIDTextBox()}
          </Col>
          <Col>
            {renderAddID()}
          </Col>
        </Row>
        <Row>
          {renderActivateButton()}
        </Row>
      </div>
    )
  }

  // Renders the Delete Users console
  const renderDeleteUsersMAIN = () => {
    return (
      <div>
        <h4>Users to Delete...</h4>
        {renderArrayIDs()}
        <Row>
          <Col>
            {renderArrayIDTextBox()}
          </Col>
          <Col>
            {renderAddID()}
          </Col>
        </Row>
        <Row>
          {renderDeleteUserButton()}
        </Row>
      </div>
    )
  }
  


  //////////\\\\\\\\\\\
  //   MAIN RETURN   \\
  /////////||\\\\\\\\\\
  // return therapistMAIN();
  return renderDeleteUsersMAIN()
}
  
export default Console;