import React, { useState, useEffect } from "react";
import { Card, CardContent, Typography, Grid, TextField } from "@mui/material";
import Nav from "../components/Nav/Nav";
import { getFilmList } from "../services/filmServices";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const [filmList, setFilmList] = useState([]);
  const [filteredFilmList, setFilteredFilmList] = useState([]);
  const [filterCriteria, setFilterCriteria] = useState("");
  const navigate = useNavigate();

  const awaitGetFilms = async () => {
    try {
      const response = await getFilmList();
      setFilmList(response.data.films);
      setFilteredFilmList(response.data.films);
    } catch (error) {
      console.error("Error fetching films:", error);
    }
  };

  useEffect(() => {
    awaitGetFilms();
  }, []);

  const handleCardClick = (filmIndex) => {
    const filmListId = filteredFilmList[filmIndex].film_id;
    navigate(`/editFilm/${filmListId}`, { state: filteredFilmList[filmIndex] });
  };

  const handleFilterChange = (event) => {
    const criteria = event.target.value;
    setFilterCriteria(criteria);
    const filteredList = filmList.filter(
      (film) =>
        film.film_name.toLowerCase().includes(criteria.toLowerCase()) ||
        film.director.toLowerCase().includes(criteria.toLowerCase())
    );
    setFilteredFilmList(filteredList);
  };

  return (
    <>
      <Nav />
      <TextField
        label="Filter by film_name or director"
        variant="outlined"
        fullWidth
        margin="normal"
        value={filterCriteria}
        onChange={handleFilterChange}
      />
      <Grid container spacing={3}>
        {filteredFilmList.map((film, index) => (
          <Grid item xs={12} sm={6} md={4} key={film.id}>
            <Card
              key={index}
              sx={{ cursor: "pointer" }}
              onClick={(event) => handleCardClick(index)}
            >
              <CardContent>
                <Typography variant="h5" component="div">
                  {film.film_name}
                </Typography>
                <Typography color="textSecondary">
                  Director: {film.director}
                </Typography>
                <Typography color="textSecondary">
                  Average Grade: {film.average_grade}
                </Typography>
                <Typography color="textSecondary">
                  Actors:
                  {film.actors.map((actors, actorIndex) => (
                    <p key={actorIndex}>{actors}</p>
                  ))}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </>
  );
};

export default Home;
