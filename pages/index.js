import React, { useEffect } from "react";
import styled from "styled-components";
import {
  Col,
  Row,
  Typography,
  Space,
  Divider,
  Statistic,
  Alert,
  Button,
} from "antd";
import ContentCard from "@common/content/ContentCard";
import PageHeader from "@common/PageHeader";

import { userState, driverState, assetState, accidentState } from "@atoms";
import { useRecoilValue, useRecoilState } from "recoil";

import { getAccidents } from "@helpers/accidents";
import { getUserDrivers } from "@helpers/drivers";
import { getAssets } from "@helpers/assets";

import { getCheckoutURL } from "@helpers/billing";

import {
  InfoCircleOutlined,
  CommentOutlined,
  TableOutlined,
  ContainerOutlined,
} from "@ant-design/icons";

import BasicLink from "@common/BasicLink";

const { Text, Title, Link } = Typography;

const IndexWrapper = styled.div`
  max-width: 800px;
  margin: auto;
`;

function Index() {
  const user = useRecoilValue(userState);

  const [assets, setAssets] = useRecoilState(assetState);
  const [drivers, setDrivers] = useRecoilState(driverState);
  const [accidents, setAccidents] = useRecoilState(accidentState);

  const checkout = async () => {
    const session = await getCheckoutURL();
    if (!session) {
    } else {
      window.location = session.checkoutURL;
    }
  };

  const renderSignUpTag = () => {
    if (user.role !== "OWNER") return;
    if (!user.dsp) return;
    if (user.dsp.paid) return;
    if (localStorage.getItem("stripeSessionID")) return;

    if (user.dsp.accountStanding === "Free") {
      let daysLeft = parseInt(
        16 -
          (new Date().getTime() - new Date(user.dsp.createdAt).getTime()) /
            (1000 * 3600 * 24)
      );
      return (
        <Col xs={24} sm={24}>
          <Alert
            message={`${daysLeft} Days Left On Trial (Activate)`}
            description="Activate your subscription to manage your team and get the most out of Tom App"
            type="info"
            showIcon
            action={
              <Space>
                <Button onClick={() => checkout()} size="small" type="primary">
                  Activate
                </Button>
              </Space>
            }
          />
          <br />
        </Col>
      );
    }
  };

  const fetchInitialData = async () => {
    if (!accidents) {
      const accidentsData = await getAccidents(user.role);
      setAccidents(accidentsData);
    }
    if (!drivers) {
      const driverData = await getUserDrivers(user.role);
      setDrivers(driverData);
    }
    if (!assets) {
      const assetsData = await getAssets(user.role);
      setAssets(assetsData);
    }
  };

  useEffect(() => {
    fetchInitialData();
  }, []);

  return (
    <IndexWrapper>
      <PageHeader title="Welcome To TOM " />
      <Row gutter={[16, 3]}>
        {renderSignUpTag()}
        <Col xs={24} sm={8}>
          <ContentCard>
            <Space direction="vertical" size={9} style={{ width: "100%" }}>
              <Statistic
                title="Drivers in Organization"
                value={drivers ? drivers.length : "-"}
                precision={0}
                valueStyle={{ color: "#222" }}
              />
              <Divider style={{ margin: "4px" }} />
              <BasicLink href="/drivers/upload">
                <Link type="link">Add more +</Link>
              </BasicLink>
            </Space>
          </ContentCard>
        </Col>
        <Col xs={24} sm={8}>
          <ContentCard>
            <Space direction="vertical" size={9} style={{ width: "100%" }}>
              <Statistic
                title="Assets in Organization"
                value={assets ? assets.length : "-"}
                precision={0}
                valueStyle={{ color: "#222" }}
              />
              <Divider style={{ margin: "4px" }} />
              <BasicLink href="/assets/upload">
                <Link type="link">Add more +</Link>
              </BasicLink>
            </Space>
          </ContentCard>
        </Col>
        <Col xs={24} sm={8}>
          <ContentCard>
            <Space direction="vertical" size={9} style={{ width: "100%" }}>
              <Statistic
                title="Total Accidents"
                value={accidents ? accidents.length : "-"}
                precision={0}
                valueStyle={{ color: "#222" }}
              />
              <Divider style={{ margin: "4px" }} />
              <BasicLink href="/drivers/accidents">
                <Link type="link">See report</Link>
              </BasicLink>
            </Space>
          </ContentCard>
        </Col>
        <Col xs={24} sm={24}>
          <ContentCard>
            <Space direction="vertical">
              <Title style={{ margin: "0px" }} level={5}>
                <TableOutlined /> Assign your drivers to their shifts
              </Title>
              <Text>
                Manage your driver's shifts and manage their assets / devices
                for their drive.
              </Text>
              <BasicLink href="/shift-management">
                <Link type="link">Assign shift</Link>
              </BasicLink>
            </Space>
          </ContentCard>
        </Col>
        <Col xs={24} sm={24}>
          <ContentCard>
            <Space direction="vertical">
              <Title style={{ margin: "0px" }} level={5}>
                <InfoCircleOutlined /> Learn how to make the most out of Tom App
              </Title>
              <Text>
                We’ve got dozens of free and tutorials for all features or
                functionality your team needs.
              </Text>
              <BasicLink href="/support">
                <Link type="link">Learn more</Link>
              </BasicLink>
            </Space>
          </ContentCard>
        </Col>
        <Col xs={24} sm={12}>
          <ContentCard>
            <Space direction="vertical">
              <Title style={{ margin: "0px" }} level={5}>
                <CommentOutlined /> Stay in touch with your team
              </Title>
              <BasicLink href="/messaging">
                <Link type="link">Get started</Link>
              </BasicLink>
            </Space>
          </ContentCard>
        </Col>
        <Col xs={24} sm={12}>
          <ContentCard>
            <Space direction="vertical">
              <Title style={{ margin: "0px" }} level={5}>
                <ContainerOutlined /> Keep your company scorecards up to date
              </Title>
              <BasicLink href="/account/company-preferences">
                <Link type="link">Get started</Link>
              </BasicLink>
            </Space>
          </ContentCard>
        </Col>
      </Row>
    </IndexWrapper>
  );
}

export default Index;
