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

userRoutes.get(
  "/send-mail-to-user",
  authenticateToken,
  checkIfUserAlreadyExists
);
userRoutes.get("/check-user", checkIfUserAlreadyExists);
userRoutes.post("/sign-up", signUp);
userRoutes.post("/sign-in", signIn);
userRoutes.post("/send-otp", sendOTP);
userRoutes.post("/verify-otp", verifyOTP);
