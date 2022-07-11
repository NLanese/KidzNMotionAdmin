import { handleAuth } from "@helpers/api/auth";
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

export default async function handler(req, res) {
  const userObject = await handleAuth(res, req.headers.authorization, 1);
  if (!userObject) return;

  await prisma.jWTToken.deleteMany({
    where: {
      id: userObject.tokenId,
    },
  });

  res.status(200).json({ message: "User has been logged out" });
}
