import {axiosClient} from "../../../api/axios";

const csrf = () => csrfCookie.get("/sanctum/csrf-cookie");

const ClientApi = {
    delete: async (id) => {
        await csrf();
        return await axiosClient.delete(`/clients/delete/${id}`)
    },
    show: async (id) => {
        await csrf();
        return await axiosClient.get(`/clients/details/${id}`);
    },
    update: async (id, payload) => {
        await csrf();
        return await axiosClient.post(`/clients/update/${id}`, payload)
    },
    edit: async (id, payload) => {
        await csrf();
        return await axiosClient.post(`/clients/edit/${id}`, payload)
    },
    create: async (payload) => {
        await csrf();
        return await axiosClient.post('/clients/add', payload)
    },
    all: async () => {
        await csrf();
        // return await axiosClient.get('/clients')
        try {
        const response = await axiosClient.get('/clients');
        return response.data;
        } catch (error) {
            console.error("get All Clients error", error);
        }
    },
}

export default ClientApi
