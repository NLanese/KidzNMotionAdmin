import React, { useState, useEffect } from "react";
import { Button, Result, message, Alert } from "antd";

import { userState } from "@atoms";
import { useMutation } from "@apollo/client";
import { CREATE_DRIVER_ACCOUNT } from "@graphql/operations";
import { useRecoilValue } from "recoil";
import { waitForSeconds } from "@helpers/common";
import { checkAuthorization } from "@helpers/authorization";

// New
import UploadLayout from "@components/upload/UploadLayout";
import UploadStep from "@components/upload/UploadStep";
import ReviewStep from "@pages/drivers/upload/ReviewStep";

function BulkUploadDrivers() {
  const user = useRecoilValue(userState);

  const [bulkUploadLoading, setBulkUploadLoading] = useState(false);
  const [step, setStep] = useState(0);
  const [uploadingProgress, setUploadingProgress] = useState(null);

  const [uploadedFile, setUploadedFile] = useState(null);
  const [parsedData, setParsedData] = useState(null);
  const [formattedData, setFormattedData] = useState(null);
  const [submitErrors, setSubmitErrors] = useState(null);

  // Mutations
  const [createDriverAccount, {}] = useMutation(CREATE_DRIVER_ACCOUNT);

  useEffect(() => {
    checkAuthorization(user.role, "OWNER");
  }, []);

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
          infoTitle="Upload a CSV file to create TOM accounts for
          all drivers in your upload."
          templateFile="/templates/drivers/TOM_DRIVER_UPLOAD_TEMPLATE.csv"
        />
      );
    } else if (step === 1) {
      return (
        <ReviewStep
          setStep={setStep}
          parsedData={parsedData}
          setBulkUploadLoading={setBulkUploadLoading}
          setParsedData={setParsedData}
          fileUploaded={uploadedFile}
          formattedData={formattedData}
          setFormattedData={setFormattedData}
          uploadDrivers={uploadDrivers}
        />
      );
    } else {
      return (
        <>
          <Result
            status={submitErrors ? "warning" : "success"}
            title={
              submitErrors
                ? "Some of Your Drivers Did Not Upload"
                : "Your Drivers Have Been Uploaded"
            }
            subTitle={
              submitErrors
                ? "For the team members that did upload, they should be receiving email invites to the Tom platform shortly."
                : "Your team should be receiving email invites to the Tom platform shortly."
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

  const uploadDrivers = async () => {
    setBulkUploadLoading(true);
    setSubmitErrors(null);

    let localSubmitErrors = null;

    for (var i = 0; i < formattedData.length; i++) {
      let driverSubmitObject = formattedData[i];
      await createDriverAccount({
        variables: {
          token: localStorage.getItem("token"),
          dspId: user.dsp.id,
          email: driverSubmitObject["Email"],
          password: driverSubmitObject["Full Name"].split(" ")[1]  + "pass123!",
          firstname: driverSubmitObject["Full Name"].split(" ")[0],
          lastname: driverSubmitObject["Full Name"].split(" ")[1],
          phoneNumber: driverSubmitObject["Phone Number"],
          transporterId: driverSubmitObject["ID"],
          role: user.role,
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
            error: `Row ${i + 1} was unable to be uploaded. Its possible that the driver's email or transporter ID is already in the system. Please try again.`,
          });
        });
      await waitForSeconds(3);
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
      title="Bulk Driver Upload"
      wideLayout={step === 1}
      loading={bulkUploadLoading}
      currentStep={step}
      uploadingProgress={uploadingProgress}
    >
      {renderFormStep()}
    </UploadLayout>
  );
}

export default BulkUploadDrivers;
