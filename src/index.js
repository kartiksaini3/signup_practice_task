import dotenv from "dotenv";
import express from "express";
import { createTables } from "./db.js";
import { routes } from "./routes.js";

dotenv.config();
export const app = express();

// Middlewares
app.use(express.json());

// Routes
app.use("/api", routes);

// Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, async () => {
  console.log(`Server running on port : ${PORT}`);
  await createTables();
});
