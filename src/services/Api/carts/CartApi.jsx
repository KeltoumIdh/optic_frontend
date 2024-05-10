import {axiosCart} from "../../../api/axios";

const CartApi = {
    // delete: async (id) => {
    //     return await axiosCart.delete(`/carts/delete/${id}`)
    // },
    // update: async (id, payload) => {
    //     return await axiosCart.put(`/carts/update/${id}`, payload)
    // },
    // edit: async (id, payload) => {
    //     return await axiosCart.post(`/carts/edit/${id}`, payload)
    // },
    // getProductsByIds: async (payload) => {
    //     return await axiosCart.get('/carts/confirmed', payload)
    // },
    // confirmCart: async (payload) => {
    //     return await axiosCart.post('/carts/confirmed', payload)
    // },
    // createCart: async (payload) => {
    //     return await axiosCart.post('/carts/products/add/{id}', payload)
    // },
    create: async (payload) => {
        return await axiosCart.post('/carts/add', payload)
    },
    // all: async () => {
    //     // return await axiosCart.get('/carts')
    //     try {
    //     const response = await axiosCart.get('/carts');
    //     return response.data;
    //     } catch (error) {
    //         console.error("get All Carts error", error);
    //     }
    // },
}

export default CartApi
