const { PrismaClient } = require("@prisma/client");
var CryptoJS = require("crypto-js");
const prisma = new PrismaClient();
import { changeTimeZone } from "@helpers/common";

export const handleAuth = async (res, clientToken) => {
  
  // Decrypt the client side token
  let bytes = CryptoJS.AES.decrypt(clientToken, process.env.JWT_SECRET_KEY);
  let decryptedJWTToken = bytes.toString(CryptoJS.enc.Utf8);

  // Get the list of potential tokens
  const potentialJWTTokens = await prisma.jWTToken.findMany({
    where: {
      token: decryptedJWTToken,
      active: true,
    },
  });

  // Loop through tokens to ensure exact match
  let userJWTToken = null;
  potentialJWTTokens.map((tokenObject) => {
    if (tokenObject.encryptedToken === decryptedJWTToken) {
      userJWTToken = tokenObject;
    }
  });

  // If there is a vlid token then find the user object and return.
  if (userJWTToken) {
    let oneDayAgoTimeStamp = changeTimeZone(
      new Date(new Date().getTime() - 24 * 60 * 60 * 1000),
      "America/New_York"
    );
    if (userJWTToken.createdAt <= oneDayAgoTimeStamp) {
      await prisma.jWTToken.update({
        where: {
          id: userJWTToken.id,
        },
        data: {
          active: false,
        },
      });
      res.status(200).json({ message: "Access denied" });
      return null;
    } else {
      await prisma.jWTToken.update({
        where: {
          id: userJWTToken.id,
        },
        data: {
          createdAt: changeTimeZone(new Date()),
        },
      });
    }

    const userObject = await prisma.user.findUnique({
      where: {
        id: userJWTToken.userId,
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
      },
    });
    userObject.tokenId = userJWTToken.id;
    return userObject;
  } else {
    // If not then reurn an access denied
    res.status(200).json({ message: "Access denied" });
    return null;
  }
};
