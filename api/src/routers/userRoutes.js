import { Router } from "express";
import {
  postUser,
  getUserById,
  updateUser,
  deleteUser,
  loginUser,
  userProfile,
} from "../controller/userController/userControler.js";
import { validateToken } from "../JWT.js";

const userRoutes = Router();

userRoutes.post("/", postUser);
userRoutes.put("/", updateUser);
userRoutes.delete("/", deleteUser);
userRoutes.post("/login", loginUser);
userRoutes.get("/profile", validateToken, userProfile);
userRoutes.get("/:id", getUserById);

export default userRoutes;
