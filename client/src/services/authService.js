import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000",
});

export const login = (email, password) => {
  return API.post("/login", {
    email,
    password,
  });
};