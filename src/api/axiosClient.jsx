import axios from "axios";

// Create an axios instance
const axiosClient = axios.create({
  baseURL: "https://tyfwt-vision.website",
  // baseURL: "http://localhost:8000",
  headers: {
    "X-Requested-With": "XMLHttpRequest",
    Accept: "application/json",
    "Content-Type": "application/json",
  },
  withCredentials: true,
  withXSRFToken: true,
});

export default axiosClient;
