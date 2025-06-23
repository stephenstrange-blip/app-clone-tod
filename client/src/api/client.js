import axios from "axios";
// require("dotenv").config();
const env = import.meta.env;

const apiClient = axios.create({
  baseURL: env?.PROD ? env.VITE_BASE_SERVER_URL : "/api",
  httpAgent: false,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

export default apiClient;
