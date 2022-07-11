import React, { useState, useEffect } from "react";

import { NextSeo } from "next-seo";
import PageHeader from "@common/PageHeader";

import LoadingBlock from "@common/LoadingBlock";
import ContentCard from "@common/content/ContentCard";

import { getUserDrivers } from "@helpers/drivers";
import { userState, driverState } from "@atoms";
import { useRecoilValue, useRecoilState } from "recoil";

import { withRouter } from "next/router";

import DriverTable from "@components/pages/drivers/list/DriverTable";
import DriverDetail from "@components/pages/drivers/list/DriverDetail";

function ListDrivers({ router }) {
  const user = useRecoilValue(userState);
  const [drivers, setDrivers] = useRecoilState(driverState);

  const [loading, setLoading] = useState(true);
  const [driverDetail, setDriverDetial] = useState(null);

  const fetchDriverInformation = async () => {
    const driverInformation = await getUserDrivers(user.role);

    setDrivers(driverInformation);
    setLoading(false);
  };

  useEffect(() => {
    fetchDriverInformation();
  }, []);


  useEffect(() => {
    setDriverDetial(null);
    if (router.query.id && drivers) {
      drivers.map((driverObject) => {
        if (driverObject.transporterId === router.query.id) {
          setDriverDetial(driverObject);
        }
      });
    }
  }, [router, drivers]);

  return (
    <>
      <NextSeo title="Drivers" />
      <>
        <PageHeader
          title="Drivers"
          noBottomBorder={true}
          createURL="/drivers/upload"
          createTitle="Create Drivers"
        />
        {loading ? (
          <LoadingBlock table={true} />
        ) : (
          <ContentCard modifiers={["tightPadding"]}>
            <DriverTable />
            <DriverDetail driverDetail={driverDetail} />
          </ContentCard>
        )}
      </>
    </>
  );
}

export default withRouter(ListDrivers);
