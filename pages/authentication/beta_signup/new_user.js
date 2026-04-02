// React
import React, { useState, useEffect } from "react";

// Mutations
import { useMutation } from "@apollo/client";


function NewBetaUser() {
  /////////////////////////
  // State and Constants //
  /////////////////////////

  const [email, setEmail] = useState("")
  const [isEmailValid, setIsEmailValid] = useState(false)
  const [isAccountCreated, setIsAccountCreated] = useState(false)

  useEffect(() => {
    if (email.includes("@")){
        if (
            email.includes(".com") ||
            email.includes(".net") ||
            email.includes(".org") ||
            email.includes(".gov") ||
            email.includes(".web")
        ){
            setIsEmailValid(true)
        }
        else{ setIsEmailValid(false) }
    }
    else{ setIsEmailValid(false) }
  }, [email])

  const [roleSelected, setRoleSelected] = useState()




    ///////////////
    // Rendering //
    ///////////////

    function renderHeaderPrelude(){
        return(
            <div style={{marginTop: '-6%'}}>
                <h1>Welcome, Beta Testers!</h1>
                <p>
                    Please enter your email in the bow below, and then select whether your
                    test account will be a THERAPIST account or a CLIENT account with a CHILD and
                    a GUARDIAN. 
                </p>
            </div>
        )
    }

    function renderInput(){
        return(
            <input 
                onChange={((e) => setEmail(e.target.value))}
                value={email}
            />
        )
    }

    function renderAccountTypes(){
        let cardStyle = {
            margin: 10,
            justifyContent: 'center',
            flex: 3,
            border: '1px solid black',
            padding: 5, 
            borderRadius: 15
        }
        if (isEmailValid){
            return(
            <div style={{display: 'flex', flexDirection: 'row'}}>
                <button style={cardStyle} onClick={() => setRoleSelected("Client")}>
                    Client Account
                </button>
                <button style={cardStyle} onClick={() => setRoleSelected("Therapist")}>
                    Therapist Account
                </button>
            </div>
        )
        }
    }

    function renderAccountCreated(){
        return(
            <div style={{backgroundColor: 'white', padding: 20, borderRadius: 20, marginLeft: '10%', marginTop: 30, width: '80%'}}>

            </div>
        )
    }

    //////////\\\\\\\\\\\
    //   MAIN RETURN   \\
    /////////||\\\\\\\\\\
    return(
        <div>
            <div style={{backgroundColor: 'white', padding: 20, borderRadius: 20, marginLeft: '10%', width: '80%'}}>
                {renderHeaderPrelude()}
                {renderInput()}
                {renderAccountTypes()}

            </div>
        </div>
    )
}

export default NewBetaUser