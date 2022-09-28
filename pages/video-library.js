import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { Col, Row, Typography, Space, message, Divider } from "antd";
import ContentCard from "@common/content/ContentCard";
import PageHeader from "@common/PageHeader";
import { userState } from "@atoms";
import { useRecoilValue } from "recoil";
import LoadingBlock from "@common/LoadingBlock";

import { InfoCircleOutlined } from "@ant-design/icons";
import { GET_VIDEO_LIBRARY } from "@graphql/operations";
import client from "@utils/apolloClient";
import ReactPlayer from "react-player";

const { Text, Title, Link } = Typography;

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

  const renderVideos = (level) => {
    return videos.map((videoObject) => {
      if (videoObject.level === level && videoObject.id !== "great_job") {
        return (
          <Col xs={24} sm={12} key={videoObject.id}>
            <>
              <ContentCard style={{position: "relative"}}>
                <Space direction="vertical">
                  <Title style={{ margin: "0px" }} level={5}>
                    {videoObject.title}
                  </Title>
                  <Text>{videoObject.description}</Text>
                </Space>
                <ReactPlayer url={videoObject.videoURL} controls={true}  width="100%" style={{width: "100%"}}/>
              </ContentCard>
            </>
          </Col>
        );
      }
    });
  };
  const renderVideoLevel = (level) => {
    return (
      <VideoLevelWrapper>
        <Row gutter={[16, 3]}>
          <Title level="5">Level {level}</Title>
          <Divider />
          {renderVideos(level)}
        </Row>
      </VideoLevelWrapper>
    );
  };

  return (
    <IndexWrapper>
      <PageHeader title="Kidz-N-Motion Video Library" />
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
