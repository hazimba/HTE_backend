import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import cors from "cors";
import dotenv from "dotenv";
import routes from "./routes/routes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(helmet()); // to get built-in security features with various http headers
app.use(morgan("dev")); // to log HTTP requests in the console
app.use(cors()); // to allow cross-origin requests, enables the backend to accept requests from the frontend

app.use("/api/products", routes); // Mount the routes under /api
app.use(express.json());

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
