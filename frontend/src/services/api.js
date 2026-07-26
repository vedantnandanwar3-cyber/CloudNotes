import axios from "axios";

const api = axios.create({
    baseURL: "https://cloudnotes-api-95xu.onrender.com"
});

export default api;