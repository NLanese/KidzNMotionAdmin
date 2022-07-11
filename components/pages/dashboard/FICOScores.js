import React from "react";
import ContentCard from "@common/content/ContentCard";
import { Typography } from "antd";

import { Line } from "@ant-design/plots";

const { Text } = Typography;

function FICOScores({ performanceData }) {
  const data = [
    {
      year: "1991",
      FICO: 3,
    },
    {
      year: "1992",
      FICO: 4,
    },
    {
      year: "1993",
      FICO: 3.5,
    },
    {
      year: "1994",
      FICO: 5,
    },
    {
      year: "1995",
      FICO: 4.9,
    },
    {
      year: "1996",
      FICO: 6,
    },
    {
      year: "1997",
      FICO: 7,
    },
    {
      year: "1998",
      FICO: 9,
    },
    {
      year: "1999",
      FICO: 13,
    },
    {
      year: "1999",
      FICO: 8,
    },
  ];
  const config = {
    data,
    xField: "year",
    yField: "FICO",
    seriesField: "FICO",
    stepType: "vh",
  };
  return <Line {...config} />;
}

export default FICOScores;
