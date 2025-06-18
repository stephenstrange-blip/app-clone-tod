import axios from "axios";
const apiClient = axios.create({
  // baseURL: "http://localhost:8080",
  // httpsAgent: true,
  // httpsAgent: false,
  headers: {
    "Content-Type": "application/json",
  },
});

export default apiClient;
