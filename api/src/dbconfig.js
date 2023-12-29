import sqlite3 from "sqlite3";
import { open } from "sqlite";

export async function openDb() {
  return open({
    filename: "./database.db",
    driver: sqlite3.Database,
  });
}

export const userStaticInfo = {
  user_name: "sergio",
  password: "1234567",
};
