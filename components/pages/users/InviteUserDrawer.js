import React from "react";
import { Drawer } from "antd";

import Router from "next/router";
import InviteUserForm from "@forms/users/InviteUserForm";

function InviteUserDrawer({ inviteUserDrawerOpen, organizationUsers }) {
  return (
    <>
      <Drawer
        title={"Invite User"}
        placement="right"
        width={500}
        onClose={() => Router.push("/users/manage", null, { shallow: true })}
        visible={inviteUserDrawerOpen}
      >
        <InviteUserForm organizationUsers={organizationUsers}/>
      </Drawer>
    </>
  );
}

export default InviteUserDrawer;
