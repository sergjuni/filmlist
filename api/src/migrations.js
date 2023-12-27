import readline from "readline";
import bcrypt from "bcrypt";
import { openDb } from "./dbconfig.js";

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function scriptCreateAdminTable() {
  return console.log("o script aqui2");
}

async function createUserTable() {
  openDb().then((db) => {
    db.exec(
      "CREATE TABLE IF NOT EXISTS Pessoa ( id INTEGER PRIMARY KEY, nome TEXT, idade INTEGER )"
    );
  });
}

async function createAdminTable() {
  openDb().then((db) => {
    db.exec(
      "CREATE TABLE IF NOT EXISTS Admin ( user_id INTEGER PRIMARY KEY, user_name TEXT UNIQUE COLLATE NOCASE, password INTEGER )"
    );
  });
}

function questionAsync(query) {
  return new Promise((resolve) => {
    rl.question(query, resolve);
  });
}

async function createUser() {
  try {
    const username = await questionAsync("Enter username: ");
    const password = await questionAsync("Enter password: ");

    const db = await openDb();
    const hashPassword = await bcrypt.hash(password, 10);

    await db.run("INSERT INTO Admin (user_name, password) VALUES (?, ?)", [
      username,
      hashPassword,
    ]);

    console.log("User created successfully!");
  } catch (error) {
    console.log("error", error);
    if (error && error.errno === 19 && error.code === "SQLITE_CONSTRAINT") {
      console.error("Duplicate username. Please choose a different one.");
    } else {
      console.error("Internal Server Error");
    }
  } finally {
    rl.close();
  }
}

scriptCreateAdminTable();
createUser();
