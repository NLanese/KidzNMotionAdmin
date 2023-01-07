import React, { useState, useEffect } from "react";
import styled from "styled-components";
import {
  Col,
  Row,
  Typography,
  Divider,
  Dropdown,
  Menu,
  Alert,
  Button,
  Result,
  Space,
  Tag,
} from "antd";
import ContentCard from "@common/content/ContentCard";
import LoadingBlock from "@common/LoadingBlock";
const { Text } = Typography;
import { EllipsisOutlined } from "@ant-design/icons";
import { NextSeo } from "next-seo";
import PageHeader from "@common/PageHeader";
import { userState } from "@atoms";
import { useRecoilValue } from "recoil";
import {
  getCheckoutURL,
  getBillingInformation,
  updateOrganizationSubscription,
} from "@helpers/billing";
import Router from "next/router";

var dateFormat = require("dateformat");

import BillingInformationRow from "@components/pages/billing/BillingInformationRow";

const BillingWrapper = styled.div`
  max-width: ${(props) => props.theme.contentSize.extraTight};
  margin: auto;
  .ant-typography strong {
    font-size: 16.5px;
  }

  @media (max-width: ${(props) => props.theme.breakPoints.sm}) {
    .ant-divider {
      margin: 2px 0px;
    }
  }
`;

const PaymentIcon = styled.div`
  width: 40px;
  & img {
    width: 100%;
  }
`;

const SubscriptionIcon = styled.div`
  width: 70px;
  & img {
    width: 100%;
  }
`;

const BillingRow = styled(Row)`
  padding: 10px 0px 10px;
  border-top: 1px solid ${(props) => props.theme.colors.backgroundColor};
  border-bottom: 1px solid ${(props) => props.theme.colors.backgroundColor};
  transition: ${(props) => props.theme.transitions.standard};
  a {
    text-decoration: none !important;
  }
  :hover {
    background: ${(props) => props.theme.colors.backgroundColor};
    transition: ${(props) => props.theme.transitions.standard};
  }
`;

function Billing() {
  const user = useRecoilValue(userState);
  const [loading, setLoading] = useState(false);
  const [onFreeTrial, setOnFreeTrial] = useState(true);
  const [billingInformation, setBillingInformation] = useState(null);

  const fetchAndSetBillingInformation = async () => {
    const billingInformation = await getBillingInformation();
    setBillingInformation(billingInformation);
  };

  useEffect(() => {
    if (!user.ownedOrganization) {
      Router.push("/");
    }

    // ALL FOR DEVELOPMENT PURPOSES
    if (user.ownedOrganization && user.ownedOrganization.stripeSubscriptionID) {
      setOnFreeTrial(false);
      fetchAndSetBillingInformation();
      return;
    }
  }, []);

  const updatePaymentStatus = async (sessionID) => {
    await updateOrganizationSubscription(sessionID);
    window.location = "/account/billing";
  };

  useEffect(() => {
    // Check for successful session
    const urlSearchParams = new URLSearchParams(window.location.search);
    const sessionID = urlSearchParams.get("session_id");
    const sessionResult = urlSearchParams.get("success");

    if (sessionResult === "true") {
      setLoading(true);
      setOnFreeTrial(false);
      updatePaymentStatus(sessionID);
    }
  }, []);

  const checkout = async () => {
    setLoading(true);
    const session = await getCheckoutURL();
    window.location = session.checkoutURL;
  };

  if (onFreeTrial) {
    return (
      <BillingWrapper>
        <NextSeo title="Billing" />
        <PageHeader title="Billing & Subscription" />
        <ContentCard>
          <Result
            title="Activate your subscription to manage your billing settings"
            extra={
              <Button
                type="primary"
                key="console"
                loading={loading}
                onClick={() => checkout()}
                size={"large"}
              >
                Actvate Subscription
              </Button>
            }
          />
        </ContentCard>
      </BillingWrapper>
    );
  }

  return (
    <BillingWrapper>
      <NextSeo title="Billing" />
      {!billingInformation ? (
        <LoadingBlock />
      ) : (
        <>
          <PageHeader title="Billing & Subscription" />
          {window.location.href.includes("activated") && (
            <Alert
              message="Welcome!"
              description="Your subscription has been activated! Thanks for being apart of the Kidz-N-Motion family."
              type="success"
              closable
              showIcon
            />
          )}
          {(billingInformation.subscription.status === "unpaid" ||
            billingInformation.subscription.status === "past_due") && (
            <Alert
              message="Heads Up"
              description="There was an issue with your last payment, please replace your credit card on file to avoid being locked out of your Kidz-N-Motion Account"
              type="warning"
              closable
              action={
                <Space>
                  <a
                    href={
                      billingInformation.sessionURL +
                      `/subscriptions/${billingInformation.subscription.id}/update-payment-method/changePaymentMethodFromHome`
                    }
                  >
                    <Button size="small" type="primary">
                      Replace Card
                    </Button>
                  </a>
                </Space>
              }
              showIcon
            />
          )}
          <br />
          <BillingInformationRow
            title="Payment methods"
            description="Manage how you pay your bills in Kidz-N-Motion App."
          >
            <>
              <ContentCard>
                <Row justify="space-between" align="middle">
                  <Col>
                    <Text strong>Default payment methods</Text>
                  </Col>
                  <Col>
                    <Text keyboard>USD</Text>
                  </Col>
                </Row>
                <Divider
                  plain={true}
                  style={{ border: "none", margin: "10px 0px" }}
                />
                <Row gutter={0} justify="flex-start" align="middle">
                  <Col span={20}>
                    <Space direction="horizontal" size={12}>
                      <PaymentIcon>
                        <img
                          src={`/payment-icons/cc-${billingInformation.paymentMethod.brand}.svg`}
                        />
                      </PaymentIcon>
                      <Space direction="vertical" size={3}>
                        <Text
                          style={{
                            fontWeight: "600",
                            textTransform: "capitalize",
                          }}
                        >
                          {billingInformation.paymentMethod.brand}{" "}
                          <Tag style={{ marginLeft: "5px" }} color="green">
                            Primary
                          </Tag>
                        </Text>
                        <Text type="secondary">
                          Ending in {billingInformation.paymentMethod.last4}
                        </Text>
                      </Space>
                    </Space>
                  </Col>
                  <Col span={4}>
                    <Dropdown
                      overlay={
                        <Menu
                          items={[
                            {
                              key: "1",
                              label: (
                                <a
                                  href={
                                    billingInformation.sessionURL +
                                    `/subscriptions/${billingInformation.subscription.id}/update-payment-method/changePaymentMethodFromHome`
                                  }
                                >
                                  Replace
                                </a>
                              ),
                            },
                          ]}
                        />
                      }
                      placement="bottom"
                    >
                      <EllipsisOutlined
                        style={{
                          fontSize: "23px",
                          float: "right",
                          cursor: "pointer",
                        }}
                      />
                    </Dropdown>
                  </Col>
                </Row>
                <br />
                <a
                  href={
                    billingInformation.sessionURL +
                    `/subscriptions/${billingInformation.subscription.id}/update-payment-method/changePaymentMethodFromHome`
                  }
                >
                  Replace credit card
                </a>
              </ContentCard>
              <ContentCard>
                <Space direction="vertical" size="small">
                  <Text strong>Billing currency</Text>
                  <Text type="secondary">
                    Your current billing currency is set to{" "}
                    <Text>USD (US Dollar)</Text>.
                  </Text>
                </Space>
              </ContentCard>
            </>
          </BillingInformationRow>

          <Row gutter={16}>
            <Col xs={24} md={7}>
              <ContentCard modifiers={["naked", "noSidePadding"]}>
                <Space direction="vertical" size="small">
                  <Text strong>Subscriptions</Text>
                  <Text type="secondary">
                    An overview of items that you’re billed for regularly, like
                    your Top App subscription and other recurring charges.
                  </Text>
                </Space>
              </ContentCard>
            </Col>
            <Col xs={24} md={{ span: 16, offset: 1 }}>
              <ContentCard>
                <Text strong>Your Subscriptions</Text>
                <Divider
                  plain={true}
                  style={{ border: "none", margin: "10px 0px" }}
                />
                <Row gutter={0} justify="flex-start" align="middle">
                  <Col span={20}>
                    <Space direction="horizontal" size={12}>
                      <SubscriptionIcon>
                        <img src="/logos/Main.png" />
                      </SubscriptionIcon>
                      <Space direction="vertical" size={3}>
                        <Text style={{ fontWeight: "600" }}>
                          Kidz-N-Motion Plan
                        </Text>
                        <Text type="secondary">
                          ${billingInformation.bills.planTotal / 100}.00 every{" "}
                          {billingInformation.bills.planIntervalCount}{" "}
                          {billingInformation.bills.planInterval}. Renews on{" "}
                          {dateFormat(
                            billingInformation.bills.cycle.end,
                            "mmmm dd,yyyy"
                          )}
                          .
                        </Text>
                      </Space>
                    </Space>
                  </Col>
                </Row>
                <Divider style={{ margin: "10px 0px" }} />
                <a href={billingInformation.sessionURL}>
                  View your subscription details
                </a>
              </ContentCard>
            </Col>
          </Row>
          <Divider />
          <Row gutter={16}>
            <Col xs={24} md={7}>
              <ContentCard modifiers={["naked", "noSidePadding"]}>
                <Space direction="vertical" size="small">
                  <Text strong>Bills</Text>
                  <Text type="secondary">
                    Your monthly bill is on a 30-day cycle. It includes your
                    Kidz-N-Motion App subscription, app charges, shipping
                    labels, and transaction fees.
                  </Text>
                </Space>
              </ContentCard>
            </Col>
            <Col xs={24} md={{ span: 16, offset: 1 }}>
              <ContentCard>
                <Text strong>
                  Current billing cycle:{" "}
                  {dateFormat(
                    billingInformation.bills.cycle.start,
                    "mmmm dd,yyyy"
                  )}
                  -{" "}
                  {dateFormat(
                    billingInformation.bills.cycle.end,
                    "mmmm dd,yyyy"
                  )}
                </Text>
                <Divider
                  plain={true}
                  style={{ border: "none", margin: "10px 0px" }}
                />
                <Row gutter={16} justify="space-between" align="middle">
                  <Col xs={12}>
                    <Text>Subscription charges</Text>
                  </Col>
                  <Col xs={12}>
                    <Text style={{ fontWeight: 600, float: "right" }}>
                      ${billingInformation.bills.planTotal / 100}.00
                    </Text>
                  </Col>
                </Row>
                <Divider style={{ margin: "10px 0px" }} />
                <Row gutter={16} justify="space-between" align="middle">
                  <Col xs={12}>
                    <Text style={{ fontWeight: 600 }}>Total charges</Text>
                  </Col>
                  <Col xs={12}>
                    <Text style={{ fontWeight: 600, float: "right" }}>
                      ${billingInformation.bills.planTotal / 100}.00
                    </Text>
                  </Col>
                </Row>
              </ContentCard>
              <ContentCard>
                <Text strong>Recent bills</Text>
                <Divider
                  plain={true}
                  style={{ border: "none", margin: "10px 0px" }}
                />
                {billingInformation.bills.invoices.map((invoiceObject, key) => {
                  return (
                    <a
                      target="_blank"
                      href={invoiceObject.invoiceURL}
                      rel="noopener noreferrer"
                      key={key}
                    >
                      <BillingRow
                        gutter={16}
                        justify="flex-start"
                        align="middle"
                      >
                        <Col xs={6}>
                          <Text style={{ fontWeight: 600 }}>Billing cycle</Text>
                        </Col>
                        <Col xs={8}>
                          <Text>
                            Created{" "}
                            {dateFormat(invoiceObject.created, "mmmm dd,yyyy")}
                          </Text>
                        </Col>
                        <Col xs={2}>
                          <Tag>{invoiceObject.status.toUpperCase()}</Tag>
                        </Col>
                        <Col xs={8}>
                          <Text style={{ fontWeight: 600, float: "right" }}>
                            ${invoiceObject.amount / 100}.00
                          </Text>
                        </Col>
                      </BillingRow>
                    </a>
                  );
                })}

                <br />
                <a href={billingInformation.sessionURL}>
                  View all billing history
                </a>
              </ContentCard>
              <ContentCard>
                <Text strong>Account credits</Text>
                <Divider
                  plain={true}
                  style={{ border: "none", margin: "10px 0px" }}
                />
                <Text>You do not have any account credits at this time.</Text>
              </ContentCard>
            </Col>
          </Row>
        </>
      )}
    </BillingWrapper>
  );
}

export default Billing;
