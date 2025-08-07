import express from "express";
import {
  checkIfUserAlreadyExists,
  sendOTP,
  signIn,
  signUp,
  verifyOTP,
} from "./user.service.js";
import { authenticateToken } from "../middlewares.js";

export const userRoutes = express.Router();

userRoutes.post(
  "/send-mail-to-user",
  authenticateToken,
  checkIfUserAlreadyExists
);
userRoutes.post("/check-user", checkIfUserAlreadyExists);
userRoutes.post("/send-otp", sendOTP);
userRoutes.post("/verify-otp", verifyOTP);
userRoutes.post("/sign-up", signUp);
userRoutes.post("/sign-in", signIn);
