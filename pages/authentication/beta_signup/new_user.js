// React
import React, { useState, useEffect } from "react";

// Mutations
import { useMutation } from "@apollo/client";
import client from "@utils/apolloClient";
import { USER_SIGN_UP, GET_USER } from "@graphql/operations";
import { resolve } from "styled-jsx/css";


function NewBetaUser() {
  /////////////////////////
  // State and Constants //
  /////////////////////////
  var randomstring = require("randomstring");


  // Constants \\
  const testFirstName = "BetaTestFirstName"
  const testLastName = "BetaTestLastName"
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
    // New User
    const [newUser, setNewUser] = useState(false)

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
                role: roleSelected,
                phoneNumber: "1234567890",
                organizationInviteKey: therapistOrgInvite,
                
                // GUARDIAN
                childFirstName: testFirstName,
                childLastName: testLastName,
                childDateOfBirth: "01/01/2020",
                
                // ADMIN or THERAPIST
                title: "Beta Tester",
                },
            }).then(async(resolved) => {
                await handlePostCreation(resolved)
            })
        }
        catch(err){
            console.log(err)
        }
    }

    async function handlePostCreation(resolved){
        // Set token into local stoate
        localStorage.setItem("token", resolved.data.signUpUser.token);

        // Get the full user object and set that to state
        await client
        .query({
            query: GET_USER,
        })
        .then(async (resolved) => {
            console.log(resolved.data.getUser)
            setNewUser(resolved.data.getUser)
        })
        .catch((error) => {
            message.error("Sorry, there was an error getting this information");
        });
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
                <button onClick={() => createBetaUser()}>
                    Create Beta Account
                </button>
            </div>
        ) 
    }

    function renderAccountCreated(newUser){
        if (!newUser){
            return
        }
        return(
            <div style={{backgroundColor: 'white', padding: 10, marginTop: 50, borderRadius: 20, marginLeft: '10%', width: '80%', height: 200}}>
                <h1>New Account Created!</h1>
                <p>Your Login Username: {email}</p>
                <p>Your Login Password: {testPassword}</p>
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
            {renderAccountCreated(newUser)}
        </div>
    )
}

export default NewBetaUser