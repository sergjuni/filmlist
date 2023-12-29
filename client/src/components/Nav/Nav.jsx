import React from "react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Button from "@mui/material/Button";
import { Link } from "react-router-dom";
import { useUser } from "../../state/user";
import { useNavigate } from "react-router-dom";

const Nav = () => {
  const { user, setUser } = useUser();
  const navigate = useNavigate();
  const isLogged = user.isLogged;
  const isAdmin = user.isAdmin;

  const normalUserCheck = isLogged && isAdmin;

  const handleLogout = () => {
    setUser();
    setUser({ user_id: "", user_name: "", isAdmin: 0, isLogged: false });
    navigate("/login");
  };

  const homeButtonStyle = {
    border: "2px solid white",
    marginRight: "auto",
  };
  const buttonStyle = {
    border: "2px solid white",
    marginLeft: "10px",
  };
  return (
    <AppBar position="static" sx={{ backgroundColor: "purple" }}>
      <Toolbar>
        <Button color="inherit" component={Link} to="/" sx={homeButtonStyle}>
          Home
        </Button>

        {normalUserCheck ? (
          <Button
            color="inherit"
            component={Link}
            to="/createFilm"
            sx={buttonStyle}
          >
            Criar Filme
          </Button>
        ) : null}
        {normalUserCheck ? (
          <Button
            color="inherit"
            component={Link}
            to="/createUser"
            sx={buttonStyle}
          >
            Criar Usuario
          </Button>
        ) : null}
        {!isLogged && (
          <Button color="inherit" component={Link} to="/login" sx={buttonStyle}>
            Login
          </Button>
        )}
        {isLogged && (
          <Button color="inherit" onClick={handleLogout} sx={buttonStyle}>
            Logout
          </Button>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Nav;
