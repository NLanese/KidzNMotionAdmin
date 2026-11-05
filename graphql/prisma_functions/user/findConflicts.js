import prisma from "@utils/prismaDB";

// "Is this email / username already used by someone else?"
// The database compares text case-insensitively (MySQL's default collation),
// so "Jordan" and "jordan" count as the same, matching the unique indexes.
// Pass exceptUserId when the signed-in user is editing their own account.

export async function emailTaken(email, exceptUserId) {
  if (!email) return false;
  const other = await prisma.user.findFirst({
    where: { email: email.trim(), ...(exceptUserId ? { NOT: { id: exceptUserId } } : {}) },
    select: { id: true },
  });
  return !!other;
}

export async function usernameTaken(username, exceptUserId) {
  if (!username) return false;
  const other = await prisma.user.findFirst({
    where: { username: username.trim(), ...(exceptUserId ? { NOT: { id: exceptUserId } } : {}) },
    select: { id: true },
  });
  return !!other;
}

/**
 * Turns Prisma's unique-constraint error (P2002) into the same friendly
 * message the checks above give. Covers the rare race where two people claim
 * the same email/username at the same moment.
 */
export function friendlyUniqueError(err) {
  if (err && err.code === "P2002") {
    const target = String(err.meta && err.meta.target ? err.meta.target : "").toLowerCase();
    if (target.includes("username")) return "Username already taken.";
    if (target.includes("email")) return "Email already exists.";
  }
  return null;
}
