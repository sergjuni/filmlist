import { openDb } from "../../dbconfig.js";
import bcrypt from "bcrypt";
import { v4 as uuidv4 } from "uuid";
import { createToken } from "../../JWT.js";

async function hashPassword(password) {
  return await bcrypt.hash(password, 10);
}

async function dbInsertUser(user_id, user_name, encryptedPassword) {
  try {
    const db = await openDb();
    const result = await db.run(
      "INSERT INTO User (user_id, user_name, password) VALUES (?, ?, ?)",
      [user_id, user_name, encryptedPassword]
    );
    return result;
  } catch (error) {
    if (error && error.errno === 19 && error.code === "SQLITE_CONSTRAINT") {
      throw new Error(
        "user_name already exists, please choose a different user_name"
      );
    } else {
      throw new Error("error in the dbinsertuser method:", error);
    }
  }
}

async function dbGetUserById(user_id) {
  try {
    const db = await openDb();
    const result = await db.get("SELECT * FROM User WHERE user_id=?", [
      user_id,
    ]);
    return result;
  } catch {
    throw new Error("error in the getuserbyid method:", error);
  }
}

async function dbUpdateUser(user_id, user_name, user_password, isAdmin) {
  try {
    const db = await openDb();
    await db.run(
      "UPDATE User SET user_name=?, password=?, isAdmin=? WHERE user_id=?",
      [user_name, user_password, isAdmin, user_id]
    );
  } catch (error) {
    console.log("error", error);
    throw new Error("error in the dbuptadeuser method:", error);
  }
}

async function dbDeleteUser(user_id) {
  try {
    const db = await openDb();
    db.get("DELETE FROM User WHERE user_id=?", [user_id]);
  } catch (error) {
    throw new Error("error in the dbdeleteuser method:", error);
  }
}

export async function postUser(req, res) {
  const { user_name, password } = req.body;
  if (!user_name && password) {
    return res.status(400).json({ error: "invalid payload" });
  }
  const new_user_id = uuidv4();
  try {
    const hashedPassword = await hashPassword(password);
    await dbInsertUser(new_user_id, user_name, hashedPassword);
    const new_user = await dbGetUserById(new_user_id);

    return res.status(200).json({ user: { new_user_id, user_name, password } });
  } catch (error) {
    res.status(500).json({ error: { message: error.message, error } });
  }
}

export async function getUserById(req, res) {
  const user_id = req.params.id;

  try {
    const user = await dbGetUserById(user_id);
    return res.status(200).json({ user: user });
  } catch (error) {
    res.status(500).json({ error: { message: error.message, error } });
  }
}

export async function updateUser(req, res) {
  const { user_id, user_name, password, isAdmin } = req.body;
  if (!user_id || !user_name || !password) {
    return res.status(400).json({ error: "invalid payload" });
  }

  try {
    const hashedPassword = await hashPassword(password);
    await dbUpdateUser(user_id, user_name, hashedPassword, isAdmin);
    const user = await dbGetUserById(user_id);
    return res.status(200).json({ user: user });
  } catch (error) {
    res.status(500).json({ error: { message: error.message, error } });
  }
}

export async function deleteUser(req, res) {
  const user_id = req.body.user_id;
  if (!user_id) {
    return res.status(400).json({ error: "invalid payload" });
  }
  try {
    await dbDeleteUser(user_id);
    return res.status(200).json({ user_id });
  } catch (error) {
    res.status(500).json({ error: { message: error.message, error } });
  }
}

export async function loginUser(req, res) {
  const { user_name, password } = req.body;
  const db = await openDb();
  try {
    const user = await db.get("SELECT * FROM User WHERE user_name=?", [
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
}

export async function userProfile(req, res) {
  res.json("profile");
}
