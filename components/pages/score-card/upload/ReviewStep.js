import React, { useEffect, useState } from "react";
import {
  Col,
  Row,
  Typography,
  Alert,
  Button,
  Space,
  Divider,
  message,
} from "antd";

const { Text } = Typography;
import { Table } from "antd";
import { pdfParse, CSVToArray } from "@helpers/pdfParse";
import Router from "next/router";

import LoadingBlock from "@common/LoadingBlock";
import { InfoCircleOutlined } from "@ant-design/icons";
import { scoreCardDataColumns } from "@constants/forms";
import { handleDecimalValue, handleNeedsNumber } from "@helpers/forms";
import { makeRandomString } from "@helpers/common";

function ReviewStep({
  fileUploaded,
  setStep,
  parsedData,
  setParsedData,
  uploadScorecardResults,
  setFormattedData,
  formattedData,
  setBulkUploadLoading,
  drivers,
  user,
}) {
  const [formattingErrors, setFormattingErrors] = useState(null);

  const uploadAndPDFParseData = async (scoreCardPDF) => {
    setBulkUploadLoading(true);
    const pdfParsedData = await pdfParse(scoreCardPDF);

    if (!pdfParsedData) {
      Router.push("/");
      message.error("There was an error with you file, please try again");
      setBulkUploadLoading(false);
    } else {
      const pdfParseToArray = CSVToArray(pdfParsedData);
      setParsedData(pdfParseToArray);
      setBulkUploadLoading(false);
    }
  };

  // Converts csv into array
  useEffect(() => {
    setParsedData(null);
    setFormattingErrors(null);
    if (fileUploaded && fileUploaded.originFileObj) {
      uploadAndPDFParseData(fileUploaded.originFileObj);
    }
  }, [fileUploaded]);

  // Takes in the array and adds in some some initial formatting
  useEffect(() => {
    // Set the origial formatted data source as null
    setFormattedData(null);

    // Check for errors
    let hasFormattingErrors = false;
    let localFormattingErrors = [];

    // If the name pared data is not there
    if (!parsedData) return;

    // To be submitted as formatted data
    let dataSource = [];

    // Get existing drivers list
    let esistingDriverList = drivers.map((driver) => driver.transporterId);

    // IDK WHAT THIS IS FOR NOW
    let recordedInts = [];
    parsedData.map((rowMain, index) => {
      let row = [...rowMain];
      if (
        row.filter((x) => x == "Transporter ID").length > 0 ||
        row.filter((x) => x == "Distractions").length > 0 ||
        row.filter((x) => x == "").length > 14 ||
        row.length < 19
      ) {
        return null;
      }

      // If the starting rank is not number then return null
      if (!row[0] || typeof parseInt(row[0]) !== "number") {
        return null;
      }

      // Each Employee Row starts with a whole integer
      if (
        typeof parseInt(row[0]) === "number" &&
        !recordedInts.includes(row[0])
      ) {
        recordedInts.push(row[0]);
        let name;

        // Fix the issue of the deliveries being over 1000
        if (row.length === 23) {
          let deliveryNumber = row[4] + row[5];
          var regex = /\d+/g;
          deliveryNumber = deliveryNumber.match(regex);

          
          
          if (deliveryNumber) {
            row.splice(4, 0, deliveryNumber[0]);
          } else {
            row.splice(4, 0, "NA");
          }
   
          row.splice(5, 1);
          row.splice(5, 1);
        }

        // If the name is empty for some reason
        if (row[1] === null || !row[1]) {
          name = ["NA", "NA"];
        } else {
          name = row[1].split(" ");
        }

        // Determine key focus area
        let keyFocusArea;

        let deliveryCompletionRate;
        if (row[13] !== null) {
          deliveryCompletionRate = row[13];
        } else {
          deliveryCompletionRate = "NA";
        }

        // If key focus area is null then
        if (row[5] === null || typeof row[5] === "number") {
          keyFocusArea = "NA";
        } else {
          keyFocusArea = row[5];
        }

        // Add in the email from
        const email = makeRandomString(12);

        let firstName = name[0];
        let lastName = name[1];

        let preface = `${firstName[0]}${lastName[0]}`;
        let append = "pass1!";
        let password = `${preface}${append}`;

        const employeeData = {
          rank: row[0],
          employeeId: row[2],
          driverInSystem: esistingDriverList.includes(row[2]),
          firstname: firstName,
          lastname: lastName,
          tier: row[3],
          delivered: handleNeedsNumber(row[4]),
          keyFocusArea: keyFocusArea,
          fico: row[6],
          seatbeltOffRate: handleDecimalValue(row[7]),
          speedingEventRate: handleDecimalValue(row[8]),
          distractionsRate: handleDecimalValue(row[9]),
          followingDistanceRate: handleDecimalValue(row[10]),
          signalViolationsRate: handleDecimalValue(row[11]),
          deliveryCompletionRate: handleDecimalValue(row[13]),
          deliveredAndRecieved: handleDecimalValue(row[14]),
          photoOnDelivery: "NA",
          dnr: row[19],
          podOpps: row[20],
          ccOpps: row[21],
          email: email,
          password: password,
          adminEmail: user.email.toLowerCase(),
          phoneNumber: "NA",
        };

        dataSource.push(employeeData);
      }
      return row;
    });

    if (
      dataSource.length === 0 ||
      dataSource.filter((row) => row.driverInSystem).length === 0
    ) {
      hasFormattingErrors = true;
      localFormattingErrors.push({
        row: 1,
        error: `We could not find any drivers in this spreadsheet. Please check the score card and try again.`,
      });
      setFormattingErrors(localFormattingErrors);
      return;
    }

    if (hasFormattingErrors) {
      setFormattingErrors(localFormattingErrors);
    } else {
      setFormattedData(dataSource);
    }
  }, [parsedData]);

  const renderFormErrors = () => {
    return formattingErrors.map(function (errorObject) {
      return (
        <Alert
          message={errorObject.error}
          id={errorObject.id}
          key={errorObject.id}
          type="error"
          showIcon
          style={{ marginBottom: "12px" }}
        />
      );
    });
  };

  return (
    <>
      <Space direction="vertical">
        {formattingErrors ? (
          <Text strong>
            <InfoCircleOutlined /> There seems to be some errors in your
            template, please review the list below and resubmit once its edited.
          </Text>
        ) : (
          <Text strong>
            <InfoCircleOutlined /> Review the data below and please check
            everything looks right before submitting the scorecard reports.
            Note: Only drivers in your organization (see 'Driver In System' in
            the table) will be displayed below and be eligible to receive weekly
            scorecard results. The rest of the rows in your scorecard upload
            will not be displayed below.
          </Text>
        )}
      </Space>
      <Divider />
      {formattedData && formattedData.length > 10 && (
        <>
          <Row justify="end" align="middle" gutter={16}>
            <Col>
              <Space>
                <Button size="large" type="ghost" onClick={() => setStep(0)}>
                  Go Back
                </Button>
                {formattedData && (
                  <Button
                    size="large"
                    disabled={formattingErrors !== null}
                    type="primary"
                    onClick={() => uploadScorecardResults(true)}
                  >
                    Upload Scorecard Results
                  </Button>
                )}
              </Space>
            </Col>
          </Row>
          <br />
        </>
      )}

      {formattedData && !formattingErrors && (
        <Table
          bordered={true}
          columns={scoreCardDataColumns}
          tableLayout="fixed"
          size="small"
          scroll={{ x: "350px", y: "500px" }}
          rowKey="employeeId"
          pagination={{ pageSize: 200, pageSizeOptions: [] }}
          dataSource={formattedData}
        />
      )}
      {!formattingErrors && !formattedData && <LoadingBlock />}
      {formattingErrors && <>{renderFormErrors()}</>}
      <Divider />
      <Row justify="end" align="middle" gutter={16}>
        <Col>
          <Space>
            <Button size="large" type="ghost" onClick={() => setStep(0)}>
              Go Back
            </Button>
            {formattedData && (
              <Button
                size="large"
                disabled={formattingErrors !== null}
                type="primary"
                onClick={() => uploadScorecardResults(true)}
              >
                Upload Scorecard Results
              </Button>
            )}
          </Space>
        </Col>
      </Row>
    </>
  );
}

export default ReviewStep;
