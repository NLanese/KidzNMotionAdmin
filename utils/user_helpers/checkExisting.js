import db from "../generatePrisma.js.js";

const checkExistingUserByEmail = async (userEmail) => {
  const existingUserEmail = await db.user.findUnique({
    where: {
      email: userEmail,
    },
  });

  if (existingUserEmail) {
    return true;
  } else {
    return false;
  }
};

const checkExistingUserByPhone = async (userPhoneNumber) => {
  const existingUserPhone = await db.user.findUnique({
    where: {
      phoneNumber: userPhoneNumber,
    },
  });

  if (existingUserPhone) {
    return true;
  } else {
    return false;
  }
};

const checkExistingUserByName = async (userUsername) => {
  const existingUserPhone = await db.user.findUnique({
    where: {
      username: userUsername,
    },
  });

  if (existingUserPhone) {
    return true;
  } else {
    return false;
  }
};

export {
  checkExistingUserByEmail,
  checkExistingUserByPhone,
  checkExistingUserByName,
};
