/* eslint-disable import/no-anonymous-default-export */
import prisma from "@utils/prismaDB";
import { UserInputError } from "apollo-server-errors";
import { makeRandomString, changeTimeZone } from "@helpers/common";
import { getUserObject } from "@helpers/api/auth"

export default {
  Mutation: {
    addChild: async (
      _,
      { 
        childFirstName,
        childLastName,
        childDateOfBirth
       },
      context
    ) => {
      if (!context.user) throw new UserInputError("Login required");
      
      if (context.user.role !== "GUARDIAN") throw new UserInputError("Only guardians can add children");
      
      // Create the child user
      // Create the child for the guardian account
      let newChild = await prisma.user.create({
        data: {
          email: makeRandomString(60) + "@kidsinmotion.com",
          password: makeRandomString(60),
          role: "CHILD",
          firstName: childFirstName,
          lastName: childLastName,
          childDateOfBirth: childDateOfBirth,
          guardian: {
            connect: {
              id: context.user.id,
            },
          },
        },
      });

      let newChildUserObject = await getUserObject(newChild)
      return newChildUserObject
    },
  },
};