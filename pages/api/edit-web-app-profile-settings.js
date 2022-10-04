import { handleAuth } from "@helpers/api/auth";
import prisma from "@utils/prismaDB";

export default async function handler(req, res) {
  const body = req.body;

  const userToken = body.token;
  const newProfilePic = body.newProfilePic;

  // Get the user object
  const user = await handleAuth(userToken);
  if (!user) {
    res.status(404).json({});
  }
  if (!newProfilePic) {
    res.status(404).json({});
  }

  // Update the user owned organization with their stripe id
  await prisma.user.update({
    where: {
      id: user.id,
    },
    data: {
      profilePic: newProfilePic,
    },
  });

  res.status(200).json({});
}
