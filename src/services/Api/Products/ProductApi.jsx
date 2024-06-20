import axiosClient from "@/api/axiosClient";
import { axiosProduct } from "../../../api/axios";

// get & set sanctum tokens
const csrf = () => axiosClient.get('sanctum/csrf-cookie');

const ProductApi = {
    delete: async (id) => {
        await csrf()
        return await axiosProduct.delete(`/products/delete/${id}`);
    },
    update: async (id, payload) => {
        await csrf()
        return await axiosProduct.put(`/products/update/${id}`, payload);
    },
    edit: async (id, payload) => {
        await csrf()
        return await axiosProduct.post(`/products/edit/${id}`, payload);
    },
    show: async (id) => {
        await csrf()
        return await axiosProduct.get(`/products/details/${id}`);
    },
    create: async (payload) => {
        await csrf()
        return await axiosProduct.post("/products/add", payload);
    },
    get: async (id, payload) => {
        await csrf()
        return await axiosProduct.get(`/products/get/${id}`, payload);
    },
    all: async () => {
        try {
            await csrf()
            const response = await axiosProduct.get("/products");
            return response.data;
        } catch (error) {
            console.error("get All Products error", error);
        }
    },
};

export default ProductApi;
