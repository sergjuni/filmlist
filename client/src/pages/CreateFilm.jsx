import React, { useState } from "react";
import { TextField, Button, Paper, Typography } from "@mui/material";
import Nav from "../components/Nav/Nav";
import { postFilm } from "../services/filmServices";
import { useNavigate } from "react-router-dom";
import { useUser } from "../state/user";

const CreateFilm = () => {
  const [filmName, setFilmName] = useState("");
  const [director, setDirector] = useState("");
  const [actors, setActors] = useState([]);
  const [newActor, setNewActor] = useState("");
  const { user } = useUser();

  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleFilmNameChange = (event) => {
    setFilmName(event.target.value);
  };

  const handleDirectorChange = (event) => {
    setDirector(event.target.value);
  };

  const handleAddActor = () => {
    if (newActor.trim() !== "") {
      setActors([...actors, newActor]);
      setNewActor("");
    }
  };
  const handleRemoveActor = (index) => {
    const updatedActors = [...actors];
    updatedActors.splice(index, 1);
    setActors(updatedActors);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const result = await postFilm(filmName, director, actors, user.user_id);
      console.log("film created", result);
      navigate("/");
      setError("");
    } catch (error) {
      setError(error.response.data.error.message);
    } finally {
      setFilmName("");
      setDirector("");
      setNewActor("");
      setActors([]);
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
            Create Film
          </Typography>
          <form onSubmit={handleSubmit}>
            <TextField
              label="Film"
              variant="outlined"
              fullWidth
              margin="normal"
              value={filmName}
              onChange={handleFilmNameChange}
            />
            <TextField
              label="Director"
              variant="outlined"
              fullWidth
              margin="normal"
              value={director}
              onChange={handleDirectorChange}
            />
            <TextField
              label="Actor"
              variant="outlined"
              value={newActor}
              onChange={(e) => setNewActor(e.target.value)}
            />
            <Button
              variant="contained"
              color="primary"
              onClick={handleAddActor}
              style={buttonStyle}
            >
              Add Actor
            </Button>

            <ul>
              {actors.map((actor, index) => (
                <li key={index}>
                  {actor}
                  <Button onClick={() => handleRemoveActor(index)}>
                    Remove
                  </Button>
                </li>
              ))}
            </ul>
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

export default CreateFilm;
