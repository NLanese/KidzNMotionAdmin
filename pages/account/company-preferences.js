import React, { useEffect, useState } from "react";
import styled from "styled-components";

import { NextSeo } from "next-seo";
import PageHeader from "@common/PageHeader";
import LoadingBlock from "@common/LoadingBlock";
import { message } from "antd";

import { useMutation } from "@apollo/client";
import { CREATE_COMPANY_PREFERENCES, UPDATE_COMPANY_PREFERENCES } from "@graphql/operations";

import { userState } from "@atoms";
import { companyPreferenesState } from "@atoms";
import { useRecoilValue, useRecoilState } from "recoil";
import { getCompanyPreferences, convertCompanyPreferenceFormToGraphQL } from "@helpers/companyPreferences";
import { checkAuthorization } from "@helpers/authorization";

import MainCompanyPreferenceForm from "@forms/preferences/MainCompanyPreferenceForm";

const PreferenceWrapper = styled.div`
  max-width: ${(props) => props.theme.contentSize.standard};
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

function CompanyPreferences() {
  const user = useRecoilValue(userState);
  const [companyPreferenceData, setCompanyPreferenceData] = useRecoilState(
    companyPreferenesState
  );
  const [intialLoad, setInitialLoad] = useState(true);

  // Mutations
  const [createCompanyPreferences, {}] = useMutation(CREATE_COMPANY_PREFERENCES);
  const [updateCompanyPreferences, {}] = useMutation(UPDATE_COMPANY_PREFERENCES);

  const fetchInitialCompanyPreferenceData = async () => {
    const initialCompanyPreferenceData = await getCompanyPreferences(user.role);
    setCompanyPreferenceData(initialCompanyPreferenceData);

    setInitialLoad(false);
  };

  const submitCompanyPreferenceData = async (formValues) => {
    const convertedFormValues = convertCompanyPreferenceFormToGraphQL(formValues)

    if (companyPreferenceData) {
      await updateCompanyPreferences(convertedFormValues)
        .then(async (resolved) => {
          message.success("Settings Saved");
          
          setCompanyPreferenceData(resolved.data.ownerUpdateDsp);
        })
        .catch((error) => {
          message.error("Sorry, there was an error on our end");
        });
    } else {
      await createCompanyPreferences(convertedFormValues)
        .then(async (resolved) => {
          message.success("Settings Saved");
          location.reload();
          setCompanyPreferenceData(resolved.data.ownerCreateDsp);
        })
        .catch((error) => {
          message.error("Sorry, there was an error on our end");
        });
    }
  };

  useEffect(() => {
    fetchInitialCompanyPreferenceData();
    checkAuthorization(user.role, "OWNER")
  }, []);

  if (intialLoad && !companyPreferenceData) {
    return (
      <PreferenceWrapper>
        <LoadingBlock />
      </PreferenceWrapper>
    );
  }

  return (
    <PreferenceWrapper>
      <NextSeo title="Company Preferences" />
      <PageHeader title="Company Preferences" />
      <MainCompanyPreferenceForm
        createForm={!companyPreferenceData}
        initialValues={companyPreferenceData}
        submitCompanyPreferenceData={submitCompanyPreferenceData}
      />
    </PreferenceWrapper>
  );
}

export default CompanyPreferences;
