import React, { useEffect } from "react";

import { getAccidents } from "@helpers/accidents";
import { accidentState, userState } from "@atoms";
import { useRecoilValue, useRecoilState } from "recoil";

import { Typography, List } from "antd";

import BasicLink from "@common/BasicLink";

function DriverAccidentHistory({ driverDetail }) {
  const [accidents, setAccidents] = useRecoilState(accidentState);
  const user = useRecoilValue(userState);

  const fetchAccidentData = async () => {
    if (!accidents) {
      const accidentsData = await getAccidents(user.role);

      setAccidents(accidentsData);
    }
  };

  useEffect(() => {
    fetchAccidentData();
  }, []);

  const getDriverAccidents = () => {
    if (!accidents) return [];

    return accidents.filter((accidentObject) => {
      return accidentObject.driver.id === driverDetail.id;
    });
  };

  return (
    <>
      <List
        className="demo-loadmore-list"
        itemLayout="horizontal"
        loading={!accidents}
        dataSource={getDriverAccidents()}
        renderItem={(accidentObject) => (
          <List.Item
            key={accidentObject.id}
            actions={[
              <BasicLink   key={accidentObject.id}  href={`/drivers/accidents?id=${accidentObject.id}`}>
                See Details
              </BasicLink>,
            ]}
          >
            <List.Item.Meta
              title={`(${accidentObject.date}) - ${accidentObject.location}`}
            />
          </List.Item>
        )}
      />
    </>
  );
}

export default DriverAccidentHistory;
