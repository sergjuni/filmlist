import express from "express";
import cors from "cors";
import bcrypt from "bcrypt";
import { openDb } from "./dbconfig.js";
import cookieParser from "cookie-parser";
import { createToken, validateToken } from "./JWT.js";
import userRoutes from "./routers/userRoutes.js";

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(cors());

app.use("/user", userRoutes);

app.listen(3000);
