import axios from "axios";
export const axiosAuth = axios.create({
    baseURL: "http://localhost:8000",
    withCredentials: true,
    withXSRFToken: true,
});
const axiosCart = axios.create({
    baseURL: "http://localhost:8000/api",
    withCredentials: true,
});
const axiosOrder = axios.create({
    baseURL: "http://localhost:8000/api",
    withCredentials: true,
    withXSRFToken: true,

});

const axiosProduct = axios.create({
    baseURL: "http://localhost:8000/api",
    headers: {
        "X-Requested-With": "XMLHttpRequest",
        },
    withCredentials: true,
    withXSRFToken: true,

});
const axiosClient = axios.create({
    baseURL: "http://localhost:8000/api",
    withCredentials: true,
    withXSRFToken: true,

});
const axiosUser = axios.create({
    baseURL: "http://localhost:8000/api",
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
