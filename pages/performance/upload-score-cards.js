import React, { useState, useEffect } from "react";
import { Button, Result, message, Alert } from "antd";
var dateFormat = require("dateformat");

import { useMutation } from "@apollo/client";
import { SCORECARD_TOOL_CREATE_WEEKLY_REPORTS } from "@graphql/operations";
import { useRecoilValue, useRecoilState } from "recoil";
import { waitForSeconds, getCurrentTime } from "@helpers/common";
import { getUserDrivers } from "@helpers/drivers";
import { userState, driverState, companyPreferenesState } from "@atoms";
import { getCompanyPreferences } from "@helpers/companyPreferences";

// New
import UploadLayout from "@components/upload/UploadLayout";
import UploadStep from "@components/upload/UploadStep";
import ReviewStep from "@pages/score-card/upload/ReviewStep";

function ScoreCardUpload() {
  const user = useRecoilValue(userState);
  const [drivers, setDrivers] = useRecoilState(driverState);
  const [companyPreferenceData, setCompanyPreferenceData] = useRecoilState(
    companyPreferenesState
  );

  const [bulkUploadLoading, setBulkUploadLoading] = useState(false);
  const [step, setStep] = useState(0);
  const [uploadingProgress, setUploadingProgress] = useState(null);

  const [uploadedFile, setUploadedFile] = useState(null);
  const [parsedData, setParsedData] = useState(null);
  const [formattedData, setFormattedData] = useState(null);
  const [submitErrors, setSubmitErrors] = useState(null);

  // Mutations
  const [createWeeklyScorecardReport, {}] = useMutation(
    SCORECARD_TOOL_CREATE_WEEKLY_REPORTS
  );

  const fetchInitialInformation = async () => {
    setBulkUploadLoading(true);
    const driverInformation = await getUserDrivers(user.role);
    setDrivers(driverInformation);

    const initialCompanyPreferenceData = await getCompanyPreferences(user.role);
    setCompanyPreferenceData(initialCompanyPreferenceData);

    setBulkUploadLoading(false);
  };

  useEffect(() => {
    fetchInitialInformation();
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
          uploadedFile={uploadedFile}
          fileType=".pdf"
          infoTitle="Upload a scorecard PDF file to create your weekly driver reports and update your drivers scores. Note:  drivers on the scorecard who do not yet exist in your database will not be updated, nor will their data be saved. "
          templateFile="/templates/score-cards/SCORE_CARD_EXAMPLE.pdf"
        />
      );
    } else if (step === 1) {
      return (
        <ReviewStep
          setStep={setStep}
          setBulkUploadLoading={setBulkUploadLoading}
          parsedData={parsedData}
          setParsedData={setParsedData}
          drivers={drivers}
          fileUploaded={uploadedFile}
          user={user}
          formattedData={formattedData}
          setFormattedData={setFormattedData}
          uploadScorecardResults={uploadScorecardResults}
        />
      );
    } else {
      return (
        <>
          <Result
            status={submitErrors ? "warning" : "success"}
            title={
              submitErrors
                ? "There Was An Error In Uploading Your Scorecard"
                : "Your Scorecard Has Been Uploaded"
            }
            subTitle={
              submitErrors
                ? "There were errors in uploading your scorecard, please review the errors below and try again"
                : "Your weekly driver reports have been created for your organization, you can review the details in the Performance Overview or in the driver details"
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

  const uploadScorecardResults = async () => {
    setBulkUploadLoading(true);
    setSubmitErrors(null);

    let localSubmitErrors = null;

    let filteredFormattedData = formattedData.filter(
      (row) => row.driverInSystem
    );
    for (var i = 0; i < filteredFormattedData.length; i++) {
      let weeklyReportSubmitObject = filteredFormattedData[i];
      if (weeklyReportSubmitObject.driverInSystem) {
        let autoSendFeedbackMessage = false;

        let autoSendMessage = "null";
        if (
          weeklyReportSubmitObject.tier === "Fantastic" &&
          companyPreferenceData.autoSend.great
        ) {
          autoSendMessage = companyPreferenceData.feedbackNotifications.great;
          autoSendFeedbackMessage = true;
        } else if (
          weeklyReportSubmitObject.tier === "Great" &&
          companyPreferenceData.autoSend.fair
        ) {
          autoSendMessage = companyPreferenceData.feedbackNotifications.fair;
          autoSendFeedbackMessage = true;
        } else if (
          weeklyReportSubmitObject.tier === "Fair" &&
          companyPreferenceData.autoSend.subpar
        ) {
          autoSendMessage = companyPreferenceData.feedbackNotifications.subpar;
          autoSendFeedbackMessage = true;
        }

        // Define base variables
        let variables = {
          token: user.token,
          role: user.role,
          dspId: user.dsp.id,
          transporterId: weeklyReportSubmitObject.employeeId,
          date: dateFormat(new Date(), "mm/dd/yyyy"),
          sentAt: getCurrentTime().hourMin,
          feedbackStatus: weeklyReportSubmitObject.tier,
          feedbackMessage: autoSendMessage,
          feedbackMessageSent: autoSendFeedbackMessage,
          rank: parseInt(weeklyReportSubmitObject.rank),
          tier: weeklyReportSubmitObject.tier,
          delivered: parseInt(weeklyReportSubmitObject.delivered),
          keyFocusArea: weeklyReportSubmitObject.keyFocusArea,
          fico: weeklyReportSubmitObject.fico,
          seatbeltOffRate: weeklyReportSubmitObject.seatbeltOffRate.toString(),
          speedingEventRate:
            weeklyReportSubmitObject.speedingEventRate.toString(),
          distractionsRate:
            weeklyReportSubmitObject.distractionsRate.toString(),
          followingDistanceRate:
            weeklyReportSubmitObject.followingDistanceRate.toString(),
          signalViolationsRate:
            weeklyReportSubmitObject.signalViolationsRate.toString(),
          deliveryCompletionRate:
            weeklyReportSubmitObject.deliveryCompletionRate.toString(),
          deliveredAndRecieved:
            weeklyReportSubmitObject.deliveredAndRecieved.toString(),
          dnr: parseInt(weeklyReportSubmitObject.dnr),
          podOpps: parseInt(weeklyReportSubmitObject.podOpps),
          ccOpps: parseInt(weeklyReportSubmitObject.ccOpps),
        };

        await createWeeklyScorecardReport({
          variables: variables,
        })
          .then(async (resolved) => {
            setUploadingProgress((i + 1) / filteredFormattedData.length);
          })
          .catch((error) => {
            setUploadingProgress((i + 1) / filteredFormattedData.length);
            if (!localSubmitErrors) localSubmitErrors = [];
            localSubmitErrors.push({
              id: Math.random(),
              error: `Row ${weeklyReportSubmitObject.rank} was unable to be uploaded. Please try again.`,
            });
          });
      }
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
      wideLayout={step === 1}
      title="Upload Scorecards"
      loading={bulkUploadLoading}
      currentStep={step}
      uploadingProgress={uploadingProgress}
    >
      {renderFormStep()}
    </UploadLayout>
  );
}

export default ScoreCardUpload;
