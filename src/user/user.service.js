import { compare, hash } from "bcrypt";
import jwt from "jsonwebtoken";
import {
  createUser,
  getUserByEmail,
  updateUserPassword,
} from "./user.repository.js";
import {
  commonReturn,
  sendLinkViaSendGrid,
  sendOTPViaSendGrid,
} from "../utils/functions.js";
import { redisClient } from "../redis.js";

export const checkIfUserAlreadyExists = async (req, res) => {
  const { email } = req.body;
  const foundUser = await getUserByEmail(email);

  if (foundUser?.password) return commonReturn(res, "User Already Registered");
  else if (foundUser) {
    return commonReturn(res, "User Verified");
  } else if (req?.user?.role === "superAdmin") {
    // send mail to that user to register
    await sendLinkViaSendGrid(email);
  } else return commonReturn(res, "User not found", undefined, 404);
};

export const signUp = async (req, res) => {
  const { email, password } = req.body;
  const saltRounds = 10;
  const hashedPassword = await hash(password, saltRounds);
  try {
    await updateUserPassword(email, hashedPassword);
  } catch (err) {
    console.log("vsdvsddvsvd", err.message);

    // 23505 -> unique_violation in PostgreSQL
    if (err.code === "23505") {
      return commonReturn(res, "User Already Exists", undefined, 400);
    } else if (err.code === 999)
      return commonReturn(res, err.message, undefined, 400);
    else return commonReturn(res, undefined, undefined, 500);
  }
  return commonReturn(res, "Registered successfully");
};

export const signIn = async (req, res) => {
  const { email, password } = req.body;
  const foundUser = await getUserByEmail(email);

  if (foundUser && (await compare(password, foundUser.password))) {
    const accessToken = jwt.sign(req.body, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    return commonReturn(res, "User signed in successfully", { accessToken });
  } else return commonReturn(res, "Wrong Credentials Entered.", undefined, 400);
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
    return commonReturn(res, "OTP expired or not found", undefined, 404);
  if (storedOtp !== OTP)
    return commonReturn(res, "Invalid OTP", undefined, 400);

  await redisClient.del(`otp:${email}`);
  await createUser(email);
  return commonReturn(res, "OTP verified successfully");
};
