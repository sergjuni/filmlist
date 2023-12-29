import React, { createContext, useState, useContext } from "react";

const UserContext = createContext({
  user: null,
  setUser: () => {},
});

const UserProvider = ({ children }) => {
  const [user, setUser] = useState({
    user_id: "",
    user_name: "",
    isAdmin: 0,
    isLogged: false,
  });

  console.log("user", user);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

const useUser = () => {
  const context = useContext(UserContext);

  if (!context) {
    throw new Error("outside provider");
  }

  return context;
};

export { UserProvider, useUser };
