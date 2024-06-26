import prisma from "@utils/prismaDB";
import { UserInputError } from "apollo-server-errors";

const sgMail = require("@sendgrid/mail");
sgMail.setApiKey(process.env.SEND_GRID_API_KEY);

export default {
  Mutation: {
    inviteOrganizationUser: async (
      _,
      { email, role, additionalInformation },
      context
    ) => {
      role = role.toString();
      role = role.replace(/[\r\n]/gm, "");

      // Check to ensure the user is logged in
      if (!context.user) throw new UserInputError("Login required");

      // Check to make sure the user inviting, is they are the owner of the organization
      if (!context.user.ownedOrganization)
        throw new UserInputError("Owner Role required");

      // Check to make sure the user is not already in the organization
      const userCheckInOrganization = await prisma.organizationUser.findMany({
        where: {
          organizationId: context.user.ownedOrganization.id,
        },
        select: {
          id: true,
          user: {
            select: {
              email: true,
            },
          },
        },
      });

      // Yes then return error
      let userAlreadyInOrg = false;
      userCheckInOrganization.map((potentialOrganizationUser) => {
        if (potentialOrganizationUser.user) {
          if (potentialOrganizationUser.user.email.toLowerCase() === email) {
            userAlreadyInOrg = true;
          }
        }
      });
      if (userAlreadyInOrg) {
        throw new UserInputError("User is already in the organization");
      }

      // Check to see if the user exists or not
      let potentialUsers = await prisma.user.findMany({
        where: {
          email: email,
        },
      });

      // Loop through to find user
      let userToInvite = null;
      potentialUsers.map((userObject) => {
        if (!userObject) {
          return;
        }
        if (userObject.email.toLowerCase() === email.toLowerCase()) {
          userToInvite = userObject;
        }
      });

      // If yes, then add them as an organization user
      if (userToInvite) {
        // Create the organization user
        await prisma.organizationUser.create({
          data: {
            active: true,
            user: {
              connect: {
                id: userToInvite.id,
              },
            },
            organization: {
              connect: {
                id: context.user.ownedOrganization.id,
              },
            },
          },
        });
      } else {
        // If not then send them an invite link & create the organization invite key
        // Create the organization user
        let organizationInvite = await prisma.organizationInviteKey.create({
          data: {
            active: true,
            role: role,
            additionalInformation: additionalInformation
              ? additionalInformation
              : {},
            organization: {
              connect: {
                id: context.user.ownedOrganization.id,
              },
            },
          },
        });

        const msg = {
          to: email, // Change to your recipient
          from: "noreply@em9019.kidz-n-motion.app", // Change to your verified sender
          subject: "Kidz-N-Motion Account Invite",
          html: `
                <p>You have been invited to join ${context.user.firstName} ${context.user.lastName}'s organization: ${context.user.ownedOrganization.name}. Click the link below to sign up:</p>
                <br />
                <a href="https://dashboard.kidz-n-motion.app/authentication/get-started?role=${role}&key=${organizationInvite.id}">https://dashboard.kidz-n-motion.app/authentication/get-started?role=${role}&key=${organizationInvite.id}</a>
                <br />
                <strong>If you did not request this password reset, you can ignore this message</strong>
            `,
        };
        await sgMail
          .send(msg)
          .then(() => {
          })
          .catch((error) => {
            console.error(error.response.body);
          });

      }

      return true;
    },
  },
};
