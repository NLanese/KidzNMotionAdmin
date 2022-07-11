import prisma from "@utils/prismaDB";
var CryptoJS = require("crypto-js");

export default {
  Mutation: {
    devCreateUser: async (_, { password }) => {
      try {

        // Encrypt the user password
        const encryptedPassword = CryptoJS.AES.encrypt(
          password,
          process.env.PASSWORD_SECRET_KEY
        ).toString();

        // Create the dev user object
        const userObject = await prisma.user.create({
          data: {
            email: Math.random().toString() + "@cleancult.com",
            firstName: "Zachary",
            lastName: "Bedrosian",
            password: encryptedPassword,
          },
        });

        return userObject;

      } catch (error) {
        
        throw new Error(error);
      }
    },
  },
};
