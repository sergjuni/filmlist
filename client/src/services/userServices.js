import axiosConnection from "../axios/config";

export const login = async (userName, password) => {
  const result = await axiosConnection.post("/user/login", {
    user_name: userName,
    password,
  });
  return result;
};

export const postUser = async (userName, password) => {
  const result = await axiosConnection.post("/user", {
    user_name: userName,
    password,
  });
  return result;
};
