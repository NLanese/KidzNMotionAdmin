import React, { useState } from "react";
import { Button, Result, message, Alert } from "antd";

import { userState } from "@atoms";
import { useMutation } from "@apollo/client";
import { DYNAMIC_CREATE_ASSET } from "@graphql/operations";
import { useRecoilValue } from "recoil";
import { waitForSeconds } from "@helpers/common";

// New
import UploadLayout from "@components/upload/UploadLayout";
import UploadStep from "@components/upload/UploadStep";
import ReviewStep from "@pages/assets/upload/ReviewStep";

function BulkUploadAssets() {
  const user = useRecoilValue(userState);

  const [bulkUploadLoading, setBulkUploadLoading] = useState(false);
  const [step, setStep] = useState(0);
  const [uploadingProgress, setUploadingProgress] = useState(null);

  const [uploadedFile, setUploadedFile] = useState(null);
  const [parsedData, setParsedData] = useState(null);
  const [formattedData, setFormattedData] = useState(null);
  const [submitErrors, setSubmitErrors] = useState(null);

  // Mutations
  const [dynamicCreateAsset, {}] = useMutation(DYNAMIC_CREATE_ASSET);

  const renderSubmitErrors = () => {
    return submitErrors.map(function (errorObject) {
      return (
        <div key={errorObject.id.toString()}>
          <Alert
            message={errorObject.error}
            id={errorObject.id}
            type="error"
            showIcon
            style={{ marginBottom: "12px" }}
          />
        </div>
      );
    });
  };

  const renderFormStep = () => {
    if (step === 0) {
      return (
        <UploadStep
          setUploadedFile={setUploadedFile}
          setStep={setStep}
          fileType=".csv, .pdf"
          uploadedFile={uploadedFile}
          infoTitle="Upload a CSV file to create assets for your organization"
          templateFile="/templates/assets/TOM_ASSET_UPLOAD_TEMPLATE.csv"
        />
      );
    } else if (step === 1) {
      return (
        <ReviewStep
          setStep={setStep}
          parsedData={parsedData}
          setParsedData={setParsedData}
          setBulkUploadLoading={setBulkUploadLoading}
          fileUploaded={uploadedFile}
          formattedData={formattedData}
          setFormattedData={setFormattedData}
          uploadAssets={uploadAssets}
        />
      );
    } else {
      return (
        <>
          <Result
            status={submitErrors ? "warning" : "success"}
            title={
              submitErrors
                ? "Some of Your Assets Did Not Upload"
                : "Your Assets Have Been Uploaded"
            }
            subTitle={
              submitErrors
                ? "Some of you assets did not upload to your organization, please review the row errors below and try uploading again"
                : "Your assets have been created for your organization, you can review them in the Asset List"
            }
            extra={[
              <Button
                type="primary"
                size={"large"}
                key={"test"}
                onClick={() => setStep(0)}
              >
                Upload Another File
              </Button>,
            ]}
          />
          {submitErrors && <>{renderSubmitErrors()}</>}
        </>
      );
    }
  };

  const uploadAssets = async () => {
    setBulkUploadLoading(true);
    setSubmitErrors(null);

    let localSubmitErrors = null;

    for (var i = 0; i < formattedData.length; i++) {
      let assetSubmitObject = formattedData[i];
      await dynamicCreateAsset({
        variables: {
          token: localStorage.getItem("token"),
          dspId: user.dsp.id,
          role: user.role,

          name: assetSubmitObject.name.toString(),
          number: assetSubmitObject.number
            ? assetSubmitObject.number.toString()
            : "NA",
          type: assetSubmitObject.type,
          deviceIndex: i,
          id: -5,
        },
      })
        .then(async (resolved) => {
          setUploadingProgress((i + 1) / formattedData.length);
        })
        .catch((error) => {
          setUploadingProgress((i + 1) / formattedData.length);
          if (!localSubmitErrors) localSubmitErrors = [];
          localSubmitErrors.push({
            id: Math.random(),
            error: `Row ${i + 1} was unable to be uploaded. Please try again.`,
          });
        });
    }
    if (localSubmitErrors) setSubmitErrors(localSubmitErrors);

    setStep(2);
    await waitForSeconds(0.2);
    setUploadedFile(null);
    setFormattedData(null);
    setBulkUploadLoading(false);
    setParsedData(null);
    setUploadingProgress(null);
  };

  return (
    <UploadLayout
      title="Bulk Asset Upload"
      loading={bulkUploadLoading}
      currentStep={step}
      uploadingProgress={uploadingProgress}
    >
      {renderFormStep()}
    </UploadLayout>
  );
}

export default BulkUploadAssets;
