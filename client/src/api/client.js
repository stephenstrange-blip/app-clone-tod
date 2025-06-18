import axios from "axios";
require("dotenv").config();

const apiClient = axios.create({
  baseURL: process.env.BASE_SERVER_URL,
  httpAgent: false,
  // httpsAgent: false,
  headers: {
    "Content-Type": "application/json",
  },
});

export default apiClient;
