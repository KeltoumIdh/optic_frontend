import axios from "axios";
export const csrfCookie = axios.create({
    baseURL: process.env.REACT_APP_BACKEND_URL,
    withCredentials: true,
    withXSRFToken: true,
});
export const axiosAuth = axios.create({
    baseURL: process.env.REACT_APP_BACKEND_URL,
    withCredentials: true,
    withXSRFToken: true,
});
const axiosCart = axios.create({
    baseURL: `${process.env.REACT_APP_BACKEND_URL}/api`,
    withCredentials: true,
});
const axiosOrder = axios.create({
    baseURL: `${process.env.REACT_APP_BACKEND_URL}/api`,
    withCredentials: true,
    withXSRFToken: true,

});

const axiosProduct = axios.create({
    baseURL: `${process.env.REACT_APP_BACKEND_URL}/api`,
    headers: {
        "X-Requested-With": "XMLHttpRequest",
        },
    withCredentials: true,
    withXSRFToken: true,

});
const axiosClient = axios.create({
    baseURL: `${process.env.REACT_APP_BACKEND_URL}/api`,
    withCredentials: true,
    withXSRFToken: true,

});
const axiosUser = axios.create({
    baseURL: `${process.env.REACT_APP_BACKEND_URL}/api`,
    withCredentials: true,
    withXSRFToken: true,
});
axiosAuth.interceptors.request.use(function (config) {
    const token = localStorage.getItem("optic-token");
    if (token) {
        config.headers.Authorization = "Bearer " + token;
    }
    return config;
});

axiosCart.interceptors.request.use(function (config) {
    const token = localStorage.getItem("optic-token");
    if (token) {
        config.headers.Authorization = "Bearer " + token;
    }
    return config;
});
axiosOrder.interceptors.request.use(function (config) {
    const token = localStorage.getItem("optic-token");
    if (token) {
        config.headers.Authorization = "Bearer " + token;
    }
    return config;
});
axiosProduct.interceptors.request.use(function (config) {
    const token = localStorage.getItem("optic-token");
    if (token) {
        config.headers.Authorization = "Bearer " + token;
    }
    return config;
});
axiosClient.interceptors.request.use(function (config) {
    const token = localStorage.getItem("optic-token");
    if (token) {
        config.headers.Authorization = "Bearer " + token;
    }
    return config;
});

export { axiosClient, axiosProduct, axiosOrder, axiosCart, axiosUser };
