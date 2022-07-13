import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const generateTherapistToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_THERAPIST_SECRET, {
    expiresIn: "7d",
  });
};

export default generateTherapistToken;