import React, { useEffect, useState } from "react";
import { Col, Row, Typography, Alert, Button, Space, Divider } from "antd";
const { Text } = Typography;

import { Table } from "antd";
import { normalizePhone, emailIsValid } from "@helpers/forms";
import { pdfParse, CSVToArray } from "@helpers/pdfParse";

import { InfoCircleOutlined } from "@ant-design/icons";

const userDataTableColumns = [
  {
    title: "Email",
    dataIndex: "Email",
  },
  {
    title: "Role",
    dataIndex: "Role",
  },
];

function ReviewStep({
  fileUploaded,
  setStep,
  parsedData,
  setParsedData,
  uploadUsers,
  setFormattedData,
  formattedData,
  setBulkUploadLoading,
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
    if (
      fileUploaded &&
      fileUploaded.originFileObj &&
      fileUploaded.originFileObj.name.includes(".csv")
    ) {
      let reader = new FileReader();

      reader.onload = readSuccess;

      //this function requires the file to be fully loaded
      function readSuccess(event) {
        let text = event.target.result;
        let data = CSVToArray(text);

        setParsedData(data);
      }

      reader.readAsText(fileUploaded.originFileObj);
    } else {
      setParsedData(null);
      setFormattingErrors(null);
      if (fileUploaded && fileUploaded.originFileObj) {
        uploadAndPDFParseData(fileUploaded.originFileObj);
      }
    }
  }, [fileUploaded]);

  // Takes in the array and adds in some some initial formatting
  useEffect(() => {
    setFormattedData(null);
    let hasFormattingErrors = false;
    let localFormattingErrors = [];
    if (!parsedData) return;

    // Check for column mismatch
    if (parsedData[0].length !== 2) {
      hasFormattingErrors = true;
      localFormattingErrors.push({
        row: rowCount,
        error: `Your upload template needs to have 2 columns. Please down the template from the preview page and try again.`,
      });
      setFormattingErrors(localFormattingErrors);
      return;
    }

    let dataSource = [];
    for (var rowCount = 0; rowCount < parsedData.length; rowCount++) {
      if (rowCount !== 0) {
        let row = {};
        if (
          parsedData[rowCount][0].length > 0 &&
          parsedData[rowCount][1].length > 0 
        ) {
          for (
            var colCount = 0;
            colCount < parsedData[rowCount].length;
            colCount++
          ) {
            // Check to make sure that the delivery id is correct
            if (colCount === 0) {
              if (!emailIsValid(parsedData[rowCount][colCount])) {
                hasFormattingErrors = true;
                localFormattingErrors.push({
                  row: rowCount,
                  id: Math.random(),
                  error: `Row ${rowCount + 1} - The email is invalid: ${
                    parsedData[rowCount][colCount]
                  }`,
                });
              } else {
                row[userDataTableColumns[colCount].dataIndex] =
                  parsedData[rowCount][colCount];
              }
            } else if (colCount === 1) {
              console.log(parsedData[rowCount][colCount])
              let acceptedRoles = ["GUARDIAN", "THERAPIST", "ADMIN"]
              if (!acceptedRoles.includes(parsedData[rowCount][colCount])) {
                hasFormattingErrors = true;
                localFormattingErrors.push({
                  row: rowCount,
                  id: Math.random(),
                  error: `Row ${
                    rowCount + 1
                  } -  The role must be either GUARDIAN, THERAPIST, or ADMIN: ${
                    parsedData[rowCount][colCount]
                  }`,
                });
              } else {
                row[userDataTableColumns[colCount].dataIndex] =
                  parsedData[rowCount][colCount];
              }
            }  else {
              row[userDataTableColumns[colCount].dataIndex] =
                parsedData[rowCount][colCount];
            }
          }
          dataSource.push(row);
        }
      }
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
            everything looks right before submitting
          </Text>
        )}
      </Space>
      <Divider />
      {formattedData && formattedData.length > 100 && (
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
                    onClick={() => uploadUsers(true)}
                  >
                    Bulk Upload
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
          bordered={false}
          columns={userDataTableColumns}
          tableLayout="fixed"
          size="middle"
          rowKey="email"
          scroll={{ x: "350px" }}
          pagination={{ pageSize: 50 }}
          dataSource={formattedData}
        />
      )}
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
                onClick={() => uploadUsers(true)}
              >
                Bulk Upload
              </Button>
            )}
          </Space>
        </Col>
      </Row>
    </>
  );
}

export default ReviewStep;
