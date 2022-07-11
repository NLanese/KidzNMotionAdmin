import React from "react";

import { Button, Space } from "antd";
import styled from "styled-components";

const SubmitButtonRow = styled.div`
  float: right;
`;

function SubmitShift({ loading, submitShiftData, driversOnShift }) {
  return (
    <SubmitButtonRow>
      <Space direction="horizontal">
        <Button
          size="large"
          type="primary"
          disabled={driversOnShift.length === 0}
          loading={loading}
          onClick={() => submitShiftData()}
        >
          Submit & Save Shift
        </Button>
      </Space>
    </SubmitButtonRow>
  );
}

export default SubmitShift;
