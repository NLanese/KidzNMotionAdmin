import React, { useState, useEffect } from "react";
import { useRecoilState } from "recoil";
import { userState } from "@atoms";
import ContentCard from "@common/content/ContentCard";
import { GET_USER } from "@graphql/operations";
import client from "@utils/apolloClient";
import axios from "axios";
import styled from "styled-components";
import { CirclePicker } from "react-color";

import Avatar from "./Avatar";
import { Typography, Space, Col, Row, Button, Collapse, Spin } from "antd";
const { Panel } = Collapse;
const { Text } = Typography;

import {
  backgroundColors,
  bodies,
  bodyColors,
  eyeses,
  facialHairs,
  facialHairColors,
  hairs,
  hairColors,
  mouths,
  noses,
  skinColors,
} from "@constants/avatar/colors";

const CenterAvatar = styled.div`
  margin: auto;
  text-align: center;
  & div {
    margin: auto;
  }
`;

function AvatarSettingsForm({}) {
  const [user, setUser] = useRecoilState(userState);
  const [formLoading, setFormLoading] = useState(false);
  const [interumProfilePic, setInterumProfilePic] = useState({
    body: "body1",
    bodyColor: "bc1",
    eyes: "eyes3",
    facialHair: "facialHair0",
    facialHairColor: "fhc6",
    hair: "hair5",
    hairColor: "hc1",
    mouth: "mouth4",
    nose: "nose2",
    skinColor: "sc1",
    backgroundColor: "bgc1",
  });

  useEffect(() => {
    if (user.profilePic) {
      setInterumProfilePic(user.profilePic);
    }
  }, [user]);

  const getUserAvatar = () => {
    return (
      <Avatar
        size={250}
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

  // Reset User Function
  const getUser = async () => {
    await client
      .query({
        query: GET_USER,
        fetchPolicy: "network-only",
      })
      .then(async (resolved) => {
        // console.clear();
        setUser(resolved.data.getUser);
      })
      .catch((error) => {
        message.error("Sorry, there was an error getting this information");
      });
  };

  const setAvatarItem = async (key, value) => {
    let newProfilePic = Object.assign({}, interumProfilePic);
    newProfilePic[key] = value;
    setInterumProfilePic(newProfilePic);

    // Rest function to update a users stripe subscription id
    await axios({
      method: "post",
      url: "/api/edit-web-app-profile-settings",
      data: {
        token: localStorage.getItem("token"),
        newProfilePic: newProfilePic,
      },
    })
      .then(({ data }) => {
        getUser();
      })
      .catch(({ response }) => {
        return null;
      });
  };

  // Avatar Peices

  const reverseObject = (obj) => {
    var retobj = {};
    for (var key in obj) {
      retobj[obj[key]] = key;
    }
    return retobj;
  };

  const renderAvatarSelectionItem = (svg, key, value, actualValue) => {
    return (
      <Col xs={8} md={4} style={{ marginBottom: "10px" }}>
        <div style={{ textAlign: "center", margin: "auto" }}>
          <svg width={100} height={100} viewBox="0 0 64 64">
            {svg}
          </svg>
        </div>
        {value !== actualValue && (
          <Button
            block
            onClick={() => setAvatarItem(key, value)}
            size="small"
            type={"primary"}
            disabled={value === actualValue}
          >
            {value === actualValue ? "Selected" : "Select"}
          </Button>
        )}
      </Col>
    );
  };
  return (
    <Spin spinning={formLoading}>
      <Row gutter={16}>
        <Col xs={24} md={5}>
          <ContentCard modifiers={["naked", "noSidePadding"]}>
            <Space direction="vertical" size="small">
              <Text strong>Avatar Settings</Text>
              <Text type="secondary">
                Edit your avatar here to customize its appearance throughout the
                rest of the app.
              </Text>
            </Space>
          </ContentCard>
        </Col>
        <Col xs={24} md={{ span: 18, offset: 1 }}>
          <ContentCard>
            <CenterAvatar>{getUserAvatar()}</CenterAvatar>
            <br />
            <Collapse accordion defaultActiveKey={"1"}>
              <Panel header="Body Settings" key="1">
                <h3>Pick The Style</h3>
                <Row gutter={16}>
                  {renderAvatarSelectionItem(
                    <path
                      fill={bodyColors[interumProfilePic.bodyColor]}
                      d="M27 49v3a5 5 0 0010 0v-3l6.647 2.045A9 9 0 0150 59.647V64H14v-4.353a9 9 0 016.353-8.602z"
                    />,
                    "body",
                    "body1",
                    interumProfilePic.body
                  )}
                  {renderAvatarSelectionItem(
                    <path
                      fill={bodyColors[interumProfilePic.bodyColor]}
                      d="M27 51v.47a5 5 0 0010 0V51c7.063 1.523 12.93 6.735 16 13H11c3.07-6.265 8.937-11.477 16-13z"
                    />,
                    "body",
                    "body2",
                    interumProfilePic.body
                  )}
                  {renderAvatarSelectionItem(
                    <path
                      fill={bodyColors[interumProfilePic.bodyColor]}
                      d="M27 49v3a5 5 0 0010 0v-3l6.647 2.045A9 9 0 0150 59.647V64H14v-4.353a9 9 0 016.353-8.602z"
                    />,
                    "body",
                    "body3",
                    interumProfilePic.body
                  )}
                  {renderAvatarSelectionItem(
                    <>
                      <path
                        fill={bodyColors[interumProfilePic.bodyColor]}
                        d="M27 49v3a5 5 0 0010 0v-3l6.647 2.045A9 9 0 0150 59.647V64H14v-4.353a9 9 0 016.353-8.602z"
                      />
                      <path
                        d="M42 50.538l1.647.507A8.99 8.99 0 0146 52.163V64h-4zM38 64h-4v-5.29a7.017 7.017 0 004-3.102zm-8 0h-4v-8.392a7.017 7.017 0 004 3.102zm-8 0h-4V52.163a8.99 8.99 0 012.353-1.118L22 50.538z"
                        fill="#000"
                        opacity={0.2}
                      />
                      <path
                        fill="#fff"
                        d="M47.068 53a9.013 9.013 0 012.535 4H36.899a6.982 6.982 0 002.03-4zM50 61v3H14v-3zm-35.603-4a9.013 9.013 0 012.535-4h8.139a6.982 6.982 0 002.03 4z"
                        opacity={0.18}
                      />
                    </>,
                    "body",
                    "body4",
                    interumProfilePic.body
                  )}
                </Row>
                <br />
                <h3>Pick The Color</h3>
                <CirclePicker
                  width={"100%"}
                  circleSize={50}
                  colors={[
                    "#456dff",
                    "#5a45ff",
                    "#6dbb57",
                    "#f55c80",
                    "#7554ca",
                    "#e24552",
                    "#54d8c7",
                    "#f3b63b",
                  ]}
                  onChangeComplete={(color) =>
                    setAvatarItem(
                      "bodyColor",
                      reverseObject(bodyColors)[color.hex]
                    )
                  }
                  color={bodyColors[interumProfilePic.bodyColor]}
                />
              </Panel>
              <Panel header="Eye Settings" key="2">
                <h3>Pick The Style</h3>
                <Row gutter={16}>
                  {renderAvatarSelectionItem(
                    <>
                      <path
                        fill="#1b0640"
                        d="M26 30a1.5 1.5 0 110-3 1.5 1.5 0 010 3zm12 0a1.5 1.5 0 110-3 1.5 1.5 0 010 3z"
                      />
                      <path
                        fill="#fff"
                        d="M23 26h6v6h-6zm12 0h6v6h-6z"
                        opacity={0.303}
                      />
                      <path
                        fill="#1b0640"
                        d="M31 25.053h2c1.5 0 2.5-1.053 5-1.053 1.667 0 3.333.35 5 1.053l1 .526v1.579l-1 .526v3.158C43 32.586 41.657 34 40 34h-4c-1.657 0-3-1.414-3-3.158v-3.684h-2v3.684C31 32.586 29.657 34 28 34h-4c-1.657 0-3-1.414-3-3.158v-3.158l-1-.526v-1.58l1-.525C22.667 24.35 24.333 24 26 24c2.5 0 3.5 1.053 5 1.053zm-2.757 1.47c-.844-.296-1.425-.418-2.243-.418-.995 0-1.993.15-3 .45v4.287c0 .581.448 1.053 1 1.053h4c.552 0 1-.472 1-1.053v-4.051c-.209-.07-.447-.155-.757-.267zm7.514 0c-.31.113-.548.198-.757.268v4.051c0 .581.448 1.053 1 1.053h4c.552 0 1-.472 1-1.053v-4.287c-1.007-.3-2.005-.45-3-.45-.818 0-1.399.122-2.243.419z"
                      />
                    </>,
                    "eyes",
                    "eyes1",
                    interumProfilePic.eyes
                  )}
                  {renderAvatarSelectionItem(
                    <path
                      fill="#000"
                      d="M24.712 29.737a.75.75 0 11-1.424-.474c.434-1.301 1.383-2.013 2.712-2.013s2.278.712 2.712 2.013a.75.75 0 11-1.424.474c-.233-.699-.617-.987-1.288-.987s-1.055.288-1.288.987zm12 0a.75.75 0 01-1.424-.474c.434-1.301 1.383-2.013 2.712-2.013s2.278.712 2.712 2.013a.75.75 0 01-1.424.474c-.233-.699-.617-.987-1.288-.987s-1.055.288-1.288.987z"
                    />,
                    "eyes",
                    "eyes2",
                    interumProfilePic.eyes
                  )}

                  {renderAvatarSelectionItem(
                    <path
                      fill="#000"
                      d="M25.5 30a1.5 1.5 0 110-3 1.5 1.5 0 010 3zm13 0a1.5 1.5 0 110-3 1.5 1.5 0 010 3z"
                    />,
                    "eyes",
                    "eyes3",
                    interumProfilePic.eyes
                  )}
                  {renderAvatarSelectionItem(
                    <path
                      d="M36.004 29.368a1 1 0 11.992-1.736c.438.25.852.368 1.254.368s.816-.118 1.254-.368a1 1 0 11.992 1.736c-.73.417-1.482.632-2.246.632s-1.517-.215-2.246-.632zm-12 0a1 1 0 01.992-1.736c.438.25.852.368 1.254.368s.816-.118 1.254-.368a1 1 0 01.992 1.736c-.73.417-1.482.632-2.246.632s-1.517-.215-2.246-.632z"
                      fill="#000"
                    />,
                    "eyes",
                    "eyes4",
                    interumProfilePic.eyes
                  )}

                  {renderAvatarSelectionItem(
                    <>
                      <path
                        d="M26 30a1.5 1.5 0 110-3 1.5 1.5 0 010 3zm12 0a1.5 1.5 0 110-3 1.5 1.5 0 010 3z"
                        fill="#000"
                      />
                      <path
                        d="M23 26h6v6h-6zm12 0h6v6h-6z"
                        opacity={0.801}
                        fill="#000"
                      />
                      <path
                        d="M33 25.053c1.5 0 2.5-1.053 5-1.053 1.667 0 3.333.35 5 1.053l1 .526v1.579l-1 .526v3.158C43 32.586 41.657 34 40 34h-4c-1.657 0-3-1.414-3-3.158v-3.684h-2v3.684C31 32.586 29.657 34 28 34h-4c-1.657 0-3-1.414-3-3.158v-3.158l-1-.526v-1.58l1-.525C22.667 24.35 24.333 24 26 24c2.5 0 3.5 1.053 5 1.053zm-4.757 1.47c-.844-.296-1.425-.418-2.243-.418-.995 0-1.993.15-3 .45v4.287c0 .581.448 1.053 1 1.053h4c.552 0 1-.472 1-1.053v-4.051c-.209-.07-.447-.155-.757-.267zm7.514 0c-.31.113-.548.198-.757.268v4.051c0 .581.448 1.053 1 1.053h4c.552 0 1-.472 1-1.053v-4.287c-1.007-.3-2.005-.45-3-.45-.818 0-1.399.122-2.243.419z"
                        fill="#000"
                      />
                    </>,
                    "eyes",
                    "eyes5",
                    interumProfilePic.eyes
                  )}

                  {renderAvatarSelectionItem(
                    <path
                      d="M25.5 30a1.5 1.5 0 110-3 1.5 1.5 0 010 3zm14.907-2.744a.75.75 0 01.186 1.488l-4 .5a.75.75 0 01-.186-1.488z"
                      fill="#000"
                    />,
                    "eyes",
                    "eyes6",
                    interumProfilePic.eyes
                  )}
                </Row>
                <br />
              </Panel>
              <Panel header="Facial Hair Settings" key="3">
                <h3>Pick The Style</h3>
                <Row gutter={16}>
                  {renderAvatarSelectionItem(
                    null,
                    "facialHair",
                    "facialHair0",
                    interumProfilePic.facialHair
                  )}
                  {renderAvatarSelectionItem(
                    <path
                      d="M28.033 36.527C29.444 36.176 30.766 36 32 36s2.556.176 3.967.527A4 4 0 0 1 39 40.408v4.475a3 3 0 0 1-1.513 2.606C35.72 48.496 33.944 49 32.157 49c-1.807 0-3.666-.514-5.578-1.542A3 3 0 0 1 25 44.816v-4.408a4 4 0 0 1 3.033-3.881zm.019 1.492a2 2 0 0 0-1.462 1.926v2.485a3 3 0 0 0 1.846 2.769c1.282.534 2.504.801 3.668.801 1.15 0 2.338-.26 3.567-.781a3 3 0 0 0 1.829-2.762v-2.5a2 2 0 0 0-1.47-1.93 15.16 15.16 0 0 0-4.03-.565c-1.304 0-2.62.185-3.948.557z"
                      fill={facialHairColors[interumProfilePic.facialHairColor]}
                    />,
                    "facialHair",
                    "facialHair1",
                    interumProfilePic.facialHair
                  )}
                  {renderAvatarSelectionItem(
                    <path
                      d="M46 29v4c0 7.732-6.268 14-14 14s-14-6.268-14-14v-4c0-.1.001-.2.003-.298C20.048 31.642 22.535 35.669 26 37c2-1.003 4-1.504 6-1.504s4 .501 6 1.504c3.465-1.33 5.952-5.359 7.997-8.298.002.099.003.198.003.298z"
                      fill={facialHairColors[interumProfilePic.facialHairColor]}
                      opacity={0.2}
                    />,
                    "facialHair",
                    "facialHair2",
                    interumProfilePic.facialHair
                  )}
                  {renderAvatarSelectionItem(
                    <path
                      d="M30 43.5h4l-.684 2.051a1.387 1.387 0 0 1-2.632 0z"
                      fill={facialHairColors[interumProfilePic.facialHairColor]}
                    />,
                    "facialHair",
                    "facialHair3",
                    interumProfilePic.facialHair
                  )}
                  {renderAvatarSelectionItem(
                    <path
                      d="M29 35h6a5 5 0 0 1 5 5H24a5 5 0 0 1 5-5z"
                      fill={facialHairColors[interumProfilePic.facialHairColor]}
                    />,
                    "facialHair",
                    "facialHair4",
                    interumProfilePic.facialHair
                  )}
                  {renderAvatarSelectionItem(
                    <path
                      d="M32.016 38.05a2.718 2.718 0 01-3.182 1.587l-5.082-1.3a1 1 0 01-.075-1.916l5.235-1.786a2.504 2.504 0 013.104 1.37 2.504 2.504 0 013.105-1.37l5.235 1.786a1 1 0 01-.075 1.915l-5.082 1.3a2.717 2.717 0 01-3.183-1.587z"
                      fill={facialHairColors[interumProfilePic.facialHairColor]}
                    />,
                    "facialHair",
                    "facialHair5",
                    interumProfilePic.facialHair
                  )}
                </Row>
                <br />
                <h3>Pick The Color</h3>
                <CirclePicker
                  width={"100%"}
                  circleSize={50}
                  colors={[
                    "#362d46",
                    "#665e97",
                    "#5ac4d4",
                    "#dee2f5",
                    "#6b4445",
                    "#f29c64",
                    "#e16381",
                    "#e15b65",
                  ]}
                  onChangeComplete={(color) =>
                    setAvatarItem(
                      "facialHairColor",
                      reverseObject(facialHairColors)[color.hex]
                    )
                  }
                  color={facialHairColors[interumProfilePic.facialHairColor]}
                />
              </Panel>
              <Panel header="Hair Settings" key="4">
                <h3>Pick The Style</h3>
                <Row gutter={16}>
                  {renderAvatarSelectionItem(
                    <path
                      d="M22.386 23.438a.75.75 0 1 1-1.342-.67 16.551 16.551 0 0 1 2.202-3.366 11.86 11.86 0 0 1 3-2.522.75.75 0 0 1 .765 1.29 10.36 10.36 0 0 0-2.623 2.205 15.055 15.055 0 0 0-2.002 3.063zM28.75 17a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5z"
                      opacity={0.198}
                      fill="#fff"
                    />,
                    "hair",
                    "hair1",
                    interumProfilePic.hair
                  )}

                  {renderAvatarSelectionItem(
                    <>
                      <path
                        d="M41.668 19h1.667a3 3 0 0 1 2.984 3.314l-.651 6.186a1.364 1.364 0 0 1-1.301-.954zm-20 0l-2.7 8.546a1.362 1.362 0 0 1-1.3.954l-.652-6.186A3 3 0 0 1 20 19z"
                        fill={hairColors[interumProfilePic.hairColor]}
                      />
                      <path
                        d="M22.386 23.438a.75.75 0 0 1-1.342-.67 16.551 16.551 0 0 1 2.202-3.366 11.86 11.86 0 0 1 3-2.522.75.75 0 1 1 .765 1.29 10.36 10.36 0 0 0-2.623 2.205 15.055 15.055 0 0 0-2.002 3.063zM28.75 17a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5z"
                        fill="#fff"
                        opacity={0.198}
                      />
                    </>,
                    "hair",
                    "hair2",
                    interumProfilePic.hair
                  )}

                  {renderAvatarSelectionItem(
                    <path
                      d="M46 28a16 16 0 0 1-.021-.023 2 2 0 0 1-2.104-2.855 2 2 0 0 1-2.729-2.095 2 2 0 0 1-3.303.553l-.012.005v.042a2 2 0 0 1-3.752.965 2 2 0 0 1-3.922.333 2 2 0 0 1-3.865-.598 23.239 23.239 0 0 1-.131-.022 2 2 0 0 1-3.676-.981 20.21 20.21 0 0 1-.83-.326 2 2 0 0 1-2.725 2.123 2 2 0 0 1-.93 2.68v.226A4.5 4.5 0 0 0 18.58 37 14.036 14.036 0 0 0 27 46.081v3.062a3.483 3.483 0 0 1-.652-.68c-.484-.137-.961-.29-1.43-.46a3.46 3.46 0 0 1-2.719-.138 3.461 3.461 0 0 1-1.816-2.166 20.882 20.882 0 0 1-.987-.707 3.462 3.462 0 0 1-2.742-.912 3.464 3.464 0 0 1-1.087-2.877c-.17-.217-.334-.438-.495-.661a3.465 3.465 0 0 1-2.604-1.712 3.467 3.467 0 0 1-.062-3.358c-.046-.13-.092-.26-.136-.39a3.47 3.47 0 0 1-1.077-5.965v-.009a3.47 3.47 0 0 1 .471-6.196 3.47 3.47 0 0 1 2.272-5.788 3.47 3.47 0 0 1 3.876-4.861A3.47 3.47 0 0 1 22.95 8.76a3.47 3.47 0 0 1 5.941-1.833 3.47 3.47 0 0 1 6.218 0A3.47 3.47 0 0 1 41.05 8.76a3.47 3.47 0 0 1 5.138 3.503 3.47 3.47 0 0 1 3.876 4.86 3.47 3.47 0 0 1 2.272 5.789 3.47 3.47 0 0 1 .471 6.196v.01a3.47 3.47 0 0 1-1.077 5.965c-.044.13-.09.26-.136.389a3.467 3.467 0 0 1-.062 3.358 3.465 3.465 0 0 1-2.604 1.712c-.16.223-.326.444-.495.661a3.464 3.464 0 0 1-1.087 2.877 3.462 3.462 0 0 1-2.742.912c-.322.245-.651.48-.987.707a3.461 3.461 0 0 1-1.816 2.166 3.46 3.46 0 0 1-2.719.138c-.469.17-.946.323-1.43.46a3.483 3.483 0 0 1-.652.68v-3.062a14.036 14.036 0 0 0 8.42-9.082l.08.001a4.5 4.5 0 0 0 .5-8.973z"
                      fill={hairColors[interumProfilePic.hairColor]}
                    />,
                    "hair",
                    "hair3",
                    interumProfilePic.hair
                  )}

                  {renderAvatarSelectionItem(
                    <path
                      d="M46 28c-2.177-2.419-3.652-5.54-4.425-9.363-2.252 3.614-5.277 6.235-9.075 7.863-4.667 2-9.5 2.333-14.5 1v.527a4.474 4.474 0 0 0-2 .73V27.5C16 18.387 23.163 11 32 11s16 7.387 16 16.5v1.258a4.474 4.474 0 0 0-2-.73zm-9 21.313v-3.232a14.036 14.036 0 0 0 8.42-9.082l.08.001a4.48 4.48 0 0 0 2.5-.758V47c-3.113 1.211-6.78 1.982-11 2.313zm-10 0c-4.22-.331-7.887-1.102-11-2.313V36.242a4.48 4.48 0 0 0 2.58.757A14.036 14.036 0 0 0 27 46.081z"
                      fill={hairColors[interumProfilePic.hairColor]}
                    />,
                    "hair",
                    "hair4",
                    interumProfilePic.hair
                  )}

                  {renderAvatarSelectionItem(
                    <path
                      d="M46 28c-1.412-1.57-2.53-3.434-3.35-5.595-3.192 1.086-6.742 1.629-10.65 1.629-4.848 0-9.145-.836-12.89-2.506A13.955 13.955 0 0 0 18 27v1.027a4.474 4.474 0 0 0-2 .73v-1.375C16 18.334 23.163 11 32 11s16 7.334 16 16.382v1.376a4.474 4.474 0 0 0-2-.73zm-9 20.06v-1.98A14.036 14.036 0 0 0 45.42 37h.08a4.48 4.48 0 0 0 2.5-.758v6.376c0 .477-.02.949-.059 1.415-3.647 2.044-7.294 3.386-10.941 4.028zm-10 0c-3.647-.64-7.294-1.983-10.941-4.027A16.99 16.99 0 0 1 16 42.618v-6.376a4.48 4.48 0 0 0 2.58.757A14.036 14.036 0 0 0 27 46.081z"
                      fill={hairColors[interumProfilePic.hairColor]}
                    />,
                    "hair",
                    "hair5",
                    interumProfilePic.hair
                  )}

                  {renderAvatarSelectionItem(
                    <>
                      <path
                        d="M44.544 20.777C42.254 16.167 37.497 13 32 13s-10.254 3.168-12.544 7.777a2 2 0 0 1 .551-2.376v-.005a2 2 0 0 1 .271-3.571 2 2 0 0 1 1.31-3.337 2 2 0 0 1 2.234-2.802 2 2 0 0 1 2.961-2.019 2 2 0 0 1 3.425-1.056 2 2 0 0 1 3.584 0 2 2 0 0 1 3.425 1.056 2 2 0 0 1 2.961 2.02 2 2 0 0 1 2.235 2.801 2 2 0 0 1 1.309 3.337 2 2 0 0 1 .272 3.571v.005a2 2 0 0 1 .55 2.376z"
                        fill={hairColors[interumProfilePic.hairColor]}
                      />
                      <path
                        d="M45.934 25.632C43.828 20.564 38.83 17 33 17h-2c-5.83 0-10.828 3.564-12.934 8.632C18.753 18.542 24.73 13 32 13s13.247 5.542 13.934 12.632z"
                        fill="#5ac4d4"
                      />
                    </>,
                    "hair",
                    "hair6",
                    interumProfilePic.hair
                  )}

                  {renderAvatarSelectionItem(
                    <path
                      d="M46 27v3c-1.333-1.667-2.667-4.667-4-9-2.657 1.333-5.99 2-10 2s-7.343-.667-10-2c-1.333 3.667-2.667 6.333-4 8v-2c0-7.732 6.268-14 14-14s14 6.268 14 14z"
                      fill={hairColors[interumProfilePic.hairColor]}
                    />,
                    "hair",
                    "hair7",
                    interumProfilePic.hair
                  )}

                  {renderAvatarSelectionItem(
                    <path
                      d="M33.792 9a2 2 0 0 1 3.816 0h.558a2 2 0 0 1 3.83.668c.075.03.15.063.224.095a2 2 0 0 1 3.13 2.298l.152.179a2 2 0 0 1 1.775 3.41c.042.156.08.314.114.473a2 2 0 0 1 .018 3.748l-.047.324a2 2 0 0 1-.022 3.62 1.994 1.994 0 0 1 .159.852 1.8 1.8 0 0 1-1.22 2.924L46 29.5c-.44-.659-.842-1.48-1.209-2.465a1.797 1.797 0 0 1-.437-.796 1.998 1.998 0 0 1-.563-2.679 38.655 38.655 0 0 1-.022-.098 2 2 0 0 1-.956-2.937 1.994 1.994 0 0 1-2.44-.323 2 2 0 0 1-3.724.057l-.312.032a2 2 0 0 1-3.573.203l-.23.003a2 2 0 0 1-3.521-.099 36.13 36.13 0 0 1-.41-.031 2 2 0 0 1-3.676-.165 1.997 1.997 0 0 1-3.04-.22 19.96 19.96 0 0 1-.023.155 2 2 0 0 1-.701 3.35 2 2 0 0 1-1.397 3.095A24.897 24.897 0 0 1 18 29.5l-.188-1.923a1.8 1.8 0 0 1-.338-3.465l-.012-.126a2 2 0 0 1-.38-3.889l-.013-.144a2 2 0 0 1 .067-3.92 8.93 8.93 0 0 1 .041-.177 2 2 0 0 1 1.46-3.627 2 2 0 0 1 3.066-2.326 2 2 0 0 1 3.835-.894 9 9 0 0 1 .052-.003A2 2 0 0 1 29.408 9h.184a2 2 0 0 1 3.816 0z"
                      fill={hairColors[interumProfilePic.hairColor]}
                    />,
                    "hair",
                    "hair8",
                    interumProfilePic.hair
                  )}

                  {renderAvatarSelectionItem(
                    <>
                      <path
                        d="M46 28c-1.807-2.008-3.13-4.5-3.97-7.474-1.87 2.283-4.546 3.607-8.03 3.974-5.832.614-10.817-.327-14.953-2.822A13.959 13.959 0 0 0 18 27v1.027a4.474 4.474 0 0 0-2 .73V27.5C16 18.387 23.163 11 32 11s16 7.387 16 16.5v1.258a4.474 4.474 0 0 0-2-.73zm2 8.242v6.604c0 7.312-4.612 13.513-11 15.679V46.08a14.036 14.036 0 0 0 8.42-9.082l.08.001a4.48 4.48 0 0 0 2.5-.758zM27.13 58.568C20.675 56.443 16 50.208 16 42.846v-6.604a4.48 4.48 0 0 0 2.58.757A14.036 14.036 0 0 0 27 46.081v5.464c.051 2.356.095 4.697.13 7.023z"
                        fill={hairColors[interumProfilePic.hairColor]}
                      />
                      <path
                        d="M46 28c-1.807-2.008-3.13-4.5-3.97-7.474-1.87 2.283-4.546 3.607-8.03 3.974-5.832.614-10.817-.327-14.953-2.822A13.959 13.959 0 0 0 18 27v1.027a4.474 4.474 0 0 0-2 .73V27.5C16 18.387 23.163 11 32 11s16 7.387 16 16.5v1.258a4.474 4.474 0 0 0-2-.73z"
                        fill="#fff"
                        opacity={0.258}
                      />
                    </>,
                    "hair",
                    "hair9",
                    interumProfilePic.hair
                  )}

                  {renderAvatarSelectionItem(
                    <>
                      <path
                        d="M18.996 21.804C21.059 16.644 26.104 13 32 13s10.94 3.645 13.004 8.804c.079.063.157.127.235.192a1 1 0 0 1 .338.54l.627 2.64a.5.5 0 0 1-.774.523C40.989 22.566 36.512 21 32 21c-4.513 0-8.985 1.567-13.417 4.702a.5.5 0 0 1-.775-.522l.616-2.64a1 1 0 0 1 .338-.546l.234-.19z"
                        fill={hairColors[interumProfilePic.hairColor]}
                      />
                      <path
                        d="M32 17c4.779 0 9.192 1.665 13.24 4.996a1 1 0 0 1 .337.54l.627 2.64a.5.5 0 0 1-.774.523C40.989 22.566 36.512 21 32 21c-4.513 0-8.985 1.567-13.417 4.702a.5.5 0 0 1-.775-.522l.616-2.64a1 1 0 0 1 .338-.546C22.81 18.664 27.222 17 32 17z"
                        fill={"black"}
                        opacity={0.259}
                      />
                    </>,
                    "hair",
                    "hair10",
                    interumProfilePic.hair
                  )}

                  {renderAvatarSelectionItem(
                    <>
                      <g transform="translate(18 8)">
                        <cicle cx={14} cy={6} r={4} 
                        // backgroundColor="#5a45ff" 
                        />
                        <g fill={hairColors[interumProfilePic.hairColor]}>
                          <path
                            d="M17.67 14.5l.054-7.663c2.136-.013 3.207-.013 3.214 0C25.157 9.25 28 13.792 28 19v3c-1.333-1.667-2.667-4.667-4-9-.496.25-2.606.75-6.33 1.5zm-7.34 0C6.606 13.75 4.496 13.25 4 13c-1.333 4.333-2.667 7.333-4 9v-3c0-5.208 2.843-9.751 7.062-12.163h3.27z"
                            opacity={0.303}
                          />
                          <path d="M10.014 4.572C10.188 2.012 11.906 0 14 0c2.085 0 3.798 1.994 3.983 4.54.735.393 1.46.897 2.176 1.512a3 3 0 0 1 1.04 2.14l.098 2.17a4 4 0 0 1-3.13 4.086C16.51 14.816 15.12 15 14 15c-1.132 0-2.564-.192-4.294-.576a3.872 3.872 0 0 1-3.016-4.145l.208-2.2a3 3 0 0 1 .964-1.932 11.545 11.545 0 0 1 2.152-1.575zm.317-.169C11.516 3.801 12.738 3.5 14 3.5c1.244 0 2.462.29 3.655.872a4 4 0 0 0-7.324.031z" />
                          <path
                            d="M10.015 4.56C10.193 2.005 11.91 0 14 0c2.066 0 3.765 1.957 3.978 4.469a10.96 10.96 0 0 0-.354-.165 4 4 0 0 0-7.286.085 9.194 9.194 0 0 0-.323.171z"
                            fill="#000"
                            opacity={0.318}
                          />
                        </g>
                      </g>
                    </>,
                    "hair",
                    "hair11",
                    interumProfilePic.hair
                  )}

                  {renderAvatarSelectionItem(
                    <>
                      <path
                        d="M28 15v2c-1.323-3.514-3.06-5.389-3.759-6-1.048-.917-2.478-1.795-3.35-3.731-.57-1.268-.474-2.94-.393-4.673C24.958 4.937 28 9.613 28 15zM0 15v2c1.323-3.514 3.06-5.389 3.759-6 1.048-.917 2.478-1.795 3.35-3.731.57-1.268.474-2.94.393-4.673C3.042 4.937 0 9.613 0 15z"
                        fill="url(#a)"
                        transform="translate(18 12)"
                      />
                      <path
                        d="M27.977 13.226L40 12a6.838 6.838 0 0 1-6.487 9h-6.216a3 3 0 0 1-3-3v-.7a4.096 4.096 0 0 1 3.68-4.074z"
                        fill={hairColors[interumProfilePic.hairColor]}
                      />
                    </>,
                    "hair",
                    "hair12",
                    interumProfilePic.hair
                  )}

                  {renderAvatarSelectionItem(
                    <>
                      <path
                        d="M32 19.002c3.881 0 7.548-.376 11 4.218l-1.9 6.493c-.611 1.227-1.636 1.558-2.463.795-2.09-1.929-4.302-2.893-6.637-2.893s-4.547.964-6.637 2.893c-.827.763-1.852.432-2.462-.795L21 23.22c3.452-4.594 7.119-4.218 11-4.218z"
                        fill="#000"
                        fillOpacity={0.203}
                      />
                      <path
                        d="M29.292 13.206a3 3 0 0 1 5.416 0c6.1.957 10.809 5.236 11.292 12.711a27.685 27.685 0 0 0-3.96-1.302l-.94.602a2 2 0 0 1-2.463.462C36.547 24.559 34.335 24 32 24s-4.547.56-6.637 1.679a2 2 0 0 1-2.462-.462l-.94-.602A27.685 27.685 0 0 0 18 25.917c.483-7.475 5.192-11.754 11.292-12.71z"
                        fill={hairColors[interumProfilePic.hairColor]}
                      />
                      <path
                        d="M41.448 24.994l-.349.223a2 2 0 0 1-2.462.462C36.547 24.559 34.335 24 32 24s-4.547.56-6.637 1.679a2 2 0 0 1-2.462-.462l-.349-.223c.866.068 2.183-.479 2.811-.815 2.09-1.12 4.302-1.679 6.637-1.679s4.547.56 6.637 1.679c.628.336 1.945.883 2.811.815z"
                        fill="#fff"
                        fillOpacity={0.203}
                      />
                      <path
                        d="M21.96 24.615A27.685 27.685 0 0 0 18 25.917C18.553 17.367 24.632 13 32 13s13.447 4.368 14 12.917a27.685 27.685 0 0 0-3.96-1.302L43 24c-3.452-2.667-7.119-4-11-4s-7.548 1.333-11 4z"
                        fill="#000"
                        fillOpacity={0.28}
                      />
                    </>,
                    "hair",
                    "hair13",
                    interumProfilePic.hair
                  )}

                  {renderAvatarSelectionItem(
                    <>
                      <path
                        d="M32.034 10c2.746 0 4.217 1.437 4.842 2.052.563.54.968 1.313 1.112 2.14l.663 4.17c.354 1.942-.698 3.665-2.526 4.086C34.5 22.816 33.12 23 32 23c-1.132 0-2.553-.192-4.244-.576-1.832-.423-2.834-2.2-2.375-4.145l.786-4.2a3.972 3.972 0 0 1 1.035-1.932c.624-.642 2.086-2.147 4.832-2.147z"
                        fill={hairColors[interumProfilePic.hairColor]}
                      />
                      <path
                        d="M36.876 12.052c.563.54.968 1.313 1.112 2.14l.663 4.17c.354 1.942-.698 3.665-2.526 4.086C34.5 22.816 33.12 23 32 23c-1.132 0-2.553-.192-4.244-.576-1.832-.423-2.834-2.2-2.375-4.145l.786-4.2a3.972 3.972 0 0 1 1.035-1.932c.26-.268.666-.686 1.25-1.082-.316.488-1.452.987-1.452 2.435V17c-.322 1.645.73 3.154 2.017 3.513 1.187.325 2.186.487 2.981.487.787 0 1.757-.156 2.898-.467 1.285-.356 2.352-1.89 2.104-3.533v-3c0-1.5-1.105-2.544-1.5-3a1.47 1.47 0 0 0-.136-.14c.726.42 1.215.9 1.512 1.192z"
                        fill="#fff"
                        opacity={0.257}
                      />
                    </>,
                    "hair",
                    "hair14",
                    interumProfilePic.hair
                  )}

                  {renderAvatarSelectionItem(
                    <>
                      <path
                        d="M17.79 27.558l-.712-6.59A9 9 0 0 1 26.025 11H43a9.237 9.237 0 0 1-.74 3.63 7.926 7.926 0 0 1 4.6 8.351L46 29l-.002-.001v4.222a14.005 14.005 0 0 1-.476 3.42l-2.523.539a1 1 0 0 1-1.188-1.182l1.899-9.114c-1.574-2.093-2.678-5.242-3.314-9.445a9.238 9.238 0 0 1-5.692 2.774c-1.823.191-3.391.287-4.704.287-3 0-5.667-.5-8-1.5 0 2.59-.666 5.098-1.997 7.523l1.974 9.475a1 1 0 0 1-1.188 1.182l-2.522-.538a14.005 14.005 0 0 1-.477-3.421z"
                        fill={hairColors[interumProfilePic.hairColor]}
                      />
                      <path
                        d="M20.003 26.523l1.974 9.475a1 1 0 0 1-1.188 1.182l-2.522-.538a14.005 14.005 0 0 1-.477-3.421v-5.664l-.712-6.59A9 9 0 0 1 26.025 11H43a9.237 9.237 0 0 1-2.604 6.439 9.238 9.238 0 0 1-5.692 2.774c-1.823.191-3.391.287-4.704.287-3 0-5.667-.5-8-1.5 0 2.59-.666 5.098-1.997 7.523zm25.995 2.476v4.222a14.005 14.005 0 0 1-.476 3.42l-2.523.539a1 1 0 0 1-1.188-1.182l1.899-9.114c-1.149-1.528-2.047-3.618-2.696-6.27a9.288 9.288 0 0 0 3.45-4.506 7.91 7.91 0 0 1 2.396 6.873L46 29z"
                        fill="#fff"
                        opacity={0.259}
                      />
                    </>,
                    "hair",
                    "hair15",
                    interumProfilePic.hair
                  )}

                  {renderAvatarSelectionItem(
                    <>
                      <path
                        d="M37 13.92c5.263 2.012 9 7.11 9 13.08v1c-.887-2.07-1.942-3.711-3.165-4.926-1.834-1.823-3.335-.694-4.526-2.522-.795-1.219-1.231-3.43-1.309-6.633z"
                        fill={hairColors[interumProfilePic.hairColor]}
                        opacity={0.298}
                      />
                      <path
                        d="M14.567 47.184a5.642 5.642 0 0 1-2.93.816H10.5c2.773-2.536 4.562-5.795 5.367-9.777.047-.632.091-1.292.133-1.98a4.48 4.48 0 0 0 2.58.756A14.036 14.036 0 0 0 27 46.081V49a9.403 9.403 0 0 1-9.439 9.531L9.5 58.5c2.667-5.484 4.333-9.189 5-11.113.023-.066.045-.133.067-.203zM32.653 25.09C28.466 28.4 16 27.256 16 33.568V27.5C16 18.387 23.163 11 32 11c4.84 0 5.683 2.647 5.457 6.23-.188 2.99-.617 4.546-4.804 7.859z"
                        fill={hairColors[interumProfilePic.hairColor]}
                      />
                    </>,
                    "hair",
                    "hair16",
                    interumProfilePic.hair
                  )}

                  {renderAvatarSelectionItem(
                    <>
                      <path
                        d="M22.2 17.002c-.131-.647-.2-1.316-.2-2.002 0-5.523 4.477-10 10-10s10 4.477 10 10c0 .686-.069 1.355-.2 2.002C39.274 14.526 35.815 13 32 13s-7.274 1.526-9.8 4.002z"
                        fill={hairColors[interumProfilePic.hairColor]}
                      />
                      <path
                        d="M45.934 25.632C43.828 20.564 38.83 17 33 17h-2c-5.83 0-10.828 3.564-12.934 8.632C18.753 18.542 24.73 13 32 13s13.247 5.542 13.934 12.632z"
                        fill="#f55d81"
                      />
                    </>,
                    "hair",
                    "hair17",
                    interumProfilePic.hair
                  )}

                  {renderAvatarSelectionItem(
                    <>
                      <path
                        d="M46 28c-1.807-2.008-3.13-4.5-3.97-7.474-1.87 2.283-4.546 3.607-8.03 3.974-5.832.614-10.817-.327-14.953-2.822A13.959 13.959 0 0 0 18 27v1.027a4.474 4.474 0 0 0-2 .73V27.5C16 18.387 23.163 11 32 11s16 7.387 16 16.5v1.258a4.474 4.474 0 0 0-2-.73zm2 8.242V64H37V46.08A14.036 14.036 0 0 0 45.42 37h.08a4.48 4.48 0 0 0 2.5-.758zM27 64l-11.13-.068.13-27.69a4.48 4.48 0 0 0 2.58.757A14.036 14.036 0 0 0 27 46.081v5.464c.034 1.57.034 5.723 0 12.455z"
                        fill={hairColors[interumProfilePic.hairColor]}
                      />
                      <path
                        d="M46 28c-1.807-2.008-3.13-4.5-3.97-7.474-1.87 2.283-4.546 3.607-8.03 3.974-5.832.614-10.817-.327-14.953-2.822A13.959 13.959 0 0 0 18 27v1.027a4.474 4.474 0 0 0-2 .73V27.5C16 18.387 23.163 11 32 11s16 7.387 16 16.5v1.258a4.474 4.474 0 0 0-2-.73z"
                        fill="#fff"
                        opacity={0.258}
                      />
                    </>,
                    "hair",
                    "hair18",
                    interumProfilePic.hair
                  )}

                  {renderAvatarSelectionItem(
                    <>
                      <path
                        d="M41.001 13.836C41.057 11.156 43.291 9 46.04 9c2.783 0 5.04 2.211 5.04 4.94 0 .079-.003.158-.007.237.018 3.201.708 7.08 1.928 9.823-2.256-.606-4.334-1.62-6.22-2.903A16.67 16.67 0 0 1 48 27.382v1.376a4.474 4.474 0 0 0-2-.73V28c-1.807-2.008-3.13-4.5-3.97-7.474-1.87 2.283-4.546 3.607-8.03 3.974-5.832.614-10.817-.327-14.953-2.822A13.959 13.959 0 0 0 18 27v1.027a4.474 4.474 0 0 0-2 .73v-1.375c0-2.227.434-4.35 1.22-6.285C15.334 22.38 13.256 23.394 11 24c1.22-2.743 1.91-6.622 1.928-9.823a4.923 4.923 0 0 1-.006-.238C12.922 11.211 15.178 9 17.96 9c2.748 0 4.982 2.156 5.038 4.836C25.563 12.046 28.662 11 32 11s6.437 1.046 9.001 2.836z"
                        fill={hairColors[interumProfilePic.hairColor]}
                      />
                      <path
                        d="M41.013 13.582C45.213 16.545 48 21.767 48 27.714v1.044a4.474 4.474 0 0 0-2-.73V28c-1.807-2.008-3.13-4.5-3.97-7.474-1.87 2.283-4.546 3.607-8.03 3.974-5.832.614-10.817-.327-14.953-2.822A13.959 13.959 0 0 0 18 27v1.027a4.474 4.474 0 0 0-2 .73v-1.043c0-5.947 2.788-11.17 6.987-14.132.006.084.01.169.012.254C25.563 12.046 28.662 11 32 11s6.437 1.046 9.001 2.836c.002-.085.006-.17.012-.254z"
                        fill="#fff"
                        opacity={0.259}
                      />
                      <path
                        d="M18 16a5 5 0 0 1 8.16-3.875c-3.106 1.248-5.739 3.46-7.545 6.279A4.978 4.978 0 0 1 18 16zm23-5a5 5 0 0 1 4.385 7.404c-1.806-2.818-4.44-5.031-7.545-6.279A4.98 4.98 0 0 1 41 11z"
                        fill="#f55d81"
                      />
                    </>,
                    "hair",
                    "hair19",
                    interumProfilePic.hair
                  )}
                  {renderAvatarSelectionItem(
                    <path
                      d="M42.26 14.63a7.926 7.926 0 0 1 4.6 8.351L46 29c-2.827-1.696-4.695-5.55-5.604-11.561a9.238 9.238 0 0 1-5.692 2.774c-1.823.191-3.391.287-4.704.287-3 0-5.667-.5-8-1.5 0 3.667-1.333 7.167-4 10.5l-.922-8.533A9 9 0 0 1 26.025 11H43a9.237 9.237 0 0 1-.74 3.63z"
                      fill={hairColors[interumProfilePic.hairColor]}
                    />,
                    "hair",
                    "hair20",
                    interumProfilePic.hair
                  )}
                </Row>
                <br />
                <h3>Pick The Color</h3>
                <CirclePicker
                  width={"100%"}
                  circleSize={50}
                  colors={[
                    "#362d46",
                    "#665e97",
                    "#5ac4d4",
                    "#dee2f5",
                    "#6b4445",
                    "#f29c64",
                    "#e16381",
                    "#e15b65",
                  ]}
                  onChangeComplete={(color) =>
                    setAvatarItem(
                      "hairColor",
                      reverseObject(hairColors)[color.hex]
                    )
                  }
                  color={hairColors[interumProfilePic.hairColor]}
                />
              </Panel>
              <Panel header="Mouth Settings" key="8">
                <h3>Pick The Style</h3>
                <Row gutter={16}>
                  {renderAvatarSelectionItem(
                    <path
                      fill="#1b0640"
                      d="M28.004 40.132a1 1 0 00.992 1.736C30.016 41.285 31.014 41 32 41s1.983.285 3.004.868a1 1 0 10.992-1.736C34.684 39.382 33.348 39 32 39c-1.348 0-2.684.382-3.996 1.132z"
                    />,
                    "mouth",
                    "mouth1",
                    interumProfilePic.mouth
                  )}

                  {renderAvatarSelectionItem(
                    <>
                      <path
                        fill="#dc5c7a"
                        d="M28 41h8c-.667 1.667-2 2.5-4 2.5s-3.333-.833-4-2.5z"
                      />
                      <path
                        fill="#f57b98"
                        d="M32 40a2.092 2.092 0 013.612.225L36 41h-8l.388-.775A2.092 2.092 0 0132 40z"
                      />
                    </>,
                    "mouth",
                    "mouth2",
                    interumProfilePic.mouth
                  )}

                  {renderAvatarSelectionItem(
                    <>
                      <path
                        fill="#456dff"
                        d="M34.996 42.665a3 3 0 01-5.992 0A3.5 3.5 0 0127 39.5a2.035 2.035 0 012.73-1.912c.756.275 1.513.412 2.27.412s1.514-.137 2.27-.412A2.035 2.035 0 0137 39.5a3.5 3.5 0 01-2.004 3.165zM33.415 43h-2.83a1.5 1.5 0 002.83 0z"
                      />
                      <g fill="#fff" transform="translate(23 36)">
                        <path
                          fillOpacity={0.26}
                          d="M11.996 6.665a3 3 0 10-5.991 0A3.5 3.5 0 014 3.5a2.035 2.035 0 012.73-1.912C7.485 1.863 8.242 2 9 2s1.514-.137 2.27-.412A2.035 2.035 0 0114 3.5a3.5 3.5 0 01-2.004 3.165zM10.415 7h-2.83a1.5 1.5 0 112.83 0z"
                        />
                        <circle cx={9} cy={4.5} r={1.5} />
                      </g>
                    </>,
                    "mouth",
                    "mouth3",
                    interumProfilePic.mouth
                  )}

                  {renderAvatarSelectionItem(
                    <path
                      fill="#1b0640"
                      d="M28.004 41.868a1 1 0 01.992-1.736c1.02.583 2.018.868 3.004.868s1.983-.285 3.004-.868a1 1 0 11.992 1.736C34.684 42.618 33.348 43 32 43c-1.348 0-2.684-.382-3.996-1.132z"
                    />,
                    "mouth",
                    "mouth4",
                    interumProfilePic.mouth
                  )}

                  {renderAvatarSelectionItem(
                    <path
                      fill="#1b0640"
                      d="M30.318 41.728a.75.75 0 01.364-1.456c2.433.609 4.165.32 5.288-.802a.75.75 0 011.06 1.06c-1.544 1.545-3.812 1.923-6.712 1.198z"
                    />,
                    "mouth",
                    "mouth5",
                    interumProfilePic.mouth
                  )}

                  {renderAvatarSelectionItem(
                    <ellipse cx={32} cy={41} fill="#1b0640" rx={2} ry={2.5} />,
                    "mouth",
                    "mouth6",
                    interumProfilePic.mouth
                  )}

                  {renderAvatarSelectionItem(
                    <path fill="#1b0640" d="M29 38h6v1a3 3 0 01-6 0z" />,
                    "mouth",
                    "mouth7",
                    interumProfilePic.mouth
                  )}
                </Row>
                <br />
              </Panel>
              <Panel header="Nose Settings" key="5">
                <h3>Pick The Style</h3>
                <Row gutter={16}>
                  {renderAvatarSelectionItem(
                    <>
                      <path
                        fill={interumProfilePic.noseColor}
                        d="M28.25 34a.75.75 0 01.75-.75h6a.75.75 0 01.75.75c0 1.664-1.586 3.25-3.75 3.25-2.164 0-3.75-1.586-3.75-3.25z"
                      />
                      <path
                        style={{
                          mixBlendMode: "overlay",
                        }}
                        fill="#fff"
                        d="M35 33.25a.75.75 0 00-.75.75c0 .836-.914 1.75-2.25 1.75s-2.25-.914-2.25-1.75a.75.75 0 00-.75-.75v-.002h6z"
                        opacity={0.36}
                      />
                    </>,
                    "nose",
                    "nose1",
                    interumProfilePic.nose
                  )}
                  {renderAvatarSelectionItem(
                    <>
                      <path
                        fill={interumProfilePic.noseColor}
                        d="M29.288 35.237a.75.75 0 01.475-.949 1.09 1.09 0 01.307-.028h3.85c.133 0 .263.01.317.028a.75.75 0 01.475.95c-.434 1.3-1.383 2.012-2.712 2.012s-2.278-.712-2.712-2.013z"
                      />
                      <path
                        style={{
                          mixBlendMode: "overlay",
                        }}
                        fill="#fff"
                        d="M33.945 34.255c-.3 0-.558.212-.657.508-.233.699-.617.987-1.288.987s-1.055-.288-1.288-.987c-.1-.296-.367-.503-.657-.503z"
                        opacity={0.36}
                      />
                    </>,
                    "nose",
                    "nose2",
                    interumProfilePic.nose
                  )}
                  {renderAvatarSelectionItem(
                    <>
                      <path
                        fill={interumProfilePic.noseColor}
                        d="M29.18 33.758h5.632c.335 0 .593.045.776.276.037.056.083.139.099.182.208.574.284 1.252.229 2.033-.223 1.613-1.589 2.501-3.916 2.501-2.321 0-3.686-.884-3.914-2.488-.054-.814.027-1.509.242-2.084.012-.032.035-.069.066-.12.18-.247.454-.3.785-.3z"
                      />
                      <path
                        style={{
                          mixBlendMode: "overlay",
                        }}
                        fill="#fff"
                        d="M34.794 33.779a.75.75 0 00-.515.927c.523 1.83-.089 2.544-2.279 2.544s-2.802-.713-2.279-2.544a.75.75 0 00-.515-.927c-.069-.02-.037-.019-.105-.019h5.773c-.053 0-.08.006-.08.019z"
                        opacity={0.36}
                      />
                      <path
                        fill="#000"
                        d="M28.394 34.057a.748.748 0 00-.115.237c-.212.741-.274 1.4-.193 1.968a20.878 20.878 0 00-.875 1.48 20.24 20.24 0 00-1.238 2.92.5.5 0 01-.946-.324c.394-1.15.827-2.172 1.3-3.065.472-.89 1.137-1.934 1.996-3.135a.502.502 0 01.071-.08zm7.522 2.192c.078-.565.015-1.22-.195-1.955a.748.748 0 00-.133-.26.5.5 0 01.1.104c.858 1.201 1.522 2.245 1.994 3.135.474.893.907 1.914 1.301 3.065a.5.5 0 11-.946.324 20.24 20.24 0 00-1.238-2.92c-.24-.452-.534-.95-.883-1.493z"
                        opacity={0.119}
                      />
                    </>,
                    "nose",
                    "nose3",
                    interumProfilePic.nose
                  )}
                  {renderAvatarSelectionItem(
                    <>
                      <path
                        fill={interumProfilePic.noseColor}
                        d="M28.25 34a.75.75 0 01.75-.75h6a.75.75 0 01.75.75c0 1.664-1.586 3.25-3.75 3.25-2.164 0-3.75-1.586-3.75-3.25z"
                      />
                      <path
                        style={{
                          mixBlendMode: "overlay",
                        }}
                        fill="#fff"
                        d="M35 33.25a.75.75 0 00-.75.75c0 .836-.914 1.75-2.25 1.75s-2.25-.914-2.25-1.75a.75.75 0 00-.75-.75v-.002h6z"
                        opacity={0.36}
                      />
                    </>,
                    "nose",
                    "nose4",
                    interumProfilePic.nose
                  )}
                </Row>
                <br />
              </Panel>
              <Panel header="Skin Tone Settings" key="9">
                <h3>Pick The Color</h3>
                <CirclePicker
                  width={"100%"}
                  circleSize={50}
                  colors={[
                    "#FFCC22",
                    "#FBD2C7",
                    "#F2AD9B",
                    "#e58f7b",
                    "#e4a06f",
                    "#b1695a",
                    "#92584b",
                    "#613d36",
                    "#c9e6dc",
                  ]}
                  onChangeComplete={(color) =>
                    setAvatarItem(
                      "skinColor",
                      reverseObject(skinColors)[color.hex]
                    )
                  }
                  color={skinColors[interumProfilePic.skinColor]}
                />
              </Panel>
              <Panel header="Background Color" key="100">
                <h3>Pick The Color</h3>
                <CirclePicker
                  width={"100%"}
                  circleSize={50}
                  colors={[
                    "#93a7fe",
                    "#a9e874",
                    "#ff7a9a",
                    "#b378f7",
                    "#ff6674",
                    "#89e6e5",
                    "#ffcc64",
                    "#f8fbff",
                  ]}
                  onChangeComplete={(color) =>
                    setAvatarItem(
                      "backgroundColor",
                      reverseObject(backgroundColors)[color.hex]
                    )
                  }
                  color={backgroundColors[interumProfilePic.backgroundColor]}
                />
              </Panel>
            </Collapse>
          </ContentCard>
        </Col>
      </Row>
    </Spin>
  );
}

export default AvatarSettingsForm;
