import React, { useState, useEffect } from "react";
import { Button, Result, message, Alert } from "antd";
import styled from "styled-components";

import { withRouter } from "next/router";

import { useMutation } from "@apollo/client";
import { INVITE_USER } from "@graphql/operations";

import { userState } from "@atoms";
import { useRecoilState } from "recoil";
import Router from "next/router";

// New
import UploadLayout from "@components/upload/UploadLayout";
import UploadStep from "@components/upload/UploadStep";
import ReviewStep from "@pages/users/ReviewStep";


function UploadUsers({ router }) {
  const [user, setUser] = useRecoilState(userState);

  const [bulkUploadLoading, setBulkUploadLoading] = useState(false);
  const [step, setStep] = useState(0);
  const [uploadingProgress, setUploadingProgress] = useState(null);

  const [uploadedFile, setUploadedFile] = useState(null);
  const [parsedData, setParsedData] = useState(null);
  const [formattedData, setFormattedData] = useState(null);
  const [submitErrors, setSubmitErrors] = useState(null);

  // Mutations
  const [inviteUser, {}] = useMutation(INVITE_USER);

  useEffect(() => {
    if (!user.ownedOrganization) {
      Router.push("/");
    }
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
          infoTitle="Upload a CSV file to invite users to your Kidz-N-Motion organization."
          templateFile="/templates/users/USER_UPLOAD_TEMPLATE.csv"
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
          uploadUsers={uploadUsers}
        />
      );
    } else {
      return (
        <>
          <Result
            status={submitErrors ? "warning" : "success"}
            title={
              submitErrors
                ? "Some of Your Users Were Not Invited"
                : "All Of Your Users Have Been Invited"
            }
            subTitle={
              submitErrors
                ? "For the users that did upload, they should be receiving email invites to the Kidz-N-Motion platform shortly."
                : "Your users should be receiving email invites to the Kidz-N-Motion platform shortly."
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

  const uploadUsers = async () => {
    setBulkUploadLoading(true);
    setSubmitErrors(null);

    let localSubmitErrors = null;

    for (var i = 0; i < formattedData.length; i++) {
      let userObject = formattedData[i];
      await inviteUser({
        variables: {
          role: userObject["Role"],
          email: userObject["Email"],
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
            error: `Row ${
              i + 1
            } was unable to be uploaded. Its possible that the user's email is already in the system. Please try again.`,
          });
        });
    }

    if (localSubmitErrors) setSubmitErrors(localSubmitErrors);

    setStep(2);
    setUploadedFile(null);
    setFormattedData(null);
    setBulkUploadLoading(false);
    setParsedData(null);
    setUploadingProgress(null);
  };

  return (
    <UploadLayout
      title="Bulk User Upload"
      wideLayout={step === 1}
      loading={bulkUploadLoading}
      currentStep={step}
      uploadingProgress={uploadingProgress}
    >
      {renderFormStep()}
    </UploadLayout>
  );
}

export default withRouter(UploadUsers);
