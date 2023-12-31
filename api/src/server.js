import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import userRoutes from "./routers/userRoutes.js";
import filmRoutes from "./routers/filmRoutes.js";

const app = express();
app.use(express.json());
app.use(cookieParser());
const corsOptions = {
  origin: "http://localhost:8000",
  credentials: true,
};
app.use(cors(corsOptions));

app.use("/user", userRoutes);
app.use("/film", filmRoutes);

app.listen(8000);
