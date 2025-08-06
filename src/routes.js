import express from "express";
import { userRoutes } from "./user/user.controller.js";

export const routes = express.Router();

routes.use("/user", userRoutes);
