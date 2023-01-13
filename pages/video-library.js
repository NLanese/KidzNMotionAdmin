import React, { useEffect, useState } from "react";
import styled from "styled-components";
import {
  Col,
  Row,
  Typography,
  Space,
  message,
  Divider,
  Result,
  Button,
} from "antd";
import ContentCard from "@common/content/ContentCard";
import PageHeader from "@common/PageHeader";
import { userState } from "@atoms";
import { useRecoilValue } from "recoil";
import LoadingBlock from "@common/LoadingBlock";
import {
  getCheckoutURL,
  getBillingInformation,
  updateOrganizationSubscription,
} from "@helpers/billing";
import { InfoCircleOutlined } from "@ant-design/icons";
import { GET_VIDEO_LIBRARY } from "@graphql/operations";
import client from "@utils/apolloClient";
import ReactPlayer from "react-player";
import BasicLink from "@common/BasicLink";
const { Text, Title, Link } = Typography;
import VIDEOS from "@constants/videos";

const IndexWrapper = styled.div`
  max-width: 1200px;
  margin: auto;
`;

const VideoLevelWrapper = styled.div`
  & h1 {
    font-size: 20px !important;
    margin-bottom: -13px !important;
  }
`;

function Index() {
  const user = useRecoilValue(userState);
  const [videos, setVideos] = useState(null);

  const getVideos = async () => {
    const token = localStorage.getItem("token");

    await client
      .query({
        query: GET_VIDEO_LIBRARY,
        fetchPolicy: "network-only",
      })
      .then(async (resolved) => {
        setVideos(resolved.data.getAllVideoFiles);
      })
      .catch((error) => {
        setVideos(null);
        message.error("Sorry, there was an error getting the video library");
      });
  };

  useEffect(() => {
    getVideos();
  }, []);
  const checkout = async () => {
    const session = await getCheckoutURL();
    window.location = session.checkoutURL;
  };
  const renderVideos = (level, renderHalfVideo) => {
    return videos.map((videoObject, index) => {
      if (renderHalfVideo && index > 4) return null;
      if (videoObject.level === level && videoObject.id !== "great_job") {
        return (
          <Col xs={24} sm={12} key={videoObject.id}>
            <>
              <ContentCard style={{ position: "relative" }}>
                <Space direction="vertical">
                  <Title style={{ margin: "0px" }} level={5}>
                    {videoObject.title}
                  </Title>
                  <Text>{videoObject.description}</Text>
                </Space>
                <ReactPlayer
                  url={videoObject.videoURL}
                  controls={true}
                  width="100%"
                  style={{ width: "100%" }}
                />
              </ContentCard>
            </>
          </Col>
        );
      }
    });
  };
  const renderVideoLevel = (level, renderHalfVideo) => {
    return (
      <VideoLevelWrapper>
        <Row gutter={[16, 3]}>
          <Title level="5">Level {level}</Title>
          <Divider />
          {renderVideos(level, renderHalfVideo)}
        </Row>
      </VideoLevelWrapper>
    );
  };

  const determineVideoLibrary = () => {
    let fullVideoFeed = (
      <>
        {!videos ? (
          <LoadingBlock />
        ) : (
          <>
            {renderVideoLevel(1)}
            {renderVideoLevel(2)}
          </>
        )}
      </>
    );

    let halfVideoFeedOwnedOrg = (
      <>
        {!videos ? (
          <LoadingBlock />
        ) : (
          <>
            {renderVideoLevel(1, true)}
            <Result
              title="Activate your subscription to  view the full video library"
              extra={
                <Button
                  onClick={() => checkout()}
                  type="primary"
                  key="console"
                  size={"large"}
                >
                  Activate Subscription
                </Button>
              }
            />
          </>
        )}
      </>
    );

    let halfVideoOrgUser = (
      <>
        {!videos ? (
          <LoadingBlock />
        ) : (
          <>
            {renderVideoLevel(1, true)}
            <Result title="Your organization admin needs to activate their subscription view the full video library" />
          </>
        )}
      </>
    );

    if (user.role !== "GUARDIAN") {
      // Check if the user organization subscriptino is active
      let activeSubscription = false;

      if (user.organizations[0]) {
        if (user.organizations[0].organization) {
          if (user.organizations[0].organization.stripeSubscriptionID) {
            activeSubscription = true;
          }
        }
      }

      if (user.ownedOrganization) {
        if (activeSubscription) {
          return fullVideoFeed;
        } else {
          return halfVideoFeedOwnedOrg;
        }
      } else {
        if (activeSubscription) {
          return fullVideoFeed;
        } else {
          return halfVideoOrgUser;
        }
      }
    } else {
      if (user.solo) {
        return fullVideoFeed;
      } else {
        let videosToWatch = [];
        if (user.children && user.children[0]) {
          if (user.children[0].childCarePlans) {
            if (user.children[0].childCarePlans[0]) {
              user.children[0].childCarePlans[0].assignments.map(
                (assignmentObject) => {
                  assignmentObject.videos.map((videoObject) => {
                    if (!videosToWatch.includes(videoObject.contentfulID)) {
                      videosToWatch.push(videoObject.contentfulID);
                    }
                  });
                }
              );
            }
          }
        }

        if (videosToWatch.length === 0) {
          return fullVideoFeed;
        } else {
          return videosToWatch.map((videoID) => {
            let videoObject = VIDEOS[videoID];
            return (
              <Col xs={24} sm={24} key={videoObject.id}>
                <>
                  <ContentCard style={{ position: "relative" }}>
                    <Space direction="vertical">
                      <Title style={{ margin: "0px" }} level={5}>
                        {videoObject.title}
                      </Title>
                      <Text>{videoObject.description}</Text>
                    </Space>
                    <ReactPlayer
                      url={videoObject.videoURL}
                      controls={true}
                      width="100%"
                      style={{ width: "100%" }}
                    />
                  </ContentCard>
                </>
              </Col>
            );
          });
        }

        return <div />;
      }
    }
  };
  return (
    <IndexWrapper>
      <PageHeader title="Kidz-N-Motion Video Library" />
      {determineVideoLibrary()}
      <Divider />
      <br />
      <h1>FOR TESTING PURPOSES ONLY</h1>
      {!videos ? (
        <LoadingBlock />
      ) : (
        <>
          {renderVideoLevel(1)}
          {renderVideoLevel(2)}
        </>
      )}
    </IndexWrapper>
  );
}

export default Index;
