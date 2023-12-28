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

userRoutes.post("/", validateToken, postUser);
userRoutes.put("/", validateToken, updateUser);
userRoutes.delete("/", validateToken, deleteUser);
userRoutes.post("/login", loginUser);
userRoutes.get("/profile", validateToken, userProfile);
userRoutes.get("/:id", validateToken, getUserById);

export default userRoutes;
