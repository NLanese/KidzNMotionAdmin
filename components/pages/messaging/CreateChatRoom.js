import React, { useState } from "react";

import { Button, Modal, Input, Typography, Spin, message, Select } from "antd";

const { Text } = Typography;
const { Option } = Select;

import { getUserChats } from "@helpers/chat";
import { userState, driverState, managerState, chatState } from "@atoms";
import { useRecoilValue, useRecoilState } from "recoil";

import { useMutation } from "@apollo/client";
import { DYNAMIC_CREATE_CHATROOM } from "@graphql/operations";

import Router from "next/router";

function CreateChatRoom({ createChatOpen, setCreateChatOpen }) {
  const user = useRecoilValue(userState);
  const managers = useRecoilValue(managerState);
  const drivers = useRecoilValue(driverState);
  const [chatRooms, setChatRooms] = useRecoilState(chatState);

  const [createChatRoomLoading, setCreateChatRoomLoading] = useState(false);
  const [chatName, setChatName] = useState("");
  const [chatDrivers, setChatDrivers] = useState([]);
  const [chatManagers, setChatManagers] = useState([]);

  // Mutations
  const [dynamicCreateChatRoom, {}] = useMutation(DYNAMIC_CREATE_CHATROOM);

  const renderDriverOptions = () => {
    return drivers.map((driverObject) => {
      return (
        <Option key={driverObject.id} disabled={false}>
          {driverObject.firstname} {driverObject.lastname}
        </Option>
      );
    });
  };

  const renderManagerOptions = () => {
    return managers.map((managerOption) => {
      return (
        <Option key={managerOption.id} disabled={false}>
          {managerOption.firstname} {managerOption.lastname}
        </Option>
      );
    });
  };

  const checkCanSubmit = () => {
    if (chatName.length > 0) {
      if (chatDrivers.length > 0 || chatManagers.length > 0) {
        return true;
      }
    }
    return false;
  };

  const getGuestsForSubmit = () => {
    let guests = [];

    chatDrivers.map((chatDriverId) => {
      let driverObject = drivers.filter(
        (driverObject) => driverObject.id === chatDriverId
      )[0];
      guests.push(driverObject);
    });

    chatManagers.map((chatManagerId) => {
      let managerObject = managers.filter(
        (managerObject) => managerObject.id === chatManagerId
      )[0];
      guests.push(managerObject);
    });
    return guests;
  };

  const createChatRoom = async () => {
    setCreateChatRoomLoading(true);
    await dynamicCreateChatRoom({
      variables: {
        role: user.role,
        token: localStorage.getItem("token"),
        chatroomName: chatName,
        guests: getGuestsForSubmit(),
      },
    })
      .then(async (resolved) => {
        setCreateChatRoomLoading(false);
        message.success("Chat Room Created");
        const chatRoomInformation = await getUserChats(user);
        setChatRooms(chatRoomInformation);

        setChatName("");
        setChatDrivers([]);
        setChatManagers([]);

        setCreateChatOpen(false);
        window.location =
          "/messaging/?chat=" + resolved.data.dynamicCreateChatroom.id;
      })
      .catch((error) => {
        console.log(error);
        setCreateChatRoomLoading(false);
        message.error("Sorry, there was an error creating this chat room");
      });
  };

  return (
    <Modal
      title="Create New Chat Room"
      visible={createChatOpen}
      onOk={null}
      footer={null}
      maskClosable={false}
      onCancel={() => setCreateChatOpen(false)}
    >
      <Spin spinning={createChatRoomLoading}>
        <Text>Chat Room Name (Required)</Text>
        <Input
          size="large"
          placeholder="Chat Room Name"
          value={chatName}
          onChange={(event) => setChatName(event.target.value)}
        />
        <br />
        <br />
        <Text>Add Drivers To Chat</Text>
        <Select
          mode="multiple"
          style={{ width: "100%" }}
          placeholder="Add drivers to your chat"
          size="large"
          value={chatDrivers}
          onChange={(value) => setChatDrivers(value)}
          showSearch={true}
          filterOption={(inputValue, option) => {
            return option.children
              .toString()
              .toLowerCase()
              .includes(inputValue.toLowerCase());
          }}
        >
          {renderDriverOptions()}
        </Select>
        <br />
        <br />
        <Text>Chat Managers</Text>
        <Select
          mode="multiple"
          style={{ width: "100%" }}
          placeholder="Add managers to your chat"
          size="large"
          value={chatManagers}
          onChange={(value) => setChatManagers(value)}
          showSearch={true}
          filterOption={(inputValue, option) => {
            return option.children
              .toString()
              .toLowerCase()
              .includes(inputValue.toLowerCase());
          }}
        >
          {renderManagerOptions()}
        </Select>
        <br />
        <br />
        <Button
          block
          type="primary"
          onClick={() => createChatRoom()}
          size="large"
          disabled={!checkCanSubmit()}
        >
          Create New Chat Room
        </Button>
      </Spin>
    </Modal>
  );
}

export default CreateChatRoom;
