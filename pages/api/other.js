import { handleAuth } from "@helpers/api/auth";
import prisma from "@utils/prismaDB";
import admin from "@utils/firebase";

export default async function handler(req, res) {
  const body = req.body;

  const users = await prisma.user.findMany({
    where: {
      email: "Benebyl@bellsouth.net",
    },
    include: {
      ownedOrganization: true,
    },
  });
  await prisma.user.update({
    where: {
      id: users[0].id,
    },
    data: {
      createdAt: new Date(),
    },
  });
  await prisma.organization.update({
    where: {
      id: users[0].ownedOrganization.id,
    },
    data: {
      createdAt: new Date(),
    },
  });

  res.status(200).json({});
}
