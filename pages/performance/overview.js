import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { Typography, DatePicker, Row, Col } from "antd";
import ContentCard from "@common/content/ContentCard";
import PageHeader from "@common/PageHeader";
import { FilterOutlined } from "@ant-design/icons";
import moment from "moment";
import LoadingBlock from "@common/LoadingBlock";

import { checkAuthorization } from "@helpers/authorization";
import { getUserDrivers } from "@helpers/drivers";
import { userState, driverState } from "@atoms";
import { useRecoilValue, useRecoilState } from "recoil";

import FICOScores from "@pages/dashboard/FICOScores";
import Deliveries from "@pages/dashboard/Deliveries";
import DriverPerformance from "@pages/dashboard/Demo2";
import Demo3 from "@pages/dashboard/Demo3";

const { RangePicker } = DatePicker;
const { Text } = Typography;

const PerformanceOverviewWrapper = styled.div`
  max-width: ${(props) => props.theme.contentSize.standard};
  margin: auto;
`;

const PerformanceRow = styled(Row)`
  .ant-typography {
    display: block;
    font-weight: 600;
    font-size: 15px;
    margin-bottom: 10px;
  }
`;

function PerformanceOverview() {
  const user = useRecoilValue(userState);
  const [drivers, setDrivers] = useRecoilState(driverState);

  const [initialLoad, setInitialLoading] = useState(true);
  const [performanceData, setPerformanceData] = useState([]);
  const [selectedDate, setSelectedDate] = useState([moment(), moment()]);

  const fetchDriverInformation = async () => {
    const driverInformation = await getUserDrivers(user.role);

    setDrivers(driverInformation);
    setInitialLoading(false);
  };

  useEffect(() => {
    checkAuthorization(user.role, "OWNER");
    fetchDriverInformation();
  }, []);

  return (
    <PerformanceOverviewWrapper>
      <PageHeader title="Performance Overview" />
      <ContentCard>
        <Text strong style={{ marginBottom: "14px", marginRight: "10px" }}>
          <FilterOutlined /> Filters:
        </Text>
        <RangePicker
          value={selectedDate}
          onChange={(value) => setSelectedDate(value)}
          size="large"
          format={"MM/DD/YYYY"}
        />
      </ContentCard>
      {initialLoad ? (
        <LoadingBlock />
      ) : (
        <PerformanceRow gutter={[16, 4]}>
          <Col xs={24} sm={12}>
            <ContentCard>
              <Text strong>Team FICO Scores</Text>
              <FICOScores performanceData={performanceData} />
            </ContentCard>
          </Col>
          <Col xs={24} sm={12}>
            <ContentCard>
              <Text strong>Demo Chart</Text>

              <Deliveries performanceData={performanceData} />
            </ContentCard>
          </Col>
          <Col xs={24} sm={24}>
            <ContentCard>
              <Text strong>Demo Chart 2</Text>

              <DriverPerformance />
            </ContentCard>
          </Col>
          <Col xs={24} sm={24}>
            <ContentCard>
              <Text strong>Demo Chart 3</Text>

              <Demo3 />
            </ContentCard>
          </Col>
        </PerformanceRow>
      )}
    </PerformanceOverviewWrapper>
  );
}

export default PerformanceOverview;
