import React, { useState, useEffect } from "react";
import VIDEOS from "@constants/videos";
import styled from "styled-components";
import { Button, Radio, message } from "antd";
import Router from "next/router";
import ReactPlayer from "react-player";
import { useMutation } from "@apollo/client";
import { SET_VIDEO_COMPLETED } from "@graphql/operations";

const FormContainer = styled.div`
  & p {
    margin-top: 10px;
    text-align: left;
  }
  text-align: center;
  .ant-radio-group {
    text-align: center;
    padding-bottom: 20px;
  }
`;

function AssignMedalsForm({ router, getUser, childID }) {
  const [loading, setLoading] = useState(false);
  const [instructions, setInstructions] = useState("no");
  const [neededBreak, setNeededBreak] = useState("no");
  const [seconds, setSeconds] = useState("less30");
  
  // Mutations
  const [setVideoCompleted, {}] = useMutation(SET_VIDEO_COMPLETED);

  const checkCanSubmit = () => {
    if (!instructions) {
      return true;
    }
    if (!neededBreak) {
      return true;
    }
    if (!seconds) {
      return true;
    }
  };

  const getStatus = () => {
    if (instructions === "yes" && neededBreak === "yes") {
      return "bronze";
    }
    if (seconds === "less30") {
      return "bronze";
    }

    if (instructions === "no" && neededBreak === "no" && seconds === "full60") {
      return "gold";
    } else if (
      (instructions === "yes" || neededBreak === "yes") &&
      seconds === "less60"
    ) {
      return "silver";
    } else if (
      instructions === "yes" &&
      neededBreak === "yes" &&
      seconds === "less30"
    ) {
      return "bronze";
    } else if (
      instructions === "no" &&
      neededBreak === "no" &&
      seconds === "less60"
    ) {
      return "silver";
    }

    return "silver";
  };

  const submit = async () => {
    setLoading(true);
    await setVideoCompleted({
      variables: {
        videoID: router.query.video_id,
        medalType: getStatus(),
        childID: childID
      },
    })
      .then(async (resolved) => {
        message.success("Successfully Assigned Medal");
        await getUser();
        Router.replace("/patients/manage?id=" + router.query.id, null, {
          shallow: true,
          scroll: false,
        });
      })
      .catch((error) => {
        message.error("Failed to save medal to video");
      });

    setLoading(false);
  };
  if (!router.query.video_id) {
    return <div />;
  }
  return (
    <FormContainer>
      <h4>{VIDEOS[router.query.video_id].title}</h4>
      <ReactPlayer
        url={VIDEOS[router.query.video_id].videoURL}
        controls={true}
        width="100%"
        style={{ width: "100%" }}
      />
      <br />
      <p>
        Did you give any instructions or physical support to complete this
        activity.
      </p>
      <Radio.Group
        onChange={(event) => setInstructions(event.target.value)}
        block
        size={"large"}
        defaultValue="no"
      >
        <Radio.Button value="yes">Yes</Radio.Button>
        <Radio.Button value="no">No</Radio.Button>
      </Radio.Group>

      <p>Did the child need to stop at any point to take a break?</p>
      <Radio.Group
        onChange={(event) => setNeededBreak(event.target.value)}
        block
        size={"large"}
        defaultValue="no"
      >
        <Radio.Button value="yes">Yes</Radio.Button>
        <Radio.Button value="no">No</Radio.Button>
      </Radio.Group>
      <p>How many seconds of the video were they able to succesfully do?</p>
      <Radio.Group
        onChange={(event) => setSeconds(event.target.value)}
        block
        size={"large"}
        defaultValue="less30"
      >
        <Radio.Button value="less30">Less than 30 seconds</Radio.Button>
        <Radio.Button value="less60">Less than a minute</Radio.Button>
        <Radio.Button value="full60">Full minute</Radio.Button>
      </Radio.Group>
      <br />
      <Button
        block
        type="primary"
        size="large"
        onClick={() => submit()}
        loading={loading}
        disabled={checkCanSubmit()}
      >
        Submit Results
      </Button>
    </FormContainer>
  );
}

export default AssignMedalsForm;
