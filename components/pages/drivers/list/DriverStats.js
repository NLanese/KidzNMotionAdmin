import React  from "react";

import { userState } from "@atoms";
import { useRecoilValue } from "recoil";

import { Typography, Result, Descriptions, Empty } from "antd";
const { Title } = Typography;

import { parseIndividualDriverReport } from "@helpers/performance";
import DriverDeliveries from "@components/pages/drivers/list/charts/DriverDeliveries";

function DriverStats({ driverDetail }) {
  const user = useRecoilValue(userState);

  if (user.role !== "OWNER") {
    return (
      <Result
        status="warning"
        title="You do not have access to view driver stats."
      />
    );
  }

  if (driverDetail.weeklyReport.lengh === 0) {
    return <Empty description="No Driver Data Uploaded Yet" />;
  }

  if (!driverDetail.weeklyReport[0]) {
    return <Empty description="No Driver Data Uploaded Yet" />;
  }

  return (
    <>
      <Descriptions
        bordered
        size="small"
        title="Latest Driver Performance"
        layout="vertical"
        column={{ lg: 2, md: 2, sm: 1, xs: 1 }}
      >
        <Descriptions.Item label="Date Added">
          {driverDetail.weeklyReport[0].date}
        </Descriptions.Item>
        <Descriptions.Item label="Feedback Status">
          {driverDetail.weeklyReport[0].feedbackStatus}
        </Descriptions.Item>
        <Descriptions.Item label="Key Focus Area">
          {driverDetail.weeklyReport[0].keyFocusArea}
        </Descriptions.Item>
        <Descriptions.Item label="Packages Delivered This Report">
          {driverDetail.weeklyReport[0].delivered}
        </Descriptions.Item>
      </Descriptions>
      <br />
      <Title
        strong
        level={5}
        style={{ display: "block", paddingBottom: "10px" }}
      >
        Driver Deliveries
      </Title>
      <DriverDeliveries driverStats={parseIndividualDriverReport(driverDetail.weeklyReport)}/>
      <br />
    </>
  );
}

export default DriverStats;
