import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const generateUserToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_USER_SECRET, {
    expiresIn: "7d",
  });
};

export default generateUserToken;