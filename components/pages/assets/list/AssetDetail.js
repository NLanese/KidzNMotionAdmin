import React from "react";
import { Drawer } from "antd";

import Router from "next/router";
import EditAssetForm from "@forms/assets/EditAssetForm";
import DeleteAsset from "./DeleteAsset";

function AssetDetail({ assetDetail }) {
  return (
    <>
      <Drawer
        title={assetDetail ? assetDetail.name : "-"}
        placement="right"
        width={500}
        onClose={() => Router.push("/assets/list", null, { shallow: true })}
        visible={assetDetail !== null}
      >
        {assetDetail && (
          <>
            <EditAssetForm initialValues={assetDetail} />
            <DeleteAsset assetDetail={assetDetail} />
          </>
        )}
      </Drawer>
    </>
  );
}

export default AssetDetail;
