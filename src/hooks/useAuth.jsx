
import axiosClient from "@/api/axiosClient";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import useSWR from "swr";


export const useAuth = () => {

    const navigate = useNavigate();

    // check if found cookie "isAuth" or not
    const isAuth = window.localStorage.getItem("isAuth");


    // State to store 'isLoading' value, for all requests in this page
    const [isLoading, setIsLoading] = useState(false)



    // get & set sanctum tokens
    const csrf = () => axiosClient.get('sanctum/csrf-cookie');


    /**
     * Get auth user data
     */
    const authUser = useSWR(isAuth ? "api/auth/user" : null, () =>
        axiosClient.get(isAuth ? "api/auth/user" : null)
            .then(async res => {
                const userData = res.data;

                return userData;
            })
            .catch(async error => {
                if (error.response.data.message === 'Unauthenticated.') {
                    window.localStorage.setItem("isAuth", false);

                    navigate('/login')
                }
            })
    );


    /**
     * Logout
     */
    const logout = async () => {
        try {
            setIsLoading(true)

            await csrf();

            const { data } = await axiosClient.post('api/auth/logout');

            if (data.is_ok === true) {
                window.localStorage.setItem("isAuth", false);

                navigate('/login')
            }

        } catch (error) {
            if (error.response.data.message === 'Unauthenticated.') {
                window.localStorage.setItem("isAuth", false);
            }

        } finally {
            setIsLoading(false)
        }
    }


    return {
        isAuth,
        authUser,
        csrf,
        isLoading,
        logout
    };
}