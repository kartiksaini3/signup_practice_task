import express from "express";
import { bulkInsertToTable } from "./bulk-insert.service.js";

export const bulkInsertRoutes = express.Router();

bulkInsertRoutes.post("/:tableName", bulkInsertToTable);
