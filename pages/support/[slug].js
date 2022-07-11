import React from "react";
import styled from "styled-components";
import { Col, Row, Typography, Divider, Button } from "antd";
import { NextSeo } from "next-seo";
import PageHeader from "@common/PageHeader";
import ContentCard from "@common/content/ContentCard";

const { Title, Text } = Typography;

const SupportArticleWrapper = styled.div`
  max-width: ${(props) => props.theme.contentSize.extraTight};
  margin: auto;
  & h2 {
    text-align: left;
    font-weight: 800 !important;
    font-size: 20px !important;
    margin-bottom: 8px;
  }
  .ant-typography {
    font-size: 19px;
    line-height: 39px;
    display: block;
  }
`;

function Support() {
  return (
    <SupportArticleWrapper>
      <NextSeo title="Knowledge Hub" />
      <PageHeader title="Intro To Tom Admin" backURL="/support" />
      <Title level={2}> Intro heading</Title>
        <Text>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua. Integer
          malesuada nunc vel risus commodo viverra maecenas accumsan lacus.
          Facilisis sed odio morbi quis. Blandit turpis cursus in hac habitasse
          platea dictumst. Volutpat 
        </Text>
        <br />
        <Button size={"large"} block>Download Template</Button>
        <br />
        <br />
        <Text>
       
          sed cras ornare arcu dui vivamus arcu felis
          bibendum. Magna eget est lorem ipsum dolor sit. Tempus urna et
          pharetra pharetra massa massa. Eu volutpat odio facilisis mauris sit
          amet massa vitae. Venenatis tellus in metus vulputate eu scelerisque
          felis imperdiet. In metus vulputate eu scelerisque felis imperdiet
          proin fermentum leo. Dignissim enim sit amet venenatis urna. Aliquam
          nulla facilisi cras fermentum odio eu. Elementum curabitur vitae nunc
          sed velit dignissim sodales ut. Orci phasellus egestas tellus rutrum
          tellus pellentesque eu tincidunt tortor.
          <br />
          <br />
          Cursus risus at ultrices mi tempus imperdiet. Felis bibendum ut
          tristique et egestas quis ipsum suspendisse. Et ultrices neque ornare
          aenean euismod elementum. Ut tellus elementum sagittis vitae et.
          Aliquam malesuada bibendum arcu vitae elementum. Elit sed vulputate mi
          sit. Facilisi morbi tempus iaculis urna id volutpat lacus laoreet non.
          Quis lectus nulla at volutpat diam. Tortor dignissim convallis aenean
          et tortor at. Platea dictumst vestibulum rhoncus est pellentesque elit
          ullamcorper.
        </Text>
    </SupportArticleWrapper>
  );
}

export default Support;
