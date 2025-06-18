import axios from "axios";
// require("dotenv").config();
const env = import.meta.env;

const apiClient = axios.create({
  baseURL: env?.RAILWAY_PUBLIC_DOMAIN
    ? import.meta.env.BASE_SERVER_URL
    : "/api",
  httpAgent: false,
  // httpsAgent: false,
  headers: {
    "Content-Type": "application/json",
  },
});

export default apiClient;
