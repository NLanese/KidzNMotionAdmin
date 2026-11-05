/* eslint-disable import/no-anonymous-default-export */
import prisma from "@utils/prismaDB";
import { UserInputError } from "apollo-server-errors";
import { makeRandomString, changeTimeZone } from "@helpers/common";
import { getUserObject } from "@helpers/api/auth";
import { usernameTaken, friendlyUniqueError } from "../../../prisma_functions/user/findConflicts";

export default {
  Mutation: {
    addChild: async (
      _,
      { childFirstName, childLastName, childUsername, childDateOfBirth },
      context
    ) => {
      if (!context.user) throw new UserInputError("Login required");

      if (context.user.role !== "GUARDIAN")
        throw new UserInputError("Only guardians can add children");

      // Before: this lookup wasn't awaited, so it never caught a duplicate.
      if (await usernameTaken(childUsername)) {
        throw new UserInputError("Username already taken.");
      }

      // Create the child user
      // Create the child for the guardian account
      let newChild = await prisma.user
        .create({
          data: {
            email: makeRandomString(60) + "@kidz-n-motion.com",
            password: makeRandomString(60),
            role: "CHILD",
            firstName: childFirstName,
            lastName: childLastName,
            username: childUsername,
            childDateOfBirth: childDateOfBirth,
            guardian: {
              connect: {
                id: context.user.id,
              },
            },
          },
        })
        .catch((err) => {
          const friendly = friendlyUniqueError(err);
          if (friendly) throw new UserInputError(friendly);
          throw new Error(err);
        });

      let newChildUserObject = await getUserObject({
        id: newChild.id,
        role: "CHILD",
      });
      return newChildUserObject;
    },
  },
};
