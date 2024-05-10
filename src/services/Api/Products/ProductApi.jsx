import { axiosProduct } from "../../../api/axios";

const ProductApi = {
    delete: async (id) => {
        return await axiosProduct.delete(`/products/delete/${id}`);
    },
    update: async (id, payload) => {
        return await axiosProduct.put(`/products/update/${id}`, payload);
    },
    edit: async (id, payload) => {
        return await axiosProduct.post(`/products/edit/${id}`, payload);
    },
    show: async (id) => {
        return await axiosProduct.get(`/products/details/${id}`);
    },
    create: async (payload) => {
        return await axiosProduct.post("/products/add", payload);
    },
    get: async (id, payload) => {
        return await axiosProduct.get(`/products/get/${id}`, payload);
    },
    all: async () => {
        try {
            const response = await axiosProduct.get("/products");
            return response.data;
        } catch (error) {
            console.error("get All Products error", error);
        }
    },
};

export default ProductApi;
