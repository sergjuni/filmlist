import express from "express";
import { createUserTable, createAdminTable } from "./controller/pessoa.js";
import router from "./routes.js";
import cors from "cors";
import bcrypt from "bcrypt";
import { openDb } from "./dbconfig.js";
import cookieParser from "cookie-parser";
import { createToken, validateToken } from "./JWT.js";

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(cors());

app.use(router);

app.post("/register", async (req, res) => {
  const { user_name, password } = req.body;
  try {
    const db = await openDb();
    const hashPassword = await bcrypt.hash(password, 10);
    await db.run("INSERT INTO Admin (user_name, password) VALUES (?, ?)", [
      user_name,
      hashPassword,
    ]);
    res.json("User created");
  } catch (error) {
    if (error && error.errno === 19 && error.code === "SQLITE_CONSTRAINT") {
      res
        .status(400)
        .json({ error: "Duplicate username. Please choose a different one." });
    } else {
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
});

app.post("/login", async (req, res) => {
  const { user_name, password } = req.body;
  const db = await openDb();
  try {
    const user = await db.get("SELECT * FROM Admin WHERE user_name=?", [
      user_name,
    ]);
    if (!user) {
      res.status(400).json({ error: "User not found" });
    }
    const dbUserPassword = user.password;
    bcrypt.compare(password, dbUserPassword).then((match) => {
      if (!match) {
        res
          .status(400)
          .json({ error: "Wrong Username and Password combination" });
      } else {
        const accessToken = createToken(user);
        res.cookie("access-token", accessToken, {
          maxAge: 60 * 60 * 24 * 30 * 1000,
          httpOnly: true,
        });
        res.json({ user: user.user_name, status: "success" });
      }
    });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get("/profile", validateToken, (req, res) => {
  res.json("profile");
});

createUserTable();
createAdminTable();

app.listen(3000);
