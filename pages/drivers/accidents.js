import React, { useState, useEffect } from "react";

import { NextSeo } from "next-seo";
import PageHeader from "@common/PageHeader";

import LoadingBlock from "@common/LoadingBlock";
import ContentCard from "@common/content/ContentCard";

import { getAccidents } from "@helpers/accidents";
import { userState, accidentState } from "@atoms";
import { useRecoilValue, useRecoilState } from "recoil";

import { withRouter } from "next/router";

import AccidentTable from "@components/pages/accidents/AccidentTable";
import AccidentDetail from "@components/pages/accidents/AccidentDetail";

function Accidents({ router }) {
  const user = useRecoilValue(userState);
  const [accidents, setAccidents] = useRecoilState(accidentState);

  const [loading, setLoading] = useState(true);
  const [accidentDetail, setAccidentDetail] = useState(null);

  const fetchAccidentData = async () => {
    const accidentsData = await getAccidents(user.role);
    console.log(accidentsData)
    setAccidents(accidentsData);
    setLoading(false);
  };

  useEffect(() => {
    fetchAccidentData();
  }, []);

  useEffect(() => {
    setAccidentDetail(null);
    if (router.query.id && accidents) {
        accidents.map((accidentObject) => {
       
          if (accidentObject.id === router.query.id) {
              console.log("hi")
            setAccidentDetail(accidentObject);
          }
        });
      }
  }, [router, accidents]);

  return (
    <>
      <NextSeo title="Accidents" />
      <>
        <PageHeader title="Accidents" />
        {loading ? (
          <LoadingBlock table={true} />
        ) : (
          <ContentCard modifiers={["tightPadding"]}>
            <AccidentTable accidents={accidents} />
            <AccidentDetail accidentDetail={accidentDetail} />
          </ContentCard>
        )}
      </>
    </>
  );
}

export default withRouter(Accidents);
