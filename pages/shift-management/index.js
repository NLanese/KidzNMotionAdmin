import React, { useState, useEffect } from "react";

import { NextSeo } from "next-seo";
import styled from "styled-components";
import PageHeader from "@common/PageHeader";
import moment from "moment";

import LoadingBlock from "@common/LoadingBlock";
import ContentCard from "@common/content/ContentCard";

import { userState, driverState, assetState } from "@atoms";
import { useRecoilValue, useRecoilState } from "recoil";

import { getAssets } from "@helpers/assets";
import { getUserDrivers } from "@helpers/drivers";

import { InfoCircleOutlined } from "@ant-design/icons";
import { Typography, Empty } from "antd";
import { getShiftByDate } from "@helpers/shifts";

import { withRouter } from "next/router";

import ShiftDateSelection from "@pages/shifts/ShiftDateSelection";
import ShiftDetail from "@pages/shifts/ShiftDetail";
import ShiftEdit from "@pages/shifts/ShiftEdit/index";

const { Text } = Typography;

const ShiftManagementWrapper = styled.div`
  max-width: ${(props) => props.theme.contentSize.standard};
  margin: auto;
`;

function ShiftManagement({ router }) {
  const user = useRecoilValue(userState);
  const [drivers, setDrivers] = useRecoilState(driverState);
  const [assets, setAssets] = useRecoilState(assetState);

  const [initialLoading, setInitialDataLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(moment());
  const [shiftData, setShiftData] = useState(null);
  const [shiftDataLoading, setShiftDataLoading] = useState(true);
  const [canEditShift, setCanEditShift] = useState(false);

  const fetchInitialInformation = async () => {
    setInitialDataLoading(true);

    const driverInformation = await getUserDrivers(user.role);
      setDrivers(driverInformation);

    const assetInformation = await getAssets(user.role);
    setAssets(assetInformation);
    setInitialDataLoading(false);
  };

  useEffect(() => {
    fetchInitialInformation();
  }, []);

  const fetchShiftData = async (formattedDate) => {
    setShiftDataLoading(true);
    let allShiftData = await getShiftByDate(user.role, user.id, true, formattedDate);

    if (allShiftData) {
      let shift = allShiftData.filter(
        (shiftObject) => shiftObject.date === formattedDate
      )[0];

      let canEdit =
        selectedDate.startOf("day").isAfter(moment().startOf("day")) ||
        selectedDate.startOf("day").isSame(moment().startOf("day"));
      setCanEditShift(canEdit);

      if (shift) {
        let clonedShift = structuredClone(shift);
        setShiftData(clonedShift);
      } else {
        setShiftData(null);
      }
    } else {
      setShiftData(null);
    }
    setShiftDataLoading(false);
  };

  useEffect(() => {
    let formattedDate = selectedDate.format("MM/DD/YYYY");
    fetchShiftData(formattedDate);
  }, [selectedDate]);

  const renderShiftData = () => {
    if (shiftDataLoading) {
      return <LoadingBlock />;
    }
    if (shiftData) {
      if (canEditShift) {
        return (
          <>
            <ShiftEdit
              shiftObject={shiftData}
              drivers={drivers}
              user={user}
              assets={assets}
              date={selectedDate.format("MM/DD/YYYY")}
            />
          </>
        );
      } else {
        if (shiftData.allDriverShifts.length == 0) {
          return (
            <ContentCard>
              <Empty
                description="No shift data for this day."
                imageStyle={{ margin: "40px 0px" }}
              />
              <br />
              <br />
            </ContentCard>
          );
        } else {
          return (
            <ContentCard>
              <ShiftDetail shiftObject={shiftData} />
            </ContentCard>
          );
        }
      }
    } else {
      if (canEditShift) {
        return (
          <>
            <ShiftEdit
              shiftObject={shiftData}
              drivers={drivers}
              assets={assets}
              user={user}
              date={selectedDate.format("MM/DD/YYYY")}
            />
          </>
        );
      } else {
        return (
          <ContentCard>
            <Empty
              description="No shift data for this day."
              imageStyle={{ margin: "40px 0px" }}
            />
            <br />
            <br />
          </ContentCard>
        );
      }
    }
  };
  return (
    <ShiftManagementWrapper>
      <NextSeo title="Shift Management" />
      <PageHeader title="Shift Management " />
      {initialLoading ? (
        <>
          <LoadingBlock table={true} />
          <LoadingBlock />
        </>
      ) : (
        <>
          <ContentCard>
            <Text style={{ fontWeight: 600 }}>
              <InfoCircleOutlined /> Select a date to designate your driver's
              shifts and assign their assets for the day.
            </Text>
            <ShiftDateSelection
              setSelectedDate={setSelectedDate}
              selectedDate={selectedDate}
            />
          </ContentCard>
          {renderShiftData()}
        </>
      )}
    </ShiftManagementWrapper>
  );
}

export default withRouter(ShiftManagement);
