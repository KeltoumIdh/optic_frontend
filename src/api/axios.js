import { backEndUrl } from "@/helpers/utils";
import axios from "axios";

// const backendUrl = process.env.REACT_APP_BACKEND_URL ?? '#';
// console.log('backendUrl',backendUrl);
// 'https://tyfwt-vision.website' ||

const getBaseUrl = () => backEndUrl;

const createAxiosInstance = (baseURL, additionalHeaders = {}) => {
  const instance = axios.create({
    baseURL,
    headers: {
      ...additionalHeaders,
      "X-Requested-With": "XMLHttpRequest",
    },
    withCredentials: true,
    withXSRFToken: true,
  });

  instance.interceptors.request.use((config) => {
    const token = localStorage.getItem("optic-token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });

  instance.defaults.withCredentials = true;
  instance.defaults.withXSRFToken = true;

  return instance;
};

const baseApiUrl = `${getBaseUrl()}/api`;

export const csrfCookie = createAxiosInstance(getBaseUrl());
export const axiosAuth = createAxiosInstance(getBaseUrl());
export const axiosCart = createAxiosInstance(baseApiUrl);
export const axiosOrder = createAxiosInstance(baseApiUrl);
export const axiosProduct = createAxiosInstance(baseApiUrl);
export const axiosClient = createAxiosInstance(baseApiUrl);
export const axiosUser = createAxiosInstance(baseApiUrl);

// export const csrfCookie = axios.create({
//     baseURL: "http://localhost:8000",
//     withCredentials: true,
//     withXSRFToken: true,
// });
// export const axiosAuth = axios.create({
//     baseURL: "http://localhost:8000",
//     withCredentials: true,
//     withXSRFToken: true,
// });
// const axiosCart = axios.create({
//     baseURL: `http://localhost:8000/api`,
//     withCredentials: true,
// });
// const axiosOrder = axios.create({
//     baseURL: `http://localhost:8000/api`,
//     withCredentials: true,
//     withXSRFToken: true,

// });
// const axiosProduct = axios.create({
//     baseURL: `http://localhost:8000/api`,
//     headers: {
//         "X-Requested-With": "XMLHttpRequest",
//         },
//     withCredentials: true,
//     withXSRFToken: true,

// });
// const axiosClient = axios.create({
//     baseURL: `http://localhost:8000/api`,
//     withCredentials: true,
//     withXSRFToken: true,

// });
// const axiosUser = axios.create({
//     baseURL: `http://localhost:8000/api`,
//     withCredentials: true,
//     withXSRFToken: true,
// });
// axiosAuth.interceptors.request.use(function (config) {
//     const token = localStorage.getItem("optic-token");
//     if (token) {
//         config.headers.Authorization = "Bearer " + token;
//     }
//     return config;
// });
// axiosCart.interceptors.request.use(function (config) {
//     const token = localStorage.getItem("optic-token");
//     if (token) {
//         config.headers.Authorization = "Bearer " + token;
//     }
//     return config;
// });
// axiosOrder.interceptors.request.use(function (config) {
//     const token = localStorage.getItem("optic-token");
//     if (token) {
//         config.headers.Authorization = "Bearer " + token;
//     }
//     return config;
// });
// axiosProduct.interceptors.request.use(function (config) {
//     const token = localStorage.getItem("optic-token");
//     if (token) {
//         config.headers.Authorization = "Bearer " + token;
//     }
//     return config;
// });
// axiosClient.interceptors.request.use(function (config) {
//     const token = localStorage.getItem("optic-token");
//     if (token) {
//         config.headers.Authorization = "Bearer " + token;
//     }
//     return config;
// });
// export { axiosClient, axiosProduct, axiosOrder, axiosCart, axiosUser };
