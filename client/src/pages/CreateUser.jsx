import React, { useState } from "react";
import { TextField, Button, Paper, Typography } from "@mui/material";
import Nav from "../components/Nav/Nav";
import { postUser } from "../services/userServices";

const CreateUser = () => {
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleUserNameChange = (event) => {
    setUserName(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const result = await postUser(userName, password);
      console.log("user created", result);
      setError("");
    } catch (error) {
      setError(error.response.data.error.message);
    } finally {
      setUserName("");
      setPassword("");
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
            Create User
          </Typography>
          <form onSubmit={handleSubmit}>
            <TextField
              label="Username"
              variant="outlined"
              fullWidth
              margin="normal"
              value={userName}
              onChange={handleUserNameChange}
            />
            <TextField
              label="Password"
              type="password"
              variant="outlined"
              fullWidth
              margin="normal"
              value={password}
              onChange={handlePasswordChange}
            />
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              style={buttonStyle}
            >
              Criar
            </Button>
            {error !== "" && <p style={{ color: "black" }}>{error}</p>}
          </form>
        </Paper>
      </div>
    </>
  );
};

export default CreateUser;
