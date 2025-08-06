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
    commonReturn(res, "User Already Registered");
  } else if (req.user.role === "superAdmin") {
    // send mail to that user to register
    await sendLinkViaSendGrid(email);
  } else commonReturn(res, "User not found", null, 404);
};

export const signUp = async (req, res) => {
  const { email, password } = req.body;
  const saltRounds = 10;
  const hashedPassword = await hash(password, saltRounds);

  await createUser({ email, hashedPassword }, res);
  commonReturn(res, "Password Set Successfully");
};

export const signIn = async (req, res) => {
  const { email, password } = req.body;
  const foundUser = await getUserByUsername(email);

  if (foundUser && (await compare(password, foundUser.password))) {
    const accessToken = jwt.sign(req.body, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    commonReturn(res, "User signed in successfully", { accessToken });
  } else commonReturn(res, "Wrong Credentials Entered.", null, 400);
};

export const sendOTP = async (req, res) => {
  const { email } = req.body;
  await sendOTPViaSendGrid(email);
  commonReturn(res, `OTP sent to ${email}`);
};

export const verifyOTP = async (req, res) => {
  const { email, OTP } = req.body;
  const storedOtp = await redisClient.get(`otp:${email}`);

  if (!storedOtp) commonReturn(res, "OTP expired or not found", null, 404);
  if (storedOtp !== OTP) commonReturn(res, "Invalid OTP", null, 400);

  await redisClient.del(`otp:${email}`);
  commonReturn(res, "OTP verified successfully");
};
