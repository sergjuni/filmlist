import axiosConnection from "../axios/config";

export const postFilm = async (filmName, director, actors, userId) => {
  const result = await axiosConnection.post("/film", {
    film_name: filmName,
    director,
    actors,
    user_id: userId,
  });
  return result;
};

export const getFilmList = async () => {
  const result = await axiosConnection.get("/film/all");
  return result;
};

export const putFilm = async (userId, filmId, grade) => {
  const result = await axiosConnection.put("/film", {
    user_id: userId,
    film_id: filmId,
    grade: grade,
  });
  return result;
};
