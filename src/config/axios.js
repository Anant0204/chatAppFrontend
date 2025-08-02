import axios from "axios";

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  // baseURL: "https://localhost:3000",
  // baseURL: "https://chatappbackend-tw6f.onrender.com",
  headers: {
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  },
});

export default axiosInstance;
