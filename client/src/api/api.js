import axios from "axios";

const api = axios.create({
    baseURL: "https://insightsync-ai.onrender.com"
});

export default api;