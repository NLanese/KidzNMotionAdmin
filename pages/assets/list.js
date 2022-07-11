import React, { useState, useEffect } from "react";

import { NextSeo } from "next-seo";
import PageHeader from "@common/PageHeader";

import LoadingBlock from "@common/LoadingBlock";
import ContentCard from "@common/content/ContentCard";

import { getAssets } from "@helpers/assets";
import { userState, assetState } from "@atoms";
import { useRecoilValue, useRecoilState } from "recoil";
import styled from "styled-components";

import { withRouter } from "next/router";

import AssetTable from "@components/pages/assets/list/AssetTable";
import AssetDetail from "@components/pages/assets/list/AssetDetail";

const AssetListWrapper = styled.div`
  max-width: ${(props) => props.theme.contentSize.tight};
  margin: auto;
`;

function ListAssets({ router }) {
  const user = useRecoilValue(userState);
  const [assets, setAssets] = useRecoilState(assetState);

  const [loading, setLoading] = useState(true);
  const [assetDetail, setAsssetDetail] = useState(null);

  const fetchAssetInformation = async () => {
    const assetInformation = await getAssets(user.role);
    setAssets(assetInformation);
    setLoading(false);
  };

  useEffect(() => {
    fetchAssetInformation();
  }, []);

  useEffect(() => {
    setAsssetDetail(null);
    if (router.query.edit && router.query.id && assets) {
      assets.map((assetObject) => {
        if (assetObject.id === router.query.id) {
          setAsssetDetail(assetObject);
        }
      });
    }
  }, [router, assets]);

  return (
    <AssetListWrapper>
      <NextSeo title="Assets" />
      <>
        <PageHeader
          title="Assets"
          noBottomBorder={true}
          createURL="/assets/upload"
          createTitle="Create Assets"
        />
        {loading ? (
          <LoadingBlock table={true} />
        ) : (
          <ContentCard modifiers={["tightPadding"]}>
            <AssetTable />
            <AssetDetail assetDetail={assetDetail} />
          </ContentCard>
        )}
      </>
    </AssetListWrapper>
  );
}

export default withRouter(ListAssets);
