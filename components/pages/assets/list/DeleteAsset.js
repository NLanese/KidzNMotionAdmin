import React, { useState } from "react";
import { Button, Popconfirm, message } from "antd";
import { DeleteOutlined } from "@ant-design/icons";
import styled from "styled-components";

import { userState, assetState } from "@atoms";
import { useRecoilValue, useSetRecoilState } from "recoil";

import { getAssets } from "@helpers/assets";

import { DELETE_ASSET } from "@graphql/operations";
import { useMutation } from "@apollo/client";

import Router from "next/router";

const DeleteAssetWrapper = styled.div`
  margin-top: 23px;
  & button {
    float: right;
  }
`;

function DeleteAsset({ assetDetail }) {
  const [loading, setLoading] = useState(false);
  const setAssets = useSetRecoilState(assetState);
  const user = useRecoilValue(userState);

  // Mutations
  const [deleteAsset, {}] = useMutation(DELETE_ASSET);

  const confirmDeleteAsset = async () => {
    setLoading(true);
    await deleteAsset({
      variables: {
        token: localStorage.getItem("token"),
        role: user.role,
        id: parseInt(assetDetail.id),
      },
    })
      .then(async (resolved) => {
        message.success("Asset Deleted");
        const assetInformation = await getAssets(user.role);

        setAssets(assetInformation);

        Router.push("/assets/list");
      })
      .catch((error) => {
        message.error("Sorry, there was an error on our end");
        setLoading(false);
      });
  };

  return (
    <DeleteAssetWrapper>
      <Popconfirm
        placement="topLeft"
        title={"Are you sure you want to delete this asset?"}
        onConfirm={() => confirmDeleteAsset()}
        okText="Yes"
        cancelText="No"
      >
        <Button type="ghost" danger loading={loading}>
          <DeleteOutlined />
          Delete Asset
        </Button>
      </Popconfirm>
    </DeleteAssetWrapper>
  );
}

export default DeleteAsset;
