import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "./pages/Login";
import Home from "./pages/Home";
import { UserProvider } from "./state/user";
import CreateUser from "./pages/CreateUser";
import CreateFilm from "./pages/CreateFilm";
import EditFilm from "./pages/EditFilm";

const App = () => {
  return (
    <UserProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Home />} />
          <Route path="/createUser" element={<CreateUser />} />
          <Route path="/createFilm" element={<CreateFilm />} />
          {/* <Route path="/editFilm" element={<EditFilm />} /> */}
          <Route path={`/editFilm/:id`} element={<EditFilm />} />
        </Routes>
      </Router>
    </UserProvider>
  );
};

export default App;
