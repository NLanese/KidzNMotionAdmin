import React  from "react";
import { DualAxes } from "@ant-design/plots";

const DriverDeliveries = ({ driverStats }) => {
  driverStats = driverStats.filter((statObject) => {
    return statObject.delivered;
  });
  const config = {
    data: [driverStats, driverStats],
    xField: "dateString",
    yField: ["delivered", "deliveryCompletionRate"],
    conversionTag: {},
    xAxis: {
      label: {
        autoHide: true,
        autoRotate: false,
      },
    },
    geometryOptions: [
      {
        geometry: "column",
      },
      {
        geometry: "line",
        lineStyle: {
          lineWidth: 4,
        },
      },
    ],
    meta: {
      delivered: {
        alias: "Packages Delivered",
      },
      deliveryCompletionRate: {
        alias: "Delivery Completion Rate %",
        min: 0,
        max: 100,
      },
    },
    smooth: true,
    animation: {
      appear: {
        animation: 'path-in',
        duration: 5000,
      },
    },
  };
  return <DualAxes {...config} />;
};

export default DriverDeliveries;
