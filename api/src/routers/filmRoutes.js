import { Router } from "express";
import {
  postFilm,
  updateFilm,
  getAllFilms,
} from "../controller/filmController/filmController.js";
import { validateToken } from "../JWT.js";

const filmRoutes = Router();

filmRoutes.post("/", validateToken, postFilm);
filmRoutes.put("/", validateToken, updateFilm);
filmRoutes.get("/all", getAllFilms);
// filmRoutes.get("/:id", getFilmById);

export default filmRoutes;
