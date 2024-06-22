import { backEndUrl } from "@/helpers/utils";
import axios from "axios";

// Create an axios instance
const axiosClient = axios.create({
  baseURL: backEndUrl,
  headers: {
    "X-Requested-With": "XMLHttpRequest",
    Accept: "application/json",
    "Content-Type": "application/json",
  },
  withCredentials: true,
  withXSRFToken: true,
});

axiosClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("optic-token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default axiosClient;
