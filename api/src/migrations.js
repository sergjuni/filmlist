import bcrypt from "bcrypt";
import { openDb, userStaticInfo } from "./dbconfig.js";
import { v4 as uuidv4 } from "uuid";

function randomPassword() {
  const randomString =
    Math.random().toString(36).slice(2) +
    Math.random().toString(36).toUpperCase().slice(2);
  const shortenedString = randomString.slice(0, randomString.length - 15);

  return shortenedString;
}

async function createUserTable() {
  openDb().then((db) => {
    db.exec(
      "CREATE TABLE IF NOT EXISTS User ( user_id TEXT PRIMARY KEY, user_name TEXT UNIQUE COLLATE NOCASE, password STRING, isAdmin BOOLEAN DEFAULT 0 )"
    );
  });
}

async function createAdminUser() {
  const newAdminUser = await questionAsync("Enter username: ");
  const newAdminPassword = await questionAsync("Enter password: ");

  const db = await openDb();
  const hashPassword = await bcrypt.hash(newAdminPassword, 10);

  const result = await db.run(
    "INSERT INTO Admin (user_name, password) VALUES (?, ?)",
    [newAdminUser, hashPassword]
  );
  const newAdminId = result.lastID;
  const newAdmin = await db.get(
    "SELECT * FROM Admin WHERE admin_user_id = ?",
    newAdminId
  );

  const { user_name, admin_user_id } = newAdmin;

  console.log(
    `Admin created successfully! ${JSON.stringify({
      user_name,
      admin_user_id,
    })}`
  );
}

async function deleteAdminUser() {
  const adminUserName = await questionAsync(
    "Enter a admin username to delete: "
  );

  const db = await openDb();

  const user = await db.get("SELECT * FROM Admin WHERE user_name=?", [
    adminUserName,
  ]);

  console.log("user", user);
  if (!user) {
    return console.error({ error: "User not found" });
  }

  await db.get("DELETE FROM Admin WHERE user_name=?", [adminUserName]);

  console.log(
    `Admin deleted successfully! ${JSON.stringify({
      user_name: adminUserName,
    })}`
  );
}

async function hashPassword(password) {
  return await bcrypt.hash(password, 10);
}

async function dbInsertUser(user_id, user_name, encryptedPassword) {
  try {
    const db = await openDb();
    const result = await db.run(
      "INSERT INTO User (user_id, user_name, password, isAdmin) VALUES (?, ?, ?, ?)",
      [user_id, user_name, encryptedPassword, 1]
    );
    return result;
  } catch (error) {
    if (error && error.errno === 19 && error.code === "SQLITE_CONSTRAINT") {
      throw new Error(
        "user_name already exists, please choose a different user_name"
      );
    } else {
      throw new Error(error);
    }
  }
}

async function createUser() {
  const user_id = uuidv4();
  const { user_name, password } = userStaticInfo;

  try {
    const hashedPassword = await hashPassword(password);
    await dbInsertUser(user_id, user_name, hashedPassword);
    return { user_id, user_name, password };
  } catch (error) {
    throw new Error(error);
  }
}

async function migrations() {
  console.log("Running migrations");
  try {
    await createUserTable();
    const newUser = await createUser();
    console.log(`new user created, ${JSON.stringify(newUser)} `);
  } catch (error) {
    console.error("error running script", { errror: error });
  } finally {
    return console.log("End of script");
  }
}

migrations();
