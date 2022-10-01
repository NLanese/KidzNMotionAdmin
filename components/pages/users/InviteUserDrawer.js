import React from "react";
import { Drawer } from "antd";

import Router from "next/router";
import InviteUserForm from "@forms/users/InviteUserForm";
import InvitePatientForm from "@forms/users/InvitePatientForm";

function InviteUserDrawer({
  inviteUserDrawerOpen,
  organizationUsers,
  therapistMode,
}) {
  return (
    <>
      <Drawer
        title={!therapistMode ? "Invite User" : "Invite Patient/User"}
        placement="right"
        width={500}
        onClose={() =>
          Router.push(
            therapistMode ? "/patients/manage" : "/users/manage",
            null,
            { shallow: true }
          )
        }
        visible={inviteUserDrawerOpen}
      >
        {(therapistMode && inviteUserDrawerOpen) ? (
          <InvitePatientForm
            organizationUsers={organizationUsers}
            therapistMode={therapistMode}
          />
        ) : (
          <InviteUserForm
            organizationUsers={organizationUsers}
            therapistMode={therapistMode}
          />
        )}
      </Drawer>
    </>
  );
}

export default InviteUserDrawer;
