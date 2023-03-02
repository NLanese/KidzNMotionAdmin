import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { LogoutOutlined } from "@ant-design/icons";
import { useRecoilState } from "recoil";
import { userState } from "@atoms";
import { capitalizeFirstLetter } from "@helpers/common";
import { ExclamationCircleOutlined, SyncOutlined } from "@ant-design/icons";
import NakedButton from "@common/NakedButton";
import { Typography, Dropdown, Menu, message, Tag, Space } from "antd";
import { getCheckoutURL } from "@helpers/billing";
import { useRouter } from "next/router";
import Avatar from "@forms/profileSettings/Avatar";
import { useMutation } from "@apollo/client";
import {
  GENERATE_SOLO_GUARDIAN_CHECKOUT_LINK,
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

  // User
  const [user, setUser] = useRecoilState(userState);

  // Loading
  const [loading, setLoading] = useState(false);

  // Link to Guardian Stripe
  const [generateSoloGuardianCheckoutLink, {}] = useMutation(
    GENERATE_SOLO_GUARDIAN_CHECKOUT_LINK
  );

  // Navigation to Stripe
  const router = useRouter();

  // Handles Signing Out
  const handleSignOut = () => {
    setUser(null);
    message.success("Signed out");
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    location.reload();
  };

  const checkSubStatus = async () => {
    await getBillingInformation().then((data) => {
      console.log("DATA FROM CHECK SUB STATUS ::: ", data)
      if (data) {
        if (data.subscription) {
          if (data.subscription.status !== "active") {
            window.location = data.sessionURL;
          }
        }
      }
    });
  };


  useEffect(() => {
    if (user.role === "GUARDIAN") {
      checkSubStatus();
    }

    if (user.subscriptionStatus === "expiredOwner") {
      if (!router.asPath.includes("billing")) {
        router.push("/account/billing");
        message.success("Please update your billing information to continue");
      }
    }
    if (user.subscriptionStatus === "expiredNotOwner") {
      alert(
        "Please contact your organization owner to update billing information"
      );
    }
  }, []);

  useEffect(() => {
    if (user.subscriptionStatus === "expiredOwner") {
      if (!router.asPath.includes("billing")) {
        router.push("/account/billing");
        message.success("Please update your billing information to continue");
      }
    }
    if (user.subscriptionStatus === "expiredNotOwner") {
      alert("Account Expired!");
    }
  }, [router]);
  const renderFreeTrialTag = () => {
    if (!user.ownedOrganization) return;

    if (!user.ownedOrganization.stripeSubscriptionID) {
      let daysLeft = parseInt(
        8 -
          (new Date().getTime() -
            new Date(user.ownedOrganization.createdAt).getTime()) /
            (1000 * 3600 * 24)
      );
      return (
        <content>
          <NakedButton onClick={() => checkout()}>
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

  const renderGuardianFreeTrialTag = () => {
    console.log(user);
    if (!user.role === "GUARDIAN") return;

    if (!user.solo) return;

    if (!user.soloStripeSubscriptionID) {
      let daysLeft = parseInt(
        8 -
          (new Date().getTime() - new Date(user.createdAt).getTime()) /
            (1000 * 3600 * 24)
      );
      return (
        <content>
          <NakedButton onClick={() => guardianCheckout()}>
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

  const checkout = async () => {
    setLoading(true);
    const session = await getCheckoutURL();
    if (!session) {
      setLoading(false);
    } else {
      window.location = session.checkoutURL;
    }
  };

  const guardianCheckout = async () => {
    setLoading(true);
    await generateSoloGuardianCheckoutLink()
      .then(async (resolved) => {
        window.location = resolved.data.generateSoloGuardianCheckoutLink;
      })

      .catch((error) => {});
  };

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

  // // console.log(user)
  return (
    <Space>
      {renderFreeTrialTag()}
      {renderGuardianFreeTrialTag()}

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
