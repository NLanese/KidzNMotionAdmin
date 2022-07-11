import React, { useState, useEffect } from "react";
import { driverState, managerState, chatState } from "@atoms";
import { useRecoilValue, useRecoilState } from "recoil";

import { useMutation } from "@apollo/client";
import { DYNAMIC_UPDATE_CHAT } from "@graphql/operations";

import {
  Button,
  Modal,
  Input,
  Typography,
  Spin,
  message,
  Select,
  Tabs,
  tabs,
} from "antd";

const { TabPane } = Tabs;
const { Text } = Typography;
const { Option } = Select;

function ChatOptions({
  chatOptionsModalOpen,
  chatRoomObject,
  user,
  setChatOptionsModalOpen,
  setChatRoomObject,
}) {
  const managers = useRecoilValue(managerState);
  const drivers = useRecoilValue(driverState);
  const [chatRooms, setChatRooms] = useRecoilState(chatState);

  const [updateChatLoading, setUpdateChatLoading] = useState(false);
  const [chatName, setChatName] = useState("");
  const [chatGuests, setChatGuests] = useState([]);

  // Mutations
  const [dynamicUpdateChatRoom, {}] = useMutation(DYNAMIC_UPDATE_CHAT);

  useEffect(() => {
    setChatName(chatRoomObject.chatroomName);
    setUpdateChatLoading(false);
    setChatGuests(getInitialChatGuests());
  }, [chatRoomObject.id]);

  const getInitialChatGuests = () => {
    let chatGuests = [];
    chatRoomObject.guests.map((guestObject) => {
      if (guestObject.id === user.id) return;
      chatGuests.push({
        value: guestObject.id,
        text: guestObject.firstname + " " + guestObject.lastname,
      });
    });
    return chatGuests;
  };

  const checkCanSubmit = () => {
    if (chatName.length > 0) {
      if (chatGuests.length > 0) {
        return true;
      }
    }
    return false;
  };

  const getGuestsForSubmit = () => {
    let guests = [];
    chatGuests.map((chatDriverId) => {
      let driverObject = drivers.filter(
        (driverObject) => {return driverObject.id === chatDriverId.value} 
      )[0];
      if (driverObject) {
        guests.push(driverObject);
      }
    });
    chatGuests.map((chatManagerId) => {
      let managerObject = managers.filter(
        (managerObject) => {return managerObject.id === chatManagerId.value}
      )[0];
      if (managerObject) {
        guests.push(managerObject);
      }
    });
    chatGuests.map((chatDriverId) => {
      let driverObject = drivers.filter(
        (driverObject) => {return driverObject.id === chatDriverId} 
      )[0];
      if (driverObject) {
        guests.push(driverObject);
      }
    });
    chatGuests.map((chatManagerId) => {
      let managerObject = managers.filter(
        (managerObject) => {return managerObject.id === chatManagerId}
      )[0];
      if (managerObject) {
        guests.push(managerObject);
      }
    });

    guests.push(user)
    return guests;
  };

  const updateChatRoom = async () => {
    setUpdateChatLoading(true);
    await dynamicUpdateChatRoom({
      variables: {
        role: user.role,
        chatroomId: chatRoomObject.id,
        token: localStorage.getItem("token"),
        name: chatName,
        guests: getGuestsForSubmit(),
      },
    })
      .then(async (resolved) => {
        setUpdateChatLoading(false);
        let newChatRoomObject = resolved.data.dynamicUpdateChatroom;
        newChatRoomObject.messages = chatRoomObject.messages;
        setChatRoomObject(newChatRoomObject);
        message.success("Chat Room Updated");
        setUpdateChatLoading(false);
        setChatOptionsModalOpen(false);
      })
      .catch((error) => {
        console.log(error);
        setUpdateChatLoading(false);
        message.error("Sorry, there was an error creating this chat room");
      });
  };

  const renderDriverOptions = () => {
    return drivers.map((driverObject) => {
      return (
        <Option key={driverObject.id} disabled={false}>
          {driverObject.firstname} {driverObject.lastname} (Driver)
        </Option>
      );
    });
  };

  const renderManagerOptions = () => {
    return managers.map((managerOption) => {
      return (
        <Option key={managerOption.id} disabled={false}>
          {managerOption.firstname} {managerOption.lastname} (Manager)
        </Option>
      );
    });
  };

  return (
    <Modal
      title={"Edit " + chatRoomObject.chatroomName}
      visible={chatOptionsModalOpen}
      onOk={null}
      footer={null}
      width={700}
      maskClosable={false}
      onCancel={() => setChatOptionsModalOpen(false)}
    >
      <Spin spinning={updateChatLoading}>
        <Text>Chat Room Name (Required)</Text>
        <Input
          size="large"
          placeholder="Chat Room Name"
          value={chatName}
          onChange={(event) => setChatName(event.target.value)}
        />
        <br />
        <br />
        <Tabs defaultActiveKey="1">
          <TabPane tab="Edit Chat Guests" key="1">
            <Select
              mode="multiple"
              style={{ width: "100%" }}
              placeholder="Edit guests to your chat"
              size="large"
              value={chatGuests}
              onChange={(value) => setChatGuests(value)}
              showSearch={true}
              filterOption={(inputValue, option) => {
                return option.children
                  .toString()
                  .toLowerCase()
                  .includes(inputValue.toLowerCase());
              }}
            >
              {renderDriverOptions()}
              {renderManagerOptions()}
            </Select>
          </TabPane>
        </Tabs>
        <br />
        <Button
          block
          type="primary"
          disabled={!checkCanSubmit()}
          onClick={() => updateChatRoom()}
          size="large"
          loading={updateChatLoading}
        >
          Save Chat Settings
        </Button>
      </Spin>
    </Modal>
  );
}

export default ChatOptions;
