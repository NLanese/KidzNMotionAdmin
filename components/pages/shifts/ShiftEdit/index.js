import React, { useEffect, useState } from "react";
import styled from "styled-components";

import AssignDrivers from "./AssignDrivers";
import AssignAssets from "./AssignAssets";

import SubmitShift from "@pages/shifts/ShiftEdit/SubmitShift";
import ShiftMessage from "@pages/shifts/ShiftEdit/ShiftMessage";
import { Spin, message } from "antd";

import { DYNAMIC_CREATE_OR_UPDATE_SHIFT } from "@graphql/operations";
import { useMutation } from "@apollo/client";

const ShiftEditWrapper = styled.div`
  padding: 10px 0px;
  .ant-pagination {
    display: none;
  }
`;

function ShiftEdit({ shiftObject, drivers, assets, user, date }) {
  const [shiftSubmitLoading, setShiftSubmitLoading] = useState(false);
  const [formattedShiftData, setFormattedShiftData] = useState(null);
  const [driversOnShift, setDriversOnShift] = useState([]);
  const [driverAssets, setDriverAssets] = useState({
    assigned: {},
    allAssets: [],
  });
  const [shiftMessage, setShiftMessage] = useState(
    "Drive safe and have a great day!"
  );

    // Mutations
    const [createOrUpdateShift, {}] = useMutation(DYNAMIC_CREATE_OR_UPDATE_SHIFT);

  useEffect(() => {
    setFormattedShiftData(null);
    let formattedData = structuredClone(shiftObject);

    if (shiftObject) {
      // Set initial drivers on shift
      let initialDriversOnShift = [];
      formattedData.allDriverShifts.map((shiftRow) => {
        initialDriversOnShift.push(shiftRow.driver.id);
      });
      setDriversOnShift(initialDriversOnShift);

      let newDriverAssetData = { assigned: {}, allAssets: [] };
      // Assign initial driver assets
      formattedData.allDriverShifts.map((shiftRow) => {
        newDriverAssetData.assigned[shiftRow.driver.transporterId] = {};
        shiftRow.devices.map((shiftDevice) => {
          newDriverAssetData.allAssets.push(shiftDevice.id);
          newDriverAssetData.assigned[shiftRow.driver.transporterId][
            shiftDevice.type
          ] = shiftDevice.id;
        });
      });
      setDriverAssets(newDriverAssetData);
    }
    setFormattedShiftData(formattedData);
  }, [shiftObject]);

  const assignAssetToDriver = (driverTransporterID, assetType, value) => {
    console.log(driverTransporterID, assetType, value)
    let clonedDriverAssets = structuredClone(driverAssets);
    if (!clonedDriverAssets.assigned[driverTransporterID]) {
      clonedDriverAssets.assigned[driverTransporterID] = {};
      clonedDriverAssets.assigned[driverTransporterID][assetType] = value;
    } else {
      clonedDriverAssets.assigned[driverTransporterID][assetType] = value;
    }
    clonedDriverAssets.allAssets = [];
    for (var driverKey in clonedDriverAssets.assigned) {
      for (var assetTypeKey in clonedDriverAssets.assigned[driverKey]) {
        clonedDriverAssets.allAssets.push(
          clonedDriverAssets.assigned[driverKey][assetTypeKey]
        );
      }
    }

    setDriverAssets(clonedDriverAssets);
  };

  const submitShiftData = async () => {
    setShiftSubmitLoading(true);

    let variables = {
      id: shiftObject ? shiftObject.id : null,
      date: date,
      dspId: user.dsp.id,
      role: user.role,
      token: localStorage.getItem("token"),
      allDriverShifts: [],
    };

    driversOnShift.map((driverOnShiftID) => {
      let driverShiftObject = {
        driver: drivers.filter(
          (driverObject) => driverObject.id === driverOnShiftID
        )[0],
        devices: [],
      };

      if (driverShiftObject.driver) {
        if (driverAssets.assigned[driverShiftObject.driver.transporterId]) {
          for (var assetTypeKey in driverAssets.assigned[
            driverShiftObject.driver.transporterId
          ]) {
            let assetDetailObject = assets.filter(
              (assetObject) =>
                assetObject.id ===
                driverAssets.assigned[driverShiftObject.driver.transporterId][
                  assetTypeKey
                ]
            )[0];

            if (assetDetailObject) {
              driverShiftObject.devices.push(assetDetailObject);
            }
          }
        }

        variables.allDriverShifts.push(driverShiftObject);
      }
      return driverOnShiftID;
    });

    await createOrUpdateShift({
      variables: variables,
    })
      .then(async (resolved) => {
        message.success("Shift Saved");
        setShiftSubmitLoading(false);
      })
      .catch((error) => {
        message.error("Sorry, there was an error on our end");
        setShiftSubmitLoading(false);
      });

  };

  return (
    <Spin spinning={shiftSubmitLoading}>
      <ShiftEditWrapper>
        <AssignDrivers
          drivers={drivers}
          driversOnShift={driversOnShift}
          setDriversOnShift={setDriversOnShift}
        />
        <AssignAssets
          assets={assets}
          drivers={drivers}
          driverAssets={driverAssets}
          driversOnShift={driversOnShift}
          setDriverAssets={setDriverAssets}
          assignAssetToDriver={assignAssetToDriver}
        />
        <ShiftMessage
          setShiftMessage={setShiftMessage}
          shiftMessage={shiftMessage}
        />
        <SubmitShift
          driversOnShift={driversOnShift}
          loading={shiftSubmitLoading}
          submitShiftData={submitShiftData}
        />
      </ShiftEditWrapper>
    </Spin>
  );
}

export default ShiftEdit;
