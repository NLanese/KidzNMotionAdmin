/* eslint-disable import/no-anonymous-default-export */
import prisma from "@utils/prismaDB";
import { UserInputError } from "apollo-server-errors";

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

      // Get conflicting user
      let conflictingUsers = await prisma.user.findMany({
        where: {
          email: email
        },
        select: {
         id: true
        },
      });


      let emailAlreadyTaken = false;
      conflictingUsers.map((userObject) => {
        if (userObject.id !== context.user.id) {
          emailAlreadyTaken = true;
        }
      })

      if (emailAlreadyTaken) {
        throw new UserInputError("Email already exists.");
      }

      let conflictingUsers2 = await prisma.user.findMany({
        where: {
          username: username
        },
        select: {
         id: true
        },
      });



      
      await prisma.user.update({
        where: {
          id: context.user.id,
        },
        data: {
          firstName: firstName,
          lastName: lastName,
          email: email,
          phoneNumber: phoneNumber,
          title: title,
          username: username
        },
      });


    },
  },
};
