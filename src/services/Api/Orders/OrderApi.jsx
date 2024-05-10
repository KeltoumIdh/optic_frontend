import { axiosOrder } from "../../../api/axios";

const OrderApi = {
    store: async (data) => {
        return await axiosOrder.delete(`/add-order`, data);
    },
    download: async (id) => {
        return await axiosOrder.get(`/download-invoice/${id}`);
    },
    viewInvoice: async (id) => {
        return await axiosOrder.get(`/view-invoice/${id}`);
    },
    delete: async (id) => {
        return await axiosOrder.delete(`/orders/delete/${id}`);
    },
    update: async (id, payload) => {
        return await axiosOrder.post(`/orders/update/${id}`, payload);
    },
    show: async (id) => {
        return await axiosOrder.get(`/orders/details/${id}`);
    },
    edit: async (id, payload) => {
        return await axiosOrder.post(`/orders/edit/${id}`, payload);
    },
    getProductsByIds: async (payload) => {
        return await axiosOrder.get("/orders/confirmed", payload);
    },
    confirmOrder: async (payload) => {
        return await axiosOrder.post("/orders/confirmed", payload);
    },
    createOrder: async (payload) => {
        return await axiosOrder.post("/orders/products/add/{id}", payload);
    },
    create: async (payload) => {
        return await axiosOrder.get("/orders/add", payload);
    },
    all: async () => {
        // return await axiosOrder.get('/orders')
        try {
            const response = await axiosOrder.get("/orders");
            return response.data;
        } catch (error) {
            console.error("get All Orders error", error);
        }
    },
};

export default OrderApi;
