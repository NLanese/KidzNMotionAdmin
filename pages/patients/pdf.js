import React, { useEffect, useState } from "react";
import styled from "styled-components";
import VIDEOS from "@constants/videos";
import { NextSeo } from "next-seo";
import { makeRandomString, changeTimeZone } from "@helpers/common";

import { withRouter } from "next/router";
var dateFormat = require("dateformat");
import { userState } from "@atoms";
import { useRecoilState } from "recoil";
import Router from "next/router";
import { Button } from "antd";

import moment from "moment";

import {
  Page,
  Text,
  View,
  Image,
  Document,
  StyleSheet,
  PDFViewer,
  Link,
} from "@react-pdf/renderer";

const IndexWrapper = styled.div`
  max-width: ${(props) => props.theme.contentSize.standard};
  margin: auto;
  min-height: 100vh;
  padding: 00px 0px;
  background-color: #525659;
  text-align: center;
  .ant-typography strong {
    font-size: 16.5px;
  }
  @media (max-width: ${(props) => props.theme.breakPoints.sm}) {
    .ant-divider {
      margin: 2px 0px;
    }
  }
`;

function ManagePatients({ router }) {
  const [user, setUser] = useRecoilState(userState);
  const [patientDetail, setPatientDetail] = useState(null);
  const [dateToUse, setDateToUse] = useState(null);

  useEffect(() => {
    if (user.role !== "THERAPIST") {
      Router.push("/");
    }
  }, []);

  const renderPatientData = (renderIDKey) => {
    // Get list of all children with child care plans
    let patientCarePlans = {};
    user.patientCarePlans.map((patientCarePlan) => {
      patientCarePlans[patientCarePlan.child.id] = patientCarePlan;
    });

    let users = [];
    user.organizations[0].organization.organizationUsers.map(
      (orgUserObject) => {
        // console.log(orgUserObject);
        let user = Object.assign({}, orgUserObject.user);
        if (patientCarePlans[user.id]) {
          user.carePlan = patientCarePlans[user.id];
        }
        if (user.role === "CHILD" && user.carePlan) {
          users.push(user);
        }
      }
    );

    if (renderIDKey) {
      let keyDict = {};
      users.map((userObject) => {
        keyDict[userObject.id] = userObject;
      });
      return keyDict;
    }

    return users;
  };

  useEffect(() => {
    if (router.query.id) {
      if (renderPatientData(true)[router.query.id]) {
        // console.clear();
        // console.log(renderPatientData(true)[router.query.id]);
        if (router.query.date) {
          const date = new moment(router.query.date);
          console.log(date);
          setDateToUse(date);
        }

        setPatientDetail(renderPatientData(true)[router.query.id]);
      } else {
        setPatientDetail(null);
      }
    } else {
      setPatientDetail(null);
    }
  }, [router, user]);

  // Create styles

  const styles = StyleSheet.create({
    body: {
      paddingTop: 35,
      paddingBottom: 65,
      paddingHorizontal: 35,
      backgroundColor: "white",
    },
    title: {
      fontSize: 24,
      textAlign: "center",
    },
    author: {
      fontSize: 12,
      textAlign: "center",
      marginBottom: 40,
    },
    subtitle: {
      fontSize: 18,
      margin: 12,
    },
    text: {
      margin: 12,
      fontSize: 14,
      textAlign: "justify",
      fontFamily: "Times-Roman",
    },
    image: {
      marginVertical: 15,
      marginHorizontal: 100,
    },
    header: {
      fontSize: 12,
      marginBottom: 10,
      textAlign: "center",
      color: "grey",
    },
    header2: {
      fontSize: 10,
      marginBottom: 30,
      textAlign: "center",
      color: "grey",
      textDecoration: "italic",
    },
    pageNumber: {
      position: "absolute",
      fontSize: 12,
      bottom: 30,
      left: 0,
      right: 0,
      textAlign: "center",
      color: "grey",
    },
  });

  const renderGameBadges = () => {
    let badgesObjects = [];
    patientDetail.carePlan.assignments.map((assignmentObject) => {
      assignmentObject.videos.map((videoObject) => {
        let videoBadgeObject = {
          videoTitle: videoObject.file.title,
          medals: {},
        };
        videoObject.medals.map((medalObject) => {
          let date1 = changeTimeZone(medalObject.createdAt, "America/New_York");
          let date2 = dateToUse.toDate();

          if (
            date1.getFullYear() === date2.getFullYear() &&
            date1.getMonth() === date2.getMonth() &&
            date1.getDate() === date2.getDate()
          ) {
            if (videoBadgeObject.medals[medalObject.level]) {
              videoBadgeObject.medals[medalObject.level] += 1;
            } else {
              videoBadgeObject.medals[medalObject.level] = 1;
            }
          }
        });
        console.log(videoBadgeObject);
        if (
          videoBadgeObject.medals.BRONZE ||
          videoBadgeObject.medals.SILVER ||
          videoBadgeObject.medals.GOLD
        ) {
          badgesObjects.push(videoBadgeObject);
        }
      });
    });

    return badgesObjects.map((badgesObject) => {
      console.log(badgesObject);
      return (
        <Text
          key={badgesObject.videoTitle}
          style={{
            fontWeight: "600",
            fontSize: "13px",
            marginBottom: "10px",
            marginTop: "0px",
            marginRight: "15px",
          }}
        >
          {badgesObject.videoTitle}: [
          {badgesObject.medals.BRONZE
            ? `Bronze Medals (${badgesObject.medals.BRONZE.toString()}) `
            : ""}
          {badgesObject.medals.SILVER
            ? `Silver Medals (${badgesObject.medals.SILVER.toString()}) `
            : ""}
          {badgesObject.medals.GOLD
            ? `Gold Medals (${badgesObject.medals.GOLD.toString()}) `
            : ""}
          ],
        </Text>
      );
    });
  };

  const renderNotes = () => {
    // console.clear();
    // console.log(patientDetail.carePlan.comments);

    let videos = [];
    patientDetail.carePlan.assignments.map((assignmentObject) => {
      assignmentObject.videos.map((videoObject) => {
        console.log(videoObject);
        videos.push({
          title: videoObject.file.title,
          description: VIDEOS[videoObject.file.id]?.medicalDescription,
          link: videoObject.file.videoURL,
          id: videoObject.id,
          comments: [],
        });
      });
    });

    patientDetail.carePlan.comments.map((commentObject) => {
      videos.map((videoObject) => {
        if (commentObject.videoId === videoObject.id) {
          // console.log(videoObject.comments);
          // console.log("---------");

          let date1 = changeTimeZone(
            commentObject.createdAt,
            "America/New_York"
          );

          let date2 = dateToUse.toDate();

          if (
            date1.getFullYear() === date2.getFullYear() &&
            date1.getMonth() === date2.getMonth() &&
            date1.getDate() === date2.getDate()
          ) {
            videoObject.comments.push(commentObject.content);
          }
        }
      });
    });

    return videos.map((videoObject) => {
      if (videoObject.comments.length === 0) {
        return null;
      }
      return (
        <View
          key={videoObject.title}
          style={{ borderBottom: "1px solid black", paddingTop: "10px" }}
        >
          <Text
            style={{
              fontWeight: "600",
              fontSize: "12px",
              marginBottom: "10px",
            }}
          >
            {videoObject.title}{" "}
            <Link src={videoObject.link}>
              <Image src="/pclip.png" style={{ width: "15px" }} />
            </Link>
            : {videoObject.description}
          </Text>
          <Text
            style={{
              fontWeight: "600",
              fontSize: "12px",
              marginBottom: "10px",
            }}
          >
            {videoObject.comments.toString()}
          </Text>
        </View>
      );
    });
  };

  const renderAssignmentProgress = () => {
    // console.clear();
    // console.log(patientDetail.carePlan.comments);

    let videos = [];
    let comments = [];

    patientDetail.carePlan.comments.map((commentObject) => {
      if (commentObject.assignmentId) {
        // console.log(videoObject.comments);
        // console.log("---------");

        let date1 = changeTimeZone(commentObject.createdAt, "America/New_York");

        let date2 = dateToUse.toDate();

        // if (
        //   date1.getFullYear() === date2.getFullYear() &&
        //   date1.getMonth() === date2.getMonth() &&
        //   date1.getDate() === date2.getDate()
        // ) {
        //   comments.push(commentObject.content);
        // }
        comments.push(commentObject.content);
      }
    });

    return comments.toString();
  };

  return (
    <IndexWrapper>
      <NextSeo title={"Patient PDF"} />
      {patientDetail && dateToUse && (
        <>
          <PDFViewer style={{ width: "100%", height: "100vh", border: "none" }}>
            <Document>
              <Page style={styles.body} size="A4">
                <Text style={styles.header} fixed>
                  Treatment Report
                </Text>
                <Text style={styles.header2} fixed>
                  To edit this document, please download the PDF and edit it on
                  your computer.
                  <br />
                </Text>

                <div
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "flex-start",
                    padding: "2rem",
                    borderBottom: "1px solid #EBEBEB",
                  }}
                >
                  <Text
                    style={{
                      fontWeight: "600",
                      fontSize: "12px",
                      width: "50%",
                    }}
                  >
                    Name: {patientDetail.firstName} {patientDetail.lastName}
                  </Text>
                  <Text
                    style={{
                      fontWeight: "600",
                      fontSize: "12px",
                      marginBottom: "10px",
                    }}
                  >
                    DOB:{" "}
                    {dateFormat(patientDetail.childDateOfBirth, "mmm dd, yyyy")}
                  </Text>
                </div>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "flex-start",
                    padding: "2rem",
                    borderBottom: "1px solid #EBEBEB",
                    marginTop: "10px",
                  }}
                >
                  <Text
                    style={{
                      fontWeight: "600",
                      fontSize: "12px",
                      width: "50%",
                    }}
                  >
                    Diagnosis:
                  </Text>

                  <Text
                    style={{
                      fontWeight: "600",
                      fontSize: "12px",
                      marginBottom: "10px",
                    }}
                  >
                    Duration:
                  </Text>
                </div>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "flex-start",
                    padding: "2rem",
                    borderBottom: "1px solid #EBEBEB",
                    marginTop: "10px",
                  }}
                >
                  <Text
                    style={{
                      fontWeight: "600",
                      fontSize: "12px",
                      width: "50%",
                    }}
                  >
                    Select Functional Level: {patientDetail.carePlan.level}
                  </Text>

                  <Text
                    style={{
                      fontWeight: "600",
                      fontSize: "12px",
                      marginBottom: "10px",
                    }}
                  >
                    Goal:
                  </Text>
                </div>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "flex-start",
                    padding: "2rem",
                    borderBottom: "1px solid #EBEBEB",
                    marginTop: "10px",
                  }}
                >
                  <Text
                    style={{
                      fontWeight: "600",
                      fontSize: "12px",
                      width: "50%",
                      marginBottom: "10px",
                    }}
                  >
                    Progress: {renderAssignmentProgress()}
                    <br />
                    <br />
                  </Text>

                  <Text
                    style={{
                      fontWeight: "600",
                      fontSize: "12px",
                      marginBottom: "10px",
                    }}
                  ></Text>
                </div>

                <Text
                  style={{
                    fontWeight: "600",
                    fontSize: "13px",
                    marginBottom: "0px",
                    marginTop: "10px",
                  }}
                >
                  Game Badges:
                </Text>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "flex-start",
                    padding: "2rem",
                    borderBottom: "1px solid #EBEBEB",
                    marginTop: "10px",
                    flexWrap: "wrap",
                  }}
                >
                  {renderGameBadges()}
                </div>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "flex-start",
                    padding: "2rem",
                    borderBottom: "1px solid #EBEBEB",
                    marginTop: "10px",
                  }}
                >
                  <Text
                    style={{
                      fontWeight: "600",
                      fontSize: "12px",
                      width: "100%",
                    }}
                  >
                    Bronze - Complete the video for at least 30 seconds
                  </Text>
                  <Text
                    style={{
                      fontWeight: "800",
                      fontSize: "12px",
                    }}
                  >
                    Silver - Complete the video for a minute, with or without
                    breaks, with no physical help
                  </Text>
                  <Text
                    style={{
                      fontWeight: "800",
                      fontSize: "12px",
                      marginBottom: "10px",
                    }}
                  >
                    Gold - Complete the video without help, for a full minute
                    with no breaks
                  </Text>
                </div>
                <Text
                  style={{
                    fontWeight: "600",
                    fontSize: "13px",
                    marginBottom: "10px",
                    marginTop: "10px",
                  }}
                >
                  Notes:
                </Text>
                <div
                  style={{
                    display: "flex",

                    justifyContent: "flex-start",
                    padding: "2rem",
                    borderBottom: "1px solid #EBEBEB",
                    marginTop: "10px",
                  }}
                >
                  {renderNotes()}
                </div>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "flex-start",
                    padding: "2rem",
                    borderBottom: "1px solid #EBEBEB",
                    marginTop: "10px",
                  }}
                >
                  <Text
                    style={{
                      fontWeight: "600",
                      fontSize: "12px",
                      width: "50%",
                    }}
                  >
                    Therapist Name: {patientDetail.carePlan.therapist.firstName}{" "}
                    {patientDetail.carePlan.therapist.lastName}
                  </Text>
                  <Text
                    style={{
                      fontWeight: "800",
                      fontSize: "12px",
                      marginBottom: "10px",
                    }}
                  >
                    Date Selected: {dateToUse.format("MM/DD/YYYY")}
                  </Text>
                </div>
              </Page>
            </Document>
          </PDFViewer>
        </>
      )}
    </IndexWrapper>
  );
}

export default withRouter(ManagePatients);
