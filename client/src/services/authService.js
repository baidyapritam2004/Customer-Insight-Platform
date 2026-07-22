import axios from "axios";

const API = axios.create({
    baseURL: "http://localhost:5000"
});

export const login = (username, password) => {

    return API.post("/login", {
        username,
        password
    });

};