import React from "react";
import { Drawer, Descriptions, Button, Space, Divider, Tabs } from "antd";

import Router from "next/router";
import styled from "styled-components";
import EditDriverForm from "@forms/drivers/EditDriverForm";

import DriverStats from "./DriverStats";
import DriverAccidentHistory from "./DriverAccidentHistory";

const { TabPane } = Tabs;

const DriverDetailWrapper = styled.div``;

function DriverDetail({ driverDetail }) {
  return (
    <DriverDetailWrapper>
      <Drawer
        title={
          driverDetail
            ? `${driverDetail.firstname + " " + driverDetail.lastname}`
            : "-"
        }
        placement="right"
        width={600}
        onClose={() => Router.push("/drivers/list", null, { shallow: true })}
        visible={driverDetail !== null}
      >
        {driverDetail && (
          <>
            <Descriptions
              bordered
              size="small"
              title="Driver Info"
              layout="vertical"
              column={{ lg: 2, md: 2, sm: 1, xs: 1 }}
            >
              <Descriptions.Item label="First Name">
                {driverDetail.firstname}
              </Descriptions.Item>
              <Descriptions.Item label="Last Name">
                {driverDetail.lastname}
              </Descriptions.Item>
              <Descriptions.Item label="Email">
                {driverDetail.email}
              </Descriptions.Item>
              <Descriptions.Item label="Driver ID">
                {driverDetail.transporterId}
              </Descriptions.Item>
              <Descriptions.Item label="Phone Number">
                {driverDetail.phoneNumber}
              </Descriptions.Item>
            </Descriptions>
            <Divider />
            <Space>
              <Button
                type="primary"
                size="middle"
                onClick={() =>
                  Router.push(
                    `/drivers/list?id=${driverDetail.transporterId}&edit=true`,
                    null,
                    { shallow: true }
                  )
                }
              >
                Edit Driver
              </Button>

              <Button type="ghost" size="middle" disabled>
                Reset Password
              </Button>
            </Space>
            <Divider />
            <Tabs defaultActiveKey="1">
              <TabPane tab="Driver Stats" key="1">
                <DriverStats driverDetail={driverDetail} />
              </TabPane>
              <TabPane tab="Accident History" key="2">
                <DriverAccidentHistory driverDetail={driverDetail} />
              </TabPane>
            </Tabs>
            <Drawer
              title={
                driverDetail
                  ? `Edit ${
                      driverDetail.firstname + " " + driverDetail.lastname
                    }`
                  : "-"
              }
              width={520}
              closable={true}
              onClose={() =>
                Router.push(
                  "/drivers/list?id=" + driverDetail.transporterId,
                  null,
                  { shallow: true }
                )
              }
              visible={Router.query.edit}
            >
              {driverDetail && (
                <EditDriverForm
                  driverDetail={driverDetail}
                  initialValues={{
                    firstName: driverDetail.firstname,
                    lastName: driverDetail.lastname,
                    email: driverDetail.email,
                    phoneNumber: driverDetail.phoneNumber,
                  }}
                />
              )}
            </Drawer>
          </>
        )}
      </Drawer>
    </DriverDetailWrapper>
  );
}

export default DriverDetail;
