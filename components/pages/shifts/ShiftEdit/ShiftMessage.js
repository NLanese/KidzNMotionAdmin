import React from "react";

import { SoundOutlined } from "@ant-design/icons";
import { Typography, Input } from "antd";

import ContentCard from "@common/content/ContentCard";

const { Text } = Typography;
const { TextArea } = Input;

function ShiftMessage({ setShiftMessage, shiftMessage }) {
  return (
    <ContentCard>
      <Text strong>
        <SoundOutlined /> Step 3: Set Shift Message
      </Text>
      <br />
      <br />
      <TextArea
        placeholder={"Shift Message"}
        size={"large"}
        onChange={(event) => setShiftMessage(event.target.value)}
        value={shiftMessage}
        allowClear={true}
        style={{ height: "100px" }}
        type="text"
      />
    </ContentCard>
  );
}

export default ShiftMessage;
