import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import cors from "cors";
import dotenv from "dotenv";
import routes from "./routes/routes.js";
import { sql } from "./config/db.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8000;

const allowedOrigins =
  process.env.NODE_ENV === "production"
    ? ["https://hte-frontend.vercel.app"]
    : ["http://localhost:3000", "https://hte-frontend.vercel.app"];

// to get built-in security features with various http headers
app.use(helmet());

// to log HTTP requests in the console
// this is useful for debugging and monitoring
// eg POST /api/hte/product 201
app.use(morgan("dev"));

// to allow cross-origin requests, enables the backend to accept requests from the frontend
// this project is not using any frontend, but it's a good practice to include it
// in case you want to connect a frontend later
app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
);

// to parse JSON request bodies
app.use(express.json());

// Mount the routes under /api
app.use("/api/hte", routes);

app.listen(PORT, async () => {
  console.log(`Server is running on port ${PORT}`);
  try {
    console.log("Database connected successfully");
  } catch (error) {
    console.error("Database connection failed:", error);
  }
});
