/* eslint-disable import/no-anonymous-default-export */
import prisma from "@utils/prismaDB";
import { UserInputError } from "apollo-server-errors";
import { emailTaken, usernameTaken, friendlyUniqueError } from "../../../prisma_functions/user/findConflicts";

export default {
  Mutation: {
    editUser: async (_, {
        email,
        firstName,
        lastName,
        phoneNumber,
        title,
        username,
    }, context) => {

      if (!context.user) throw new UserInputError("Login required");

      // Only fields that were sent are changed (Prisma skips `undefined`).
      // An empty email or username is ignored rather than wiping the value.
      const newEmail = email && email.trim() ? email.trim() : undefined;
      const newUsername = username && username.trim() ? username.trim() : undefined;

      // Before: the email check ran even when no email was sent, which matched
      // every account and always said "Email already exists".
      if (newEmail && await emailTaken(newEmail, context.user.id)) {
        throw new UserInputError("Email already exists.");
      }

      // Before: this lookup ran but its result was never used, so a taken
      // username fell through to a raw database error.
      if (newUsername && await usernameTaken(newUsername, context.user.id)) {
        throw new UserInputError("Username already taken.");
      }

      try {
        await prisma.user.update({
          where: {
            id: context.user.id,
          },
          data: {
            firstName: firstName,
            lastName: lastName,
            email: newEmail,
            phoneNumber: phoneNumber,
            title: title,
            username: newUsername,
          },
        });
      } catch (err) {
        const friendly = friendlyUniqueError(err);
        if (friendly) throw new UserInputError(friendly);
        throw err;
      }

      return true;
    },
  },
};
