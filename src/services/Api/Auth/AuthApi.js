import {axiosAuth} from "../../../api/axios";

const AuthApi = {
  login: async (email, password) => {
    console.log(email, password)
    return await axiosAuth.post('/login', {email, password})
  },
  logout: async () => {
    console.log("deconnecter")
    return await axiosAuth.post('/logout')
  },

  getUser: async () => {
    return await axiosAuth.get('/')
  },
}
export default AuthApi