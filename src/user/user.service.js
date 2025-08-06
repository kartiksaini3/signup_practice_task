import { compare, hash } from "bcrypt";
import jwt from "jsonwebtoken";
import { createUser, getUserByUsername } from "./user.repository.js";
import {
  commonReturn,
  sendLinkViaSendGrid,
  sendOTPViaSendGrid,
} from "../utils/functions.js";

export const checkIfUserAlreadyExists = async (req, res) => {
  const { email } = req.body;
  const foundUser = await getUserByUsername(email);

  if (foundUser) {
    return commonReturn(res, "User Already Registered");
  } else if (req.user.role === "superAdmin") {
    // send mail to that user to register
    await sendLinkViaSendGrid(email);
  } else return commonReturn(res, "User not found", null, 404);
};

export const signUp = async (req, res) => {
  const { email, password } = req.body;
  const saltRounds = 10;
  const hashedPassword = await hash(password, saltRounds);
  try {
    await createUser({ email, hashedPassword }, res);
  } catch {
    // 23505 = unique_violation in PostgreSQL
    if (err.code === "23505") {
      commonReturn(res, "User Already Exists", null, 400);
    } else commonReturn(res, null, null, 500);
  }
  return commonReturn(res, "Password Set Successfully");
};

export const signIn = async (req, res) => {
  const { email, password } = req.body;
  const foundUser = await getUserByUsername(email);

  if (foundUser && (await compare(password, foundUser.password))) {
    const accessToken = jwt.sign(req.body, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    return commonReturn(res, "User signed in successfully", { accessToken });
  } else return commonReturn(res, "Wrong Credentials Entered.", null, 400);
};

export const sendOTP = async (req, res) => {
  const { email } = req.body;
  await sendOTPViaSendGrid(email);
  return commonReturn(res, `OTP sent to ${email}`);
};

export const verifyOTP = async (req, res) => {
  const { email, OTP } = req.body;
  const storedOtp = await redisClient.get(`otp:${email}`);

  if (!storedOtp)
    return commonReturn(res, "OTP expired or not found", null, 404);
  if (storedOtp !== OTP) return commonReturn(res, "Invalid OTP", null, 400);

  await redisClient.del(`otp:${email}`);
  return commonReturn(res, "OTP verified successfully");
};
