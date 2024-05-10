import {axiosUser} from "../../../api/axios"

const UserApi = {
 
    updatePassword: async (payload) => {
        return await axiosUser.post('/updatePassword', payload)
    },
   
    update: async (id, payload) => {
        return await axiosUser.put(`/users/update/${id}`, payload);
    },
    edit: async (id, payload) => {
        return await axiosUser.post(`/users/edit/${id}`, payload);
    },
    create: async (payload) => {
        return await axiosUser.post("/users/add", payload);
    },
   

}

export default UserApi;