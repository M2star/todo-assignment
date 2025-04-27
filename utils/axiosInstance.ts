import axios from "axios";

// Create an Axios instance with a base URL and optional settings
const axiosInstance = axios.create({
  baseURL: "https://jsonplaceholder.typicode.com", // Set base URL here
  headers: {
    "Content-Type": "application/json",
  },
});

export default axiosInstance;
