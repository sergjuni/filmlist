import { openDb } from "../../dbconfig.js";
import { v4 as uuidv4 } from "uuid";

function verifyPayload(payload, res) {
  if (
    !payload.film_name ||
    !payload.director ||
    !payload.actors ||
    !payload.user_id
  ) {
    return res.status(400).json({ error: "invalid payload" });
  }

  return;
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

async function verifyUserCreatingFilm(user_id, res) {
  const user = await dbGetUserById(user_id);
  if (!user.isAdmin === 1) {
    throw new Error("invalid user, must be a admin to use this api");
  }
  return user;
}

async function verifyUserEditingFilm(user_id) {
  const user = await dbGetUserById(user_id);
  if (user.isAdmin === 1) {
    throw new Error("Invalid user, cannot edit movies with an admin user");
  }
  return user;
}

async function dbInsertFilm(payload) {
  const { new_film_id, film_name, director, actors } = payload;
  const actorsString = actors.join(",");
  try {
    const db = await openDb();
    const result = await db.run(
      "INSERT INTO Film (film_id, film_name, director, actors) VALUES (?, ?, ?, ?)",
      [new_film_id, film_name, director, actorsString]
    );
    return result;
  } catch (error) {
    if (error && error.errno === 19 && error.code === "SQLITE_CONSTRAINT") {
      throw new Error("film already exists, please register a new film");
    } else {
      throw new Error("error in the dbinsertfilm method:", error);
    }
  }
}

async function dbGetFilmById(film_id) {
  try {
    const db = await openDb();
    const result = await db.get("SELECT * FROM Film WHERE film_id=?", [
      film_id,
    ]);
    return result;
  } catch (error) {
    throw new Error("error in the dbGetFilmById method:", error);
  }
}

async function dbUpdateFilm(grade, film_id) {
  try {
    const db = await openDb();
    const film = await dbGetFilmById(film_id);
    const film_total_grade = film.total_grade;
    const film_new_total_grade = film_total_grade + 1;
    const film_new_average_grade =
      (film_total_grade * film.average_grade + grade) / film_new_total_grade;

    await db.run(
      "UPDATE Film SET average_grade=?, total_grade=? WHERE film_id=?",
      [film_new_average_grade, film_new_total_grade, film_id]
    );

    const updatedFilmObject = {
      film_id: film.film_id,
      film_name: film.film_name,
      total_grade: film_new_total_grade,
      average_grade: film_new_average_grade,
    };

    return updatedFilmObject;
  } catch (error) {
    throw new Error("error in the dbUpdateFilm method:");
  }
}

async function dbGetAllFilms() {
  try {
    const db = await openDb();
    const result = await db.all("SELECT * FROM Film LIMIT 100");
    return result;
  } catch (error) {
    throw new Error("error in the dbGetAllFilms method:");
  }
}

export async function postFilm(req, res) {
  const { film_name, director, actors, user_id } = req.body;
  const new_film_id = uuidv4();
  verifyPayload(req.body, res);
  const payload = {
    new_film_id,
    film_name,
    director,
    actors,
  };

  try {
    await verifyUserCreatingFilm(user_id, res);
    await dbInsertFilm(payload);
    const new_film = await dbGetFilmById(new_film_id);
    const actorsString = new_film.actors;
    new_film.actors = actorsString.split(",");

    return res.status(200).json({ film: new_film });
  } catch (error) {
    res.status(500).json({ error: { message: error.message } });
  }
}

export async function updateFilm(req, res) {
  const { grade, film_id, user_id } = req.body;
  if (!grade || !film_id || !user_id) {
    return res.status(400).json({ error: { message: "invalid payload" } });
  }
  try {
    await verifyUserEditingFilm(user_id);
    const updatedFilm = await dbUpdateFilm(grade, film_id);
    return res.status(200).json({ film: updatedFilm });
  } catch (error) {
    res.status(500).json({ error: { message: error.message } });
  }
}

export async function getAllFilms(_req, res) {
  try {
    const allFilms = await dbGetAllFilms();
    const filmsWithArrays = allFilms.map((film) => ({
      ...film,
      actors: film.actors.split(",").map((actor) => actor.trim()),
    }));
    return res.status(200).json({ films: filmsWithArrays });
  } catch (error) {
    res.status(500).json({ error: { message: error.message } });
  }
}

export async function getFilmById(req, res) {
  const film_id = req.params.id;
  try {
    const film = await dbGetFilmById(film_id);
    return res.status(200).json({ film: film });
  } catch (error) {
    res.status(500).json({ error: { message: error.message } });
  }
}
