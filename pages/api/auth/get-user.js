import { handleAuth } from "@helpers/api/auth";

export default async function handler(req, res) {
  const userObject = await handleAuth(res, req.headers.authorization, 1);
  if (!userObject) return;

  res.status(200).json({ user: userObject });
}
