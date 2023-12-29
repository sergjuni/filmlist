import React, { useState } from "react";
import { TextField, Button, Paper, Typography } from "@mui/material";
import Nav from "../components/Nav/Nav";
import { putFilm } from "../services/filmServices";
import { useLocation, useNavigate } from "react-router-dom";
import { useUser } from "../state/user";

const EditFilm = () => {
  const { user } = useUser();
  const userId = user.user_id;
  const [grade, setGrade] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  const film = location.state || {};

  const handleGradeChange = (event) => {
    setGrade(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const result = await putFilm(userId, film.film_id, grade);
      console.log("grade changed", result);
      setError("");
      navigate("/");
    } catch (error) {
      setError(error.response.data.error.message);
    } finally {
      setGrade("");
    }
  };

  const containerLogin = {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    marginTop: "3%",
  };

  const paperStyle = {
    padding: 20,
    width: "300px",
  };

  const buttonStyle = {
    marginTop: 20,
    backgroundColor: "purple",
    border: "2px solid white",
  };

  return (
    <>
      <Nav />
      <div style={containerLogin}>
        <Paper elevation={3} style={paperStyle}>
          <Typography variant="h5" align="center" gutterBottom>
            Edit Film
          </Typography>
          <form onSubmit={handleSubmit}>
            <Typography variant="h4">Nome do filme</Typography>
            <Typography variant="h5">{film.film_name}</Typography>
            <Typography variant="h4">Diretor</Typography>
            <Typography variant="h5">{film.director}</Typography>
            <Typography variant="h4">Nota media</Typography>
            <Typography variant="h5">{film.average_grade}</Typography>
            <Typography variant="h4">Nota total</Typography>
            <Typography variant="h5">{film.total_grade}</Typography>
            <TextField
              label="Your grade"
              variant="outlined"
              fullWidth
              margin="normal"
              value={grade}
              onChange={handleGradeChange}
            />
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              style={buttonStyle}
            >
              Enviar
            </Button>
            {error !== "" && <p style={{ color: "black" }}>{error}</p>}
          </form>
        </Paper>
      </div>
    </>
  );
};

export default EditFilm;
