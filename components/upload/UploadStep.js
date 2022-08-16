import React from "react";
import styled from "styled-components";
import { Col, Row, Typography, Button, Space, Divider, Upload } from "antd";
const { Text } = Typography;
import { UploadOutlined, InfoCircleOutlined } from "@ant-design/icons";

const UploadWrapper = styled.div`
  .ant-upload {
    width: 100%;
  }
`;

function UploadStep({
  uploadedFile,
  setStep,
  setUploadedFile,
  infoTitle,
  fileType,
  templateFile,
}) {
  const onChangeDragger = (event) => {
    event.fileList.forEach((list) => {
      if (list.uid === event.file.uid) {
        setUploadedFile(event.file);
      }
    });
    if (event.fileList.length === 0) {
      setUploadedFile(null);
    }
  };

  return (
    <>
      <Space direction="vertical">
        <Text strong>
          <InfoCircleOutlined /> {infoTitle}
        </Text>
      </Space>
      <Divider />
      <UploadWrapper uploadedFile={uploadedFile}>
        <Upload
          onChange={(event) => onChangeDragger(event)}
          accept={fileType}
          action="/api/upload-dummy"
          listType="picture"
          defaultFileList={uploadedFile && [uploadedFile.originFileObj]}
          maxCount={1}
        >
          <Button size={"large"} block={true} icon={<UploadOutlined />}>
            {uploadedFile ? "Replace File" : "Upload File"}
          </Button>
        </Upload>
      </UploadWrapper>
      <Divider />
      <Text type="secondary">
        Download a sample{" "}
        <a
          target="_blank"
          href={templateFile}
          rel="noopener noreferrer"
          style={{ textDecoration: "underline" }}
        >
          {templateFile.includes("csv") ? "CSV" : "PDF"}
        </a>{" "}
        template to see an example of the format
      </Text>

      <Row justify="end" align="middle" gutter={16}>
        <Col>
          <Space>
            <Button
              size="large"
              type="primary"
              disabled={uploadedFile === null}
              onClick={() => setStep(1)}
            >
              Upload and continue
            </Button>
          </Space>
        </Col>
      </Row>
    </>
  );
}

export default UploadStep;
