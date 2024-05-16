import axios from "axios";

// const backendUrl = process.env.REACT_APP_BACKEND_URL ?? '#';
// console.log('backendUrl',backendUrl);

const getBaseUrl = () => 'https://tyfwt-vision.website' || 'http://localhost:8000';
console.log('backendUrl',getBaseUrl());

const createAxiosInstance = (baseURL, withCredentials = true, withXSRFToken = true, additionalHeaders = {}) => {
    const instance = axios.create({
        baseURL,
        withCredentials,
        headers: {
            ...additionalHeaders,
            ...(withXSRFToken ? { "X-Requested-With": "XMLHttpRequest" } : {})
        }
    });

    instance.interceptors.request.use((config) => {
        const token = localStorage.getItem("optic-token");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    });

    return instance;
};

const baseApiUrl = `${getBaseUrl()}/api`;

export const csrfCookie = createAxiosInstance(getBaseUrl(), true, true);
export const axiosAuth = createAxiosInstance(getBaseUrl(), true, true);
export const axiosCart = createAxiosInstance(baseApiUrl, true, true);
export const axiosOrder = createAxiosInstance(baseApiUrl, true, true);
export const axiosProduct = createAxiosInstance(baseApiUrl, true, true, { "X-Requested-With": "XMLHttpRequest" });
export const axiosClient = createAxiosInstance(baseApiUrl, true, true);
export const axiosUser = createAxiosInstance(baseApiUrl, true, true);





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
