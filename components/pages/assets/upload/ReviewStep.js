import React, { useEffect, useState } from "react";
import { Col, Row, Typography, Alert, Button, Space, Divider } from "antd";
const { Text } = Typography;

import { Table } from "antd";
import { pdfParse, CSVToArray } from "@helpers/pdfParse";

import { InfoCircleOutlined } from "@ant-design/icons";

const userDataTableColumns = [
  {
    title: "Asset Type",
    dataIndex: "type",
    defaultSortOrder: "descend",
    sorter: (a, b) => a.type.localeCompare(b.type),
  },
  {
    title: "Name",
    dataIndex: "name",
    sorter: (a, b) => a.type.localeCompare(b.type),
  },
  {
    title: "Asset Number / VIN",
    dataIndex: "number",
    sorter: (a, b) => a.type.localeCompare(b.type),
  },
];

function ReviewStep({
  fileUploaded,
  setStep,
  parsedData,
  setParsedData,
  uploadAssets,
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
    if (parsedData[0].length === 0) {
      hasFormattingErrors = true;
      localFormattingErrors.push({
        row: rowCount,
        error: `Your upload template needs to have at least 1 column. Please down the template from the preview page and try again.`,
      });
      setFormattingErrors(localFormattingErrors);
      return;
    }

    let dataSource = [];

    // Loop over top rows to get the asset types and wether or not they have a VIN
    let assetTypes = [];
    parsedData[0].forEach((assetName, index) => {
      if (assetName !== "Number" && assetName !== "VIN") {
        assetTypes.push({
          deviceType: assetName.replace("\r", ""),
          column: index,
          entries: [],
          number: false,
        });
      }
      if (assetName === "Number" || assetName === "VIN") {
        assetTypes[assetTypes.length - 1] = {
          ...assetTypes[assetTypes.length - 1],
          number: true,
        };
      }
    });

    parsedData.slice(1).forEach((row) => {
      // For Each asset, checks if there is an entry in this row
      assetTypes.forEach((asset) => {
        if (row[asset.column]) {
          let assetObject = { type: asset.deviceType, name: row[asset.column] };

          if (asset.number) {
            assetObject = { ...assetObject, number: row[asset.column + 1] };
          }
          dataSource.push(assetObject);
        }
      });
    });

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
                    onClick={() => uploadAssets(true)}
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
          scroll={{ x: "350px" }}
          rowKey="number"
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
                onClick={() => uploadAssets(true)}
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
