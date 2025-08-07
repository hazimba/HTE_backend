import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import cors from "cors";
import dotenv from "dotenv";
import routes from "./routes/routes.js";
import { sql } from "./config/db.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(helmet()); // to get built-in security features with various http headers
app.use(morgan("dev")); // to log HTTP requests in the console
app.use(cors()); // to allow cross-origin requests, enables the backend to accept requests from the frontend

app.use(express.json()); // to parse JSON request bodies
app.use("/api/hte", routes); // Mount the routes under /api

app.listen(PORT, async () => {
  console.log(`Server is running on port ${PORT}`);
  try {
    console.log("Database connected successfully");
  } catch (error) {
    console.error("Database connection failed:", error);
  }
});
