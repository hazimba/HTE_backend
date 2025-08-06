import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// to get built-in security features with various http headers
app.use(helmet());

// to log HTTP requests in the console
app.use(morgan("dev"));

// to allow cross-origin requests
// this is useful when the frontend and backend are hosted on different domains or ports
// it enables the backend to accept requests from the frontend
app.use(cors());

app.use(express.json());

app.get("/", (req, res) => {
  console.log(res.getHeaders());
  res.send("Hello, World!");
});

app.get("/api", (req, res) => {
  res.json({ message: "Welcome to the API!" });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
