import express from "express";
import { userRoutes } from "./user/user.controller.js";
import { bulkInsertRoutes } from "./bulk-insert/bulk-insert.controller.js";

export const routes = express.Router();

routes.use("/user", userRoutes);
routes.use("/bulk-insert", bulkInsertRoutes);
