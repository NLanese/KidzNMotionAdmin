const { PrismaClient } = require("@prisma/client");
var CryptoJS = require("crypto-js");
const prisma = new PrismaClient();
import { makeRandomString, changeTimeZone } from "@helpers/common";

export default async function handler(req, res) {
  const body = req.body;

  // It no email or password return 4000
  if (!body.email || !body.password) {
    res
      .status(400)
      .json({ message: "Email and password are required to login." });
    return;
  }

  // Retrieve the users that match the email address
  const potentialUsers = await prisma.user.findMany({
    where: {
      email: {
        contains: body.email,
      },
    },
    select: {
      id: true,
      email: true,
      password: true,
    },
  });

  

  // Loop through to find user
  let userToLogin = null;
  potentialUsers.map((userObject) => {
    if (userObject.email.toLowerCase() === body.email.toLowerCase()) {
      userToLogin = userObject;
    }
  });

  if (!userToLogin) {
    res
      .status(400)
      .json({ message: "Email/Password are incorrect. Cannot login." });
    return;
  }

  // Check the users login attemps and the last one
  var oneHourAgo = new Date(new Date().getTime() - 60 * 60 * 1000);
  const loginAttempts = await prisma.loginAttempts.findMany({
    where: {
      createdAt: {
        gte: changeTimeZone(oneHourAgo, "America/New_York"),
      },
      userId: userToLogin.id,
    },
  });

  if (loginAttempts.length >= 5) {
    res
      .status(400)
      .json({
        message:
          "You have reached your 5 try limit this hour. Please wait and try again.",
      });
    return;
  }

  

  // Check the password against the password attempt
  let bytes = CryptoJS.AES.decrypt(
    userToLogin.password,
    process.env.PASSWORD_SECRET_KEY
  );
  let decryptedPassword = bytes.toString(CryptoJS.enc.Utf8);

  
  // If the passwords match
  if (decryptedPassword === body.password) {
    // Create the client string
    const jwtTokenString = makeRandomString(60);

    // Remove all old jwt tokens
    await prisma.jWTToken.deleteMany({
      where: {
        userId: userToLogin.id,
        active: false,
      },
    });

    
    // Create the new JWT token
    await prisma.jWTToken.create({
      data: {
        active: true,
        encryptedToken: jwtTokenString,
        createdAt: changeTimeZone(new Date(), "America/New_York"),
        user: {
          connect: {
            id: userToLogin.id,
          },
        },
      },
    });

    // Encypt the JWT token before sending down
    const clientToken = CryptoJS.AES.encrypt(
      jwtTokenString,
      process.env.JWT_SECRET_KEY
    ).toString();
    
    res.status(200).json({ token: clientToken });

    return;
  } else {
    await prisma.loginAttempts.create({
      data: {
        user: {
          connect: {
            id: userToLogin.id,
          },
        },
        createdAt: changeTimeZone(new Date(), "America/New_York"),
      },
    });

    res
      .status(400)
      .json({ message: "Email/Password are incorrect. Cannot login." });
    return;
  }
}
