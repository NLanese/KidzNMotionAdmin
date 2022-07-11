import React, { useState } from "react";
import { Field, FormSpy } from "react-final-form";
import { PlainNumberField } from "@fields";
import { Col, Row } from "antd";
import { Typography } from "antd";
const { Text } = Typography;

import styled from "styled-components";

const ScoreCardRowWrapper = styled.div`
  border-bottom: 2px solid ${(props) => props.theme.colors.backgroundColor};
  margin-bottom: 6px;
  padding-top: 10px;
`;

const ScoreCardRowFormChunkReversed = ({
  type,
  rowTitle,
  formatIcon,
  maxValue,
  minValue,
}) => {
  const [valueDict, setValueDict] = useState({});

  return (
    <ScoreCardRowWrapper>
      <Row gutter={{ xs: 2, sm: 10 }} justify="space-between" align="middle">
        <FormSpy
          subscription={{ values: true }}
          onChange={(state) => setValueDict(state.values)}
        />
        <Col xs={24} md={3}>
          <Text style={{ marginBottom: "20px", display: "block" }}>
            {rowTitle}
          </Text>
        </Col>
        <Col xs={7} md={7}>
          <Field
            name={`scoreCard.${type}.fair`}
            component={PlainNumberField}
            size={"large"}
            min={
              valueDict.scoreCard &&
              valueDict.scoreCard[type] &&
              valueDict.scoreCard[type].good + 1
            }
            bordered={true}
            max={maxValue}
            required={true}
            addonAfter={
              valueDict.scoreCard &&
              valueDict.scoreCard[type] &&
              `- ${valueDict.scoreCard[type].good + 1}${
                formatIcon ? formatIcon : ""
              }`
            }
            wideAddon={true}
            removeSuccessIcon={true}
          />
        </Col>

        <Col xs={7} md={7}>
          <Field
            name={`scoreCard.${type}.good`}
            component={PlainNumberField}
            size={"large"}
            min={
              valueDict.scoreCard &&
              valueDict.scoreCard[type] &&
              valueDict.scoreCard[type].fantastic + 1
            }
            max={
              valueDict.scoreCard &&
              valueDict.scoreCard[type] &&
              valueDict.scoreCard[type].fair - 1
            }
            bordered={true}
            required={true}
            addonAfter={
              valueDict.scoreCard &&
              valueDict.scoreCard[type] &&
              `- ${valueDict.scoreCard[type].fantastic + 1}${
                formatIcon ? formatIcon : ""
              }`
            }
            wideAddon={true}
            removeSuccessIcon={true}
          />
        </Col>
        <Col xs={7} md={7}>
          <Field
            name={`scoreCard.${type}.fantastic`}
            component={PlainNumberField}
            size={"large"}
            min={
              minValue
            }
            max={
              valueDict.scoreCard &&
              valueDict.scoreCard[type] &&
              valueDict.scoreCard[type].good - 1
            }
            bordered={true}
            required={true}
            addonAfter={`- ${minValue}${formatIcon ? formatIcon : ""}`}
            wideAddon={true}
            removeSuccessIcon={true}
          />
        </Col>
      </Row>
    </ScoreCardRowWrapper>
  );
};

export default ScoreCardRowFormChunkReversed;
