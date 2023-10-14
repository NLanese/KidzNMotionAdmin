import React, { useEffect, useState } from "react";
import { View } from "react";
import styled from "styled-components";
import { LogoutOutlined } from "@ant-design/icons";
import { useRecoilState } from "recoil";
import { userState } from "@atoms";
import { capitalizeFirstLetter } from "@helpers/common";
import { ExclamationCircleOutlined, SyncOutlined } from "@ant-design/icons";
import NakedButton from "@common/NakedButton";
import { Typography, Dropdown, Menu, message, Tag, Space, Modal, Button } from "antd";
import { getCheckoutURL } from "@helpers/billing";
import { useRouter } from "next/router";
import Avatar from "@forms/profileSettings/Avatar";
import { useMutation } from "@apollo/client";
import {
  GENERATE_SOLO_GUARDIAN_CHECKOUT_LINK,
  GENERATE_ANNUAL_SOLO_GUARDIAN_CHECKOUT_LINK,
  GENERATE_SOLO_GUARDIAN_PORTAL_LINK,
} from "@graphql/operations";
import { getBillingInformation } from "../../helpers/billing";

const { Title } = Typography;

// Avatar Styles
const AvatarDetails = styled.div`
  display: flex;
  cursor: pointer;
  z-index: 99;
  transition: ${(props) => props.theme.transitions.standard};
  :hover {
    opacity: 0.7;
    transition: ${(props) => props.theme.transitions.standard};
  }
  .ant-avatar {
    background-color: ${(props) => props.theme.colors.primary} !important;
  }
`;

// Avatar And Profile Name
const AvatarTextDetails = styled.div`
  text-align: right;
  padding-left: 8px;
  justify-content: center;
  align-items: flex-end;
  display: flex;

  flex-direction: column;
  & h2 {
    margin: 0px;
    font-size: 16px;
    line-height: 15px;
  }
  & span {
    font-size: 14px;
    margin: 0px;
  }
  @media (max-width: ${(props) => props.theme.breakPoints.md}) {
    & h5 {
      display: none;
    }
  }
`;


////////////////////
//                //
//   COMPONENT    //
//                //
////////////////////
function TopMenuAvatar() {


  /////////////////
  // PRELIMINARY //
  /////////////////

  ////////////
  // States //
  ////////////

    // User
    const [user, setUser] = useRecoilState(userState);

    // Loading
    const [loading, setLoading] = useState(false);

    // Annual / Monthly Optionbar Toggle
    const [showSubscriptionToggle, setShowSubscriptiontoggle] = useState(false)

    // Determines whether alert was sent
    const [alertsShown, setAlertsShown] = useState(false)


  ///////////////
  // Mutations //
  ///////////////

    // Link to Guardian Stripe (Monthly)
    const [generateSoloGuardianCheckoutLink, {}] = useMutation(
      GENERATE_SOLO_GUARDIAN_CHECKOUT_LINK
      // GENERATE_SOLO_GUARDIAN_PORTAL_LINK
    );

    // Link to Guardian Stripe (Yearly)
    const [generateAnnualSoloGuardianCheckoutLink, {}] = useMutation(
      GENERATE_ANNUAL_SOLO_GUARDIAN_CHECKOUT_LINK
      // GENERATE_SOLO_GUARDIAN_PORTAL_LINK
    );

  ///////////////
  // Constants //
  ///////////////

    // Navigation to Stripe
    const router = useRouter();


  // Checks subscription Status
  const checkSubStatus = async () => {
    if(
      usernameLowercase == "ostrichdeveloper@gmail.com" ||
      usernameLowercase == "nlanese21@gmail.com" ||
      usernameLowercase == "ostrichdevtest@gmail.com"
    ){
      return 
    }
    await getBillingInformation().then((data) => {
      if (data) {
        if (data.subscription) {
          if (data.subscription.status !== "active") {
            window.location = data.sessionURL;
          }
        }
      }
    });
  };


////////////////////
//                //
//   UseEffects   //
//                //
////////////////////

  //////////////////////////////////
  // Checking Subscription Status //
  //////////////////////////////////
  useEffect(() => {

    // Super User
    if (
        user.email.toLowerCase() === "nlanese21@gmail.com" ||
        user.email.toLowerCase() === "ostrichdeveloper@gmail.com" ||
        user.email.toLowerCase() === "ostrichtestdev@gmail.com"
      ){
        return null
      }

    // Guardian
    if (user.role === "GUARDIAN") {
      checkSubStatus();
    }

    // Therapist / Admin who has Org control AND it is expired
    if (user.subscriptionStatus === "expiredOwner") {
      if (!router.asPath.includes("billing")) {
        // router.push("/account/billing");
        message.success("Please update your billing information to continue");
      }
    }

    // Expired Organization as a Therapist or User
    if (user.subscriptionStatus === "expiredNotOwner") {
      alert(
        "Please contact your organization owner to update billing information"
      );
    }
  }, []);

  // ////////////////////////////
  // // User has expired Trial //
  // ////////////////////////////
  // useEffect(() => {
  //   if (!alertsShown){
  //     if (user.subscriptionStatus === "expiredOwner") {
  //       if (!router.asPath.includes("billing")) {
  //         message.success("Please update your billing information to continue");
  //       }
  //       setAlertsShown(true)
  //     }
  //     if (user.subscriptionStatus === "expiredNotOwner") {
  //       alert("Organization Account Expired!");
  //       setAlertsShown(true)
  //     }
  //   }
  // }, [router]);


//////////////////
//              //
//  Renderings  //
//              //
//////////////////

  // Renders the Free Trial Tag for Organizations
  const renderOrgFreeTrialTag = () => {

    // Exit out if user is not an organization owner
    if (!user.ownedOrganization) return;

    // If the user's owned organization does not have a stripeID
    if (!user.ownedOrganization.stripeSubscriptionID) {
      let daysLeft = parseInt(
        8 -
          (new Date().getTime() -
            new Date(user.ownedOrganization.createdAt).getTime()) /
            (1000 * 3600 * 24)
      );
      return (
        <content>
          <NakedButton onClick={() => setShowSubscriptiontoggle(true)}>
            <Tag
              style={{ fontWeight: 600 }}
              icon={
                loading ? <SyncOutlined spin /> : <ExclamationCircleOutlined />
              }
              color="processing"
              size="large"
            >
              {daysLeft <= 0
                ? "Your Trial Has Expired"
                : `  ${daysLeft} Days Left On Trial (Activate)`}
            </Tag>
          </NakedButton>
        </content>
      );
    }
  };

  // Renders Guardian Free Trial Space
  const renderGuardianFreeTrialTag = () => {
     
    // Exit out id not a Guardian
    if (!user.role === "GUARDIAN"){
      return;
    }

    // If the user does not have a stripeId
    if (!user.soloStripeSubscriptionID) {
      let daysLeft = parseInt(
        8 -
          (new Date().getTime() - new Date(user.createdAt).getTime()) /
            (1000 * 3600 * 24)
      );
      return (
        <content>
          <NakedButton onClick={() => setShowSubscriptiontoggle(true)}>
            <Tag
              style={{ fontWeight: 600 }}
              icon={
                loading ? <SyncOutlined spin /> : <ExclamationCircleOutlined />
              }
              color="processing"
              size="large"
            >
              {daysLeft <= 0
                ? "Your Trial Has Expired"
                : `  ${daysLeft} Days Left On Trial (Activate)`}
            </Tag>
          </NakedButton>
        </content>
      );
    }
  };

  // Renders the Free Trial Tag
  function renderFreeTrialTag(){
    if (showSubscriptionToggle){
      return renderAnnualOrMonthlyOptions()
    }
    else if (user.role === "GUARDIAN"){
      return renderGuardianFreeTrialTag()
    }
    else if (user.role === "THERAPIST" || user.role === "ADMIN"){
      return renderOrgFreeTrialTag()
    }
  }

  // Renders the Annual or Monthly Options on the TopMenuBar in place of the Free Trial button
  function renderAnnualOrMonthlyOptions(){
    if (showSubscriptionToggle){
      return(
          <content>
            <NakedButton onClick={() => determineUserTypeForSubscription("Monthly")}>
              <Tag>
                Monthly Subscription
              </Tag>
            </NakedButton>
            <NakedButton onClick={() => determineUserTypeForSubscription("Annual")}>
              <Tag>
                Annual Subscription (One Month Free)
              </Tag>
            </NakedButton>
          </content>
      )
    }
  }

////////////////
//            //
//  Handlers  //
//            //
////////////////


  // PAYMENTS // 

    function determineUserTypeForSubscription(subType){
      if (user.role === "GUARDIAN"){
        return guardianCheckout(subType)
      }
      else{
        checkout(subType)
      }
    }

    // Redirect to Stripe for Organization Checkout
    const checkout = async (subType) => {
      setLoading(true);
      let annual = false
      if (subType === "Annual"){
        annual = true
      }
      const session = await getCheckoutURL(annual);
      if (!session) {
        setLoading(false);
      } 
      else {
        window.location = session.checkoutURL;
      }
    };

    // Redirect to Stripe for Guardian Checkout
    const guardianCheckout = async (subType) => {
      setLoading(true);
      if (subType === "Monthly"){
        await generateSoloGuardianCheckoutLink()
        .then(async (resolved) => {
          window.location = resolved.data.generateSoloGuardianCheckoutLink;
        })

        .catch((error) => {});
      }
      else if (subType === "Annual"){
        await generateAnnualSoloGuardianCheckoutLink()
        .then(async (resolved) => {
          window.location = resolved.data.generateSoloGuardianCheckoutLink;
        })

        .catch((error) => {});
      }
      else{
        console.log("Failed param")
      }
    };


  // PROFILE // 

    // Handles Signing Out
    const handleSignOut = () => {
      setUser(null);
      message.success("Signed out");
      localStorage.removeItem("token");
      localStorage.removeItem("role");
      location.reload();
    };

    // Renders User Avatar
    const getUserAvatar = () => {
      let interumProfilePic = {
        body: "body1",
        eyes: "eyes3",
        facialHair: "facialHair0",
        mouth: "mouth4",
        nose: "nose2",
        hair: "hair5",

        bodyColor: "bc1",
        facialHairColor: "fhc6",
        hairColor: "hc1",
        skinColor: "sc1",
        backgroundColor: "bgc1",
      };

      if (user.profilePic) {
        interumProfilePic = user.profilePic;
      }
      return (
        <Avatar
          size={40}
          bodyType={interumProfilePic.body}
          bodyColor={interumProfilePic.bodyColor}
          eyeType={interumProfilePic.eyes}
          facialHairType={interumProfilePic.facialHair}
          facialHairColor={interumProfilePic.facialHairColor}
          hairType={interumProfilePic.hair}
          hairColor={interumProfilePic.hairColor}
          mouthType={interumProfilePic.mouth}
          noseType={interumProfilePic.nose}
          skinColor={interumProfilePic.skinColor}
          backgroundColor={interumProfilePic.backgroundColor}
        />
      );
    };

  ////////////
  //  MAIN  //
  ////////////
  return (
    <Space>
      {/* {renderOrgFreeTrialTag()}
      {renderGuardianFreeTrialTag()} */}
      {renderFreeTrialTag()}

      <Dropdown
        overlay={
          <Menu
            items={[
              {
                key: "4",
                label: "Sign Out",
                onClick: () => handleSignOut(),
                icon: <LogoutOutlined />,
              },
            ]}
          />
        }
        placement="bottomRight"
        trigger={["click"]}
        arrow={{ pointAtCenter: false }}
      >
        <AvatarDetails role="User Details">
          {getUserAvatar()}
          <AvatarTextDetails>
            {user.firstName && user.lastName && (
              <content>
                <Title level={2}>
                  {capitalizeFirstLetter(user.firstName)}{" "}
                  {capitalizeFirstLetter(user.lastName)}
                </Title>
              </content>
            )}
          </AvatarTextDetails>
        </AvatarDetails>
      </Dropdown>
    </Space>
  );
}

export default TopMenuAvatar;
