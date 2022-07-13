import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const generateAdminToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_ADMIN_SECRET, {
    expiresIn: "7d",
  });
};

export default generateAdminToken;