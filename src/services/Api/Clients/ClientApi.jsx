import {axiosClient} from "../../../api/axios";

const ClientApi = {
    delete: async (id) => {
        return await axiosClient.delete(`/clients/delete/${id}`)
    },
    show: async (id) => {
        return await axiosClient.get(`/clients/details/${id}`);
    },
    update: async (id, payload) => {
        return await axiosClient.post(`/clients/update/${id}`, payload)
    },
    edit: async (id, payload) => {
        return await axiosClient.post(`/clients/edit/${id}`, payload)
    },
    create: async (payload) => {
        return await axiosClient.post('/clients/add', payload)
    },
    all: async () => {
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
