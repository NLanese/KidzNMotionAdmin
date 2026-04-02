// React
import React, { useState, useEffect } from "react";

// Mutations
import { useMutation } from "@apollo/client";
import { USER_SIGN_UP } from "@graphql/operations";


function NewBetaUser() {
  /////////////////////////
  // State and Constants //
  /////////////////////////
  var randomstring = require("randomstring");


  // Constants \\
  const testFirstName = "FirstName"
  const testLastName = "LastName"
  const testPassword = randomstring.generate(7);
  const therapistOrgInvite = "a7c9cb52-a6ec-4d14-a5de-2da4c624e15d"

  // States \\ 

    // Email
    const [email, setEmail] = useState("")
    // Name
    const [name, setName] = useState("")
    // EmailValidity
    const [isEmailValid, setIsEmailValid] = useState(false)
    // Mutation Success Check
    const [isAccountCreated, setIsAccountCreated] = useState(false)
    // RoleSelection
    const [roleSelected, setRoleSelected] = useState(false)

  // Mutations \\

    const [signUpUser, {}] = useMutation(USER_SIGN_UP);
    
  // useEffects \\

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

    ///////////////
    // Functions //
    ///////////////

    async function createBetaUser(){
        try{
            await signUpUser({
                variables: {
                email: email,
                password: testPassword,
                firstName: name,
                lastName: testLastName,
                role: role,
                phoneNumber: formValues.phoneNumber,
                organizationInviteKey: formValues.organizationInviteKey,
                
                // GUARDIAN
                childFirstName: formValues.childFirstName,
                childLastName: formValues.childLastName,
                childDateOfBirth: formValues.childDateOfBirth,
                
                // ADMIN or THERAPIST
                title: formValues.title,
                organizationName: formValues.organizationName,
                },
            })
        }
        catch(err){
            console.log(err)
        }
    }



    ///////////////
    // Rendering //
    ///////////////

    function renderHeaderPrelude(){
        return(
            <div style={{marginTop: '-3%'}}>
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
            <div>
                <div style={{display: 'flex', flexDirection: 'row'}}>
                    <p style={{width: 80}}>
                        Email: 
                    </p>
                    <input 
                        onChange={((e) => setEmail(e.target.value))}
                        value={email}
                    />
                </div>
                <div style={{display: 'flex', flexDirection: 'row'}}>
                    <p style={{width: 80}}>
                        First Name: 
                    </p>
                    <input 
                        style={{widht: 900}}
                        onChange={((e) => setName(e.target.value))}
                        value={name}
                    />
                </div>
            </div>
            
            
        )
    }

    function renderAccountTypes(){
        let cardStyle = (item) => {
            let style = {
                margin: 10,
                justifyContent: 'center',
                flex: 3,
                border: '1px solid black',
                padding: 5, 
                borderRadius: 15
            }
            if (item === roleSelected){
                style.backgroundColor = "orange"
            }
            else{
                style.backgroundColor = "white"
            }
            return style
        }
        if (isEmailValid){
            return(
            <div style={{display: 'flex', flexDirection: 'row'}}>
                <button style={cardStyle("GUARDIAN")} onClick={() => setRoleSelected("GUARDIAN")}>
                    Client Account
                </button>
                <button style={cardStyle("THERAPIST")} onClick={() => setRoleSelected("THERAPIST")}>
                    Therapist Account
                </button>
            </div>
        )
        }
    }

    function renderCreateBetaAccount(){
        if (!roleSelected){
            return
        }
        return(
            <div style={{display: 'flex', justifyContent: 'center', marginTop: 20}}>
                <button >
                    Create Beta Account
                </button>
            </div>
        ) 
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
        <div style={{height: '100%'}}>
            <div style={{backgroundColor: 'white', padding: 20, borderRadius: 20, marginLeft: '10%', width: '80%', height: 400}}>
                {renderHeaderPrelude()}
                {renderInput()}
                {renderAccountTypes()}
                {renderCreateBetaAccount()}
            </div>
        </div>
    )
}

export default NewBetaUser