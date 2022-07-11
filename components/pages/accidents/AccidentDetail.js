import React from "react";
import { Drawer, Descriptions, Divider, Typography, Tabs, Image } from "antd";

import Router from "next/router";
import styled from "styled-components";
import BasicLink from "@common/BasicLink";
import { LinkOutlined } from "@ant-design/icons";

const { Title } = Typography;
const { TabPane } = Tabs;

var dateFormat = require("dateformat");

const AccidentDetailWrapper = styled.div``;

const AccidentImageGroup = styled.div`
  .ant-image {
    margin-right: 10px;
    border-radius: 5px;
  }
  img {
    border-radius: 6px;
  }
`;

function MainDetails({ accidentDetail }) {
  // Takes all possible actions before combos to return a readable description
  const handleMainActionBefore = (action) => {
    console.log(action);
    if (!action || action == "EMPTY") {
      return "No information provided";
    } else if (action === "parked-and-occupied") {
      return "Driver was sitting in his/her car parked when the accident occurred";
    } else if (action === "made-right-turn") {
      return "Driver first made a right turn";
    } else if (action === "made-left-turn") {
      return "Driver first made a left turn";
    } else if (action === "driving-straight") {
      return "Driver was proceeding straight along the road";
    }
    // if (action ===)
  };
  const renderOtherActions = (action) => {
    if (!action || action == "EMPTY") {
      return null;
    } else if (action === "4-way-intersection") {
      return <p>Occurred at a Four-Way-Stop</p>;
    } else if (action === "trafficSignal") {
      return <p>Street Light / Traffic Sign was involved</p>;
    } else if (action === "Yellow-Red") {
      return (
        <p>
          Traffic Light was turning from yellow to red at the time of the
          accident
        </p>
      );
    } else if (action === "Green-Red") {
      return (
        <p>
          Traffic Light was turning from green to red at the time of the
          accident
        </p>
      );
    } else {
      return <p>{action}</p>;
    }
  };
  // Returns the appropriate String to mimic hasLogo Value
  const handleHasLogo = (value) => {
    if (!value) {
      return "No Amazon Logo at the scene of the accident";
    } else {
      return "Driver had Amazon Logo on Clothes or Vehicle";
    }
  };

  // Checks any value. If it is null or undefined, instead returns "Not Provided"
  const nullCheck = (val) => {
    if (typeof val === "undefined" || typeof val === null) {
      return "Not Provided";
    }
    if (val === null || val === "undefined" || val === "EMPTY") {
      return "Not Provided";
    } else return val;
  };

  return (
    <>
      {accidentDetail.accident_report.bystander.present === "yes" && (
        <>
          <Descriptions
            title="Bystander"
            bordered
            size="small"
            layout="vertical"
            column={{ lg: 2, md: 2, sm: 1, xs: 1 }}
          >
            <Descriptions.Item label="Present">
              {accidentDetail.accident_report.bystander.present.toUpperCase()}
            </Descriptions.Item>
            <Descriptions.Item label="Name">
              {accidentDetail.accident_report.bystander.fullname}
            </Descriptions.Item>
            <Descriptions.Item label="Phone Number">
              {accidentDetail.accident_report.bystander.phoneNumber}
            </Descriptions.Item>
          </Descriptions>
          <Divider />
        </>
      )}
      {accidentDetail.accident_report.police_report.filed === "yes" && (
        <>
          <Descriptions
            title="Police Report"
            bordered
            size="small"
            layout="vertical"
            column={{ lg: 2, md: 2, sm: 1, xs: 1 }}
          >
            <Descriptions.Item label="Filled">
              {accidentDetail.accident_report.police_report.filed}
            </Descriptions.Item>
            <Descriptions.Item label="Officer Name">
              {accidentDetail.accident_report.police_report.officer_name}
            </Descriptions.Item>
            <Descriptions.Item label="Officer Township">
              {accidentDetail.accident_report.police_report.officer_township}
            </Descriptions.Item>
            <Descriptions.Item label="Report Number">
              {accidentDetail.accident_report.police_report.report_number}
            </Descriptions.Item>
          </Descriptions>
          <Divider />
        </>
      )}

      <Descriptions
        title="Prior Actions Taken"
        bordered
        size="small"
        layout="vertical"
        column={{ lg: 2, md: 2, sm: 1, xs: 1 }}
      >
        <Descriptions.Item label="Main">
          {handleMainActionBefore(
            accidentDetail.before_accident_report.main_action
          )}
        </Descriptions.Item>
        <Descriptions.Item label="Setting 1">
          {renderOtherActions(accidentDetail.before_accident_report.setting1)}
        </Descriptions.Item>
        <Descriptions.Item label="Setting 2">
          {renderOtherActions(accidentDetail.before_accident_report.setting2)}
        </Descriptions.Item>
        <Descriptions.Item label="Specifics">
          {renderOtherActions(accidentDetail.before_accident_report.specifics)}
        </Descriptions.Item>
      </Descriptions>
      <Divider />
      <Descriptions
        title="Weather & Distractions"
        bordered
        size="small"
        layout="vertical"
        column={{ lg: 2, md: 2, sm: 1, xs: 1 }}
      >
        <Descriptions.Item label="Distraction">
          {nullCheck(accidentDetail.weather_and_distractions.distraction)}
        </Descriptions.Item>
        <Descriptions.Item label="Road Conditions">
          {nullCheck(accidentDetail.weather_and_distractions.slippery)}
        </Descriptions.Item>
        <Descriptions.Item label="Weather">
          {nullCheck(accidentDetail.weather_and_distractions.weather)}
        </Descriptions.Item>
      </Descriptions>
    </>
  );
}

function PedestrianDetails({ accidentDetail }) {
  const renderInjuryAccidents = () => {
    return accidentDetail.injuryAccidents.map((injuryAccidentObject, index) => {
      return (
        <div key={injuryAccidentObject.id}>
          <Title level={5}>
            {"Pedestrian Injury #" + (index + 1).toString()}
          </Title>
          <Title level={5}>Injury Images</Title>
          <AccidentImageGroup>
            <Image.PreviewGroup>
              <Image
                width={150}
                src="https://cdn.abcotvs.com/dip/images/10181027_013121-wabc-mta-car-crash-img.jpg"
              />
              <Image
                width={150}
                src="https://cdn.abcotvs.com/dip/images/10181027_013121-wabc-mta-car-crash-img.jpg"
              />
            </Image.PreviewGroup>
          </AccidentImageGroup>
          <Divider />
          <Descriptions
            title="Contact Info"
            bordered
            size="small"
            layout="vertical"
            column={{ lg: 2, md: 2, sm: 1, xs: 1 }}
          >
            <Descriptions.Item label="Address">
              {injuryAccidentObject.contact_info.address}
            </Descriptions.Item>
            <Descriptions.Item label="Phone Number">
              {injuryAccidentObject.contact_info.phone_number}
            </Descriptions.Item>
            <Descriptions.Item label="First Name">
              {injuryAccidentObject.contact_info.firstname}
            </Descriptions.Item>
            <Descriptions.Item label="Last Name">
              {injuryAccidentObject.contact_info.lastname}
            </Descriptions.Item>
          </Descriptions>

          <Divider />
          <Descriptions
            title="Injury Report"
            bordered
            size="small"
            layout="vertical"
            column={{ lg: 2, md: 2, sm: 1, xs: 1 }}
          >
            <Descriptions.Item label="Concussion">
              {injuryAccidentObject.injury_report.concussion.toUpperCase()}
            </Descriptions.Item>
            <Descriptions.Item label="Fatal">
              {injuryAccidentObject.injury_report.fatal ? "NO" : "YES"}
            </Descriptions.Item>
            <Descriptions.Item label="Fracture">
              {injuryAccidentObject.injury_report.fracture.toUpperCase()}
            </Descriptions.Item>
            <Descriptions.Item label="Life Threatening">
              {injuryAccidentObject.injury_report.life_threatening.toUpperCase()}
            </Descriptions.Item>
            <Descriptions.Item label="Loss Of Consciousness">
              {injuryAccidentObject.injury_report.loss_of_con.toUpperCase()}
            </Descriptions.Item>
            <Descriptions.Item label="Needs Medical Attention">
              {injuryAccidentObject.injury_report.medical_attention.toUpperCase()}
            </Descriptions.Item>
            <Descriptions.Item label="Pain Level">
              {injuryAccidentObject.pain_level}
            </Descriptions.Item>
          </Descriptions>
          <Divider />
          <Descriptions
            title="Injured Areas"
            bordered
            size="small"
            layout="vertical"
            column={{ lg: 2, md: 2, sm: 1, xs: 1 }}
          >
            <Descriptions.Item label="Groin">
              {injuryAccidentObject.injured_areas.groin
                .toString()
                .toUpperCase()}
            </Descriptions.Item>

            <Descriptions.Item label="Head">
              {injuryAccidentObject.injured_areas.head.toString().toUpperCase()}
            </Descriptions.Item>
            <Descriptions.Item label="Legs">
              {injuryAccidentObject.injured_areas.leg.toString().toUpperCase()}
            </Descriptions.Item>
            <Descriptions.Item label="Lower Back">
              {injuryAccidentObject.injured_areas.lowerBack
                .toString()
                .toUpperCase()}
            </Descriptions.Item>
            <Descriptions.Item label="Neck">
              {injuryAccidentObject.injured_areas.neck.toString().toUpperCase()}
            </Descriptions.Item>
          </Descriptions>

          <Divider />
        </div>
      );
    });
  };
  return <>{renderInjuryAccidents()}</>;
}

function VehicleCollisionDetails({ accidentDetail }) {
  const renderCollisionAccidents = () => {
    return accidentDetail.collisionAccidents.map((collisionObject, index) => {
      return (
        <div key={collisionObject.id}>
          <Title level={5}>
            {"Vehicle Collision #" + (index + 1).toString()}
          </Title>
          <Title level={5}>Collision Images</Title>
          <AccidentImageGroup>
            <Image.PreviewGroup>
              <Image
                width={150}
                src="https://cdn.abcotvs.com/dip/images/10181027_013121-wabc-mta-car-crash-img.jpg"
              />
              <Image
                width={150}
                src="https://cdn.abcotvs.com/dip/images/10181027_013121-wabc-mta-car-crash-img.jpg"
              />
            </Image.PreviewGroup>
          </AccidentImageGroup>
          <Divider />
          <Descriptions
            title="Contact Info"
            bordered
            size="small"
            layout="vertical"
            column={{ lg: 2, md: 2, sm: 1, xs: 1 }}
          >
            <Descriptions.Item label="First Name">
              {collisionObject.contact_info.firstname}
            </Descriptions.Item>
            <Descriptions.Item label="Last Name">
              {collisionObject.contact_info.lastname}
            </Descriptions.Item>
            <Descriptions.Item label="Address">
              {collisionObject.contact_info.address}
            </Descriptions.Item>
            <Descriptions.Item label="Driver License #">
              {collisionObject.contact_info.driver_license_number}
            </Descriptions.Item>
            <Descriptions.Item label="Insurance Policy #">
              {collisionObject.contact_info.insurance_policy_number}
            </Descriptions.Item>
            <Descriptions.Item label="Insurance Provider">
              {collisionObject.contact_info.insurance_provider}
            </Descriptions.Item>
            <Descriptions.Item label="Phone Number">
              {collisionObject.contact_info.phone_number}
            </Descriptions.Item>
          </Descriptions>
          <Divider />
          <Descriptions
            title="Collision Details"
            bordered
            size="small"
            column={{ lg: 1, md: 1, sm: 1, xs: 1 }}
          >
            <Descriptions.Item label="Fire or Explosion">
              {collisionObject.collision_report.fire_or_explode
                .toString()
                .toUpperCase()}
            </Descriptions.Item>
            <Descriptions.Item label="Legal Fault">
              {collisionObject.collision_report.legal_fault
                .toString()
                .toUpperCase()}
            </Descriptions.Item>
            <Descriptions.Item label="Towed">
              {collisionObject.collision_report.towed.toString().toUpperCase()}
            </Descriptions.Item>
            <Descriptions.Item label="Extra Information">
              {collisionObject.extra_info}
            </Descriptions.Item>
          </Descriptions>
        </div>
      );
    });
  };
  return <>{renderCollisionAccidents()}</>;
}

function DriverVehicleDamage({ accidentDetail }) {
  return (
    <Descriptions
      title="Vehicle Damage"
      bordered
      size="small"
      layout="vertical"
      column={{ lg: 2, md: 2, sm: 1, xs: 1 }}
    >
      <Descriptions.Item label="Front Bumper">
        {accidentDetail.selfDamage.damages["Front Bumper"]
          .toString()
          .toUpperCase()}
      </Descriptions.Item>
      <Descriptions.Item label="Rear Door">
        {accidentDetail.selfDamage.damages["Rear Door"]
          .toString()
          .toUpperCase()}
      </Descriptions.Item>
      <Descriptions.Item label="Side Mirror(s)">
        {accidentDetail.selfDamage.damages["Side Mirror(s)"]
          .toString()
          .toUpperCase()}
      </Descriptions.Item>
    </Descriptions>
  );
}

function DriverInjuries({ accidentDetail }) {
  const selfInjuryAccidents = () => {
    return accidentDetail.selfInjuryAccidents.map((accidentObject, index) => {
      return (
        <div key={accidentObject.id}>
          <Title level={5}>{"Self Injury #" + (index + 1).toString()}</Title>
          <Title level={5}>Injury Images</Title>
          <AccidentImageGroup>
            <Image.PreviewGroup>
              <Image
                width={150}
                src="https://cdn.abcotvs.com/dip/images/10181027_013121-wabc-mta-car-crash-img.jpg"
              />
              <Image
                width={150}
                src="https://cdn.abcotvs.com/dip/images/10181027_013121-wabc-mta-car-crash-img.jpg"
              />
            </Image.PreviewGroup>
          </AccidentImageGroup>
          <Divider />
          <Descriptions
            title="Injury Info"
            bordered
            size="small"
            layout="vertical"
            column={{ lg: 4, md: 4, sm: 4, xs: 1 }}
          >
            <Descriptions.Item label="Arm[s]">
              {accidentObject.injuries["Arm[s]"].toString().toUpperCase()}
            </Descriptions.Item>

            <Descriptions.Item label="Back">
              {accidentObject.injuries["Back"].toString().toUpperCase()}
            </Descriptions.Item>

            <Descriptions.Item label="Chest">
              {accidentObject.injuries["Chest"].toString().toUpperCase()}
            </Descriptions.Item>

            <Descriptions.Item label="Elbow[s]">
              {accidentObject.injuries["Elbow[s]"].toString().toUpperCase()}
            </Descriptions.Item>

            <Descriptions.Item label="Foot">
              {accidentObject.injuries["Foot"].toString().toUpperCase()}
            </Descriptions.Item>

            <Descriptions.Item label="Groin">
              {accidentObject.injuries["Groin"].toString().toUpperCase()}
            </Descriptions.Item>

            <Descriptions.Item label="Hand[s]">
              {accidentObject.injuries["Hand[s]"].toString().toUpperCase()}
            </Descriptions.Item>

            <Descriptions.Item label="Head">
              {accidentObject.injuries["Head"].toString().toUpperCase()}
            </Descriptions.Item>

            <Descriptions.Item label="Hips">
              {accidentObject.injuries["Hips"].toString().toUpperCase()}
            </Descriptions.Item>

            <Descriptions.Item label="Knee[s]">
              {accidentObject.injuries["Knee[s]"].toString().toUpperCase()}
            </Descriptions.Item>

            <Descriptions.Item label="Leg[s]">
              {accidentObject.injuries["Leg[s]"].toString().toUpperCase()}
            </Descriptions.Item>

            <Descriptions.Item label="Neck">
              {accidentObject.injuries["Neck"].toString().toUpperCase()}
            </Descriptions.Item>

            <Descriptions.Item label="Shoulder(s)">
              {accidentObject.injuries["Shoulder(s)"].toString().toUpperCase()}
            </Descriptions.Item>

            <Descriptions.Item label="Stomach">
              {accidentObject.injuries["Stomach"].toString().toUpperCase()}
            </Descriptions.Item>

            <Descriptions.Item label="Waist">
              {accidentObject.injuries["Waist"].toString().toUpperCase()}
            </Descriptions.Item>
          </Descriptions>
          <Divider />
          <Descriptions
            title="Injury Report"
            bordered
            size="small"
            layout="vertical"
            column={{ lg: 4, md: 4, sm: 4, xs: 1 }}
          >
            <Descriptions.Item label="Animal Related">
              {accidentObject.injury_report.animal_related
                ? accidentObject.injury_report.animal_related
                    .toString()
                    .toUpperCase()
                : "FALSE"}
            </Descriptions.Item>

            <Descriptions.Item label="Carrying Package">
              {accidentObject.injury_report.carrying_package
                ? accidentObject.injury_report.carrying_package
                    .toString()
                    .toUpperCase()
                : "FALSE"}
            </Descriptions.Item>
            <Descriptions.Item label="Driving During Accident">
              {accidentObject.injury_report.drivingDuring
                ? accidentObject.injury_report.drivingDuring
                    .toString()
                    .toUpperCase()
                : "FALSE"}
            </Descriptions.Item>
            <Descriptions.Item label="Proper Shoes">
              {accidentObject.injury_report.proper_shoes
                ? accidentObject.injury_report.proper_shoes
                    .toString()
                    .toUpperCase()
                : "FALSE"}
            </Descriptions.Item>
            <Descriptions.Item label="Slipped">
              {accidentObject.injury_report.slipped
                ? accidentObject.injury_report.slipped.toString().toUpperCase()
                : "FALSE"}
            </Descriptions.Item>
            <Descriptions.Item label="Extra Info">
              {accidentObject.extra_info}
            </Descriptions.Item>
          </Descriptions>
        </div>
      );
    });
  };
  return <>{selfInjuryAccidents()}</>;
}

function PropertyDamage({ accidentDetail }) {
  const propertyDamages = () => {
    return accidentDetail.propertyAccidents.map(
      (propertyAccidentObject, index) => {
        return (
          <div key={propertyAccidentObject.id}>
            <Title level={5}>
              {"Property Accident #" + (index + 1).toString()}
            </Title>
            <Title level={5}>Accident Images</Title>
            <AccidentImageGroup>
              <Image.PreviewGroup>
                <Image
                  width={150}
                  src="https://cdn.abcotvs.com/dip/images/10181027_013121-wabc-mta-car-crash-img.jpg"
                />
              </Image.PreviewGroup>
            </AccidentImageGroup>
            <Divider />
            <Descriptions
              title="Contact Info"
              bordered
              size="small"
              layout="vertical"
              column={{ lg: 2, md: 2, sm: 1, xs: 1 }}
            >
              <Descriptions.Item label="Name">
                {propertyAccidentObject.contact_info.name}
              </Descriptions.Item>
              <Descriptions.Item label="Phone Number">
                {propertyAccidentObject.contact_info.phoneNumber}
              </Descriptions.Item>
              <Descriptions.Item label="Phone Number 2">
                {propertyAccidentObject.contact_info.phoneNumber2}
              </Descriptions.Item>
            </Descriptions>
            <Divider />
            <Descriptions
              title="Damage Report"
              bordered
              size="small"
              layout="vertical"
              column={{ lg: 2, md: 2, sm: 1, xs: 1 }}
            >
              <Descriptions.Item label="Damage In or Out">
                {propertyAccidentObject.damage_report.inOrOut}
              </Descriptions.Item>
              <Descriptions.Item label="Things Hit">
                {propertyAccidentObject.damage_report.thingsHit
                  .join(", ")
                  .toString()}
              </Descriptions.Item>
              <Descriptions.Item label="Defective Equipment">
                {propertyAccidentObject.defective_equip.join(", ").toString()}
              </Descriptions.Item>
              <Descriptions.Item label="Extra Info">
                {propertyAccidentObject.extra_info}
              </Descriptions.Item>
              <Descriptions.Item label="Safety Equipment">
                {propertyAccidentObject.safety_equip.join(", ").toString()}
              </Descriptions.Item>
              <Descriptions.Item label="Damage Type: Gov">
                {propertyAccidentObject.types_of_damage.gov
                  .toString()
                  .toUpperCase()}
              </Descriptions.Item>
              <Descriptions.Item label="Damage Type: Pack">
                {propertyAccidentObject.types_of_damage.pack
                  .toString()
                  .toUpperCase()}
              </Descriptions.Item>
              <Descriptions.Item label="Damage Type: Personal">
                {propertyAccidentObject.types_of_damage.personal
                  .toString()
                  .toUpperCase()}
              </Descriptions.Item>
            </Descriptions>
          </div>
        );
      }
    );
  };
  return <>{propertyDamages()}</>;
}

function AccidentDetail({ accidentDetail }) {
  console.clear();
  console.log(accidentDetail);

  return (
    <AccidentDetailWrapper>
      <Drawer
        title={
          accidentDetail
            ? accidentDetail.location +
              " | " +
              dateFormat(accidentDetail.createdAt, "mm/dd/yyyy hh:MM tt")
            : "-"
        }
        placement="right"
        width={1000}
        onClose={() =>
          Router.push("/drivers/accidents", null, { shallow: true })
        }
        visible={accidentDetail !== null}
      >
        {accidentDetail && (
          <>
            <Descriptions
              title="Accident Info"
              bordered={false}
              layout="vertical"
              size="small"
              column={{ lg: 2, md: 2, sm: 2, xs: 1 }}
            >
              <Descriptions.Item label="Driver">
                <BasicLink
                  href={`/drivers/list?id=${accidentDetail.driver.transporterId}`}
                  shallow={true}
                >
                  <LinkOutlined /> {accidentDetail.driver.firstname}{" "}
                  {accidentDetail.driver.lastname}
                </BasicLink>
              </Descriptions.Item>
              <Descriptions.Item label="Location">
                {accidentDetail.location}
              </Descriptions.Item>
              <Descriptions.Item label="Time & Date">
                {dateFormat(accidentDetail.createdAt, "mm/dd/yyyy hh:MM tt")}
              </Descriptions.Item>
              <Descriptions.Item label="Amazon Logo">
                {accidentDetail.accident_report.has_logo === "yes"
                  ? "The driver or vehicle did display the Amazon Logo"
                  : "No Amazon logo was displayed"}
              </Descriptions.Item>
            </Descriptions>
            <Divider />
            <Tabs defaultActiveKey="1">
              <TabPane tab="Main Details" key="1">
                <MainDetails accidentDetail={accidentDetail} />
              </TabPane>
              <TabPane
                tab="Vehicular Collision"
                key="2"
                disabled={accidentDetail.collisionAccidents.length === 0}
              >
                <VehicleCollisionDetails accidentDetail={accidentDetail} />
              </TabPane>
              <TabPane
                tab="Pedestrian Injuries"
                disabled={accidentDetail.injuryAccidents.length === 0}
                key="3"
              >
                <PedestrianDetails accidentDetail={accidentDetail} />
              </TabPane>
              <TabPane
                tab="Driver Injuries"
                key="4"
                disabled={accidentDetail.selfInjuryAccidents.length === 0}
              >
                <DriverInjuries accidentDetail={accidentDetail} />
              </TabPane>
              <TabPane
                tab="Driver Vehicle Damage"
                key="5"
                disabled={!accidentDetail.selfDamage.damaged}
              >
                <DriverVehicleDamage accidentDetail={accidentDetail} />
              </TabPane>
              <TabPane
                tab="Property Damage"
                key="6"
                disabled={accidentDetail.propertyAccidents.length === 0}
              >
                <PropertyDamage accidentDetail={accidentDetail} />
              </TabPane>
            </Tabs>
          </>
        )}
      </Drawer>
    </AccidentDetailWrapper>
  );
}

export default AccidentDetail;
