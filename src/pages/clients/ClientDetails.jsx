import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import dayjs from "dayjs";
import { useAuth } from "@/hooks/useAuth";
import axiosClient from "@/api/axiosClient.jsx";
import Loader from "@/components/loader";

function ClientDetails() {
    const [client, setClient] = useState();
    const [orders, setOrders] = useState();
    
    const { id } = useParams();

    const { csrf } = useAuth();

    const [loading, setLoading] = useState(false);

    const getClient = async () => {
        try {
            setLoading(true)
            await csrf();
            const response = await axiosClient.get(`/api/clients/details/${id}`);
            setClient(response.data.client);
            setOrders(response.data.orders);
        } catch (err) {
            console.log("err", err);
        } finally {
            setLoading(false)
        }
    };

    useEffect(() => {
        getClient();
    }, [id]);

    return loading ? <Loader /> : (
        <>
            <div className="pb-14 px-4 md:px-6 2xl:px-20 2xl:container 2xl:mx-auto">
                <div className="flex justify-start item-start space-y-2 flex-col">
                    <div className="flex items-center">
                        <Link to={"/clients"} className="mr-2">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth="1.5"
                                stroke="currentColor"
                                className="w-6 h-6"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18"
                                />
                            </svg>
                        </Link>
                        <h1 className="text-lg dark:text-white lg:text-2xl font-semibold leading-7 lg:leading-9 text-gray-800">
                            Client #{client?.id}
                        </h1>
                    </div>
                    <p className="lg:text-base text-xs dark:text-gray-300 px-4 font-medium leading-6 text-gray-600">
                        {dayjs(client?.created_at).format(
                            "DD MMMM YYYY à HH:mm"
                        )}
                    </p>
                </div>

                <div></div>
                <div className="mt-5 flex flex-col xl:flex-row jusitfy-center items-stretch w-full xl:space-x-8 space-y-4 md:space-y-6 xl:space-y-0">
                    <div className="flex flex-col justify-start items-start w-full space-y-4 md:space-y-6 xl:space-y-8">
                        <div className="flex flex-col justify-start items-start dark:bg-gray-800 bg-gray-50 px-4 py-4 md:py-4 md:p-4 xl:p-4 w-full">
                            <div className="max-md:mt-4 flex flex-col md:flex-row justify-start items-start md:items-center md:space-x-6 xl:space-x-8 w-full">
                                <div className="max-md:pb-4 w-full md:w-36  ">
                                    <img
                                        className="w-full hidden r md:block  "
                                        src={`http://localhost:8000/assets/uploads/clients/${client?.image}`}
                                        alt="client_img"
                                    />
                                    <img
                                        className="w-full md:hidden"
                                        src={`http://localhost:8000/assets/uploads/clients/${client?.image}`}
                                        alt="client"
                                    />
                                </div>

                                <div className=" bclient-gray-200 md:flex-col flex-col flex justify-between items-start h-full w-full  space-y-4 md:space-y-6">
                                    <div className="justify-between flex w-full">
                                        <div className="w-full flex flex-col justify-start items-start space-y-8">
                                            <h3 className="text-lg dark:text-white uppercase xl:text-2xl font-semibold leading-6 text-gray-800">
                                                {client?.name} {client?.lname}
                                            </h3>
                                        </div>
                                    </div>
                                    <div className="justify-between mt-5 flex flex-col w-full">
                                        <div className="w-full flex  justify-start items-center space-x-2">
                                            <h3 className=" dark:text-white  font-semibold leading-6 text-gray-800">
                                                Numero de telephone :
                                            </h3>
                                            <p className="text-base dark:text-white font-bold xl:text-lg leading-6">
                                                {client?.phone}
                                            </p>
                                        </div>
                                        <div className="w-full flex  justify-start items-center space-x-2">
                                            <h3 className=" dark:text-white  font-semibold leading-6 text-gray-800">
                                                Ville :
                                            </h3>
                                            <p className="text-base dark:text-white font-bold xl:text-lg leading-6">
                                                {client?.city}
                                            </p>
                                        </div>
                                        <div className="w-full flex  justify-start items-center space-x-2">
                                            <h3 className=" dark:text-white  font-semibold leading-6 text-gray-800">
                                                Addresse :
                                            </h3>
                                            <p className="text-base dark:text-white font-bold xl:text-lg leading-6">
                                                {client?.address}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="flex justify-between xl:h-full items-center w-full flex-col mt-6 ">
                    <div className="flex w-full justify-center items-center ">
                        <button className="mt-6 md:mt-0 dark:border-white dark:hover:bg-gray-900 dark:bg-transparent dark:text-white py-5 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-800 border border-gray-800 font-medium w-96 2xl:w-full text-base leading-4 text-gray-800">
                            <Link to={`/clients/edit/${client?.id}`}>
                                Edit Client
                            </Link>
                        </button>
                    </div>
                </div>
                <div className="relative overflow-x-auto">
                    <table className="w-full mt-4 text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                            <tr>
                                <th scope="col" className="px-6 py-3">
                                    #
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    Prix
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    Méthode de paiement
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    Crédit
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    Prix payé
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    Prix restant
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    Date finale du crédit
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    Date finale du traité
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {orders?.length === 0 && (
                                <tr>
                                    <td
                                        colSpan="8"
                                        className="text-center py-4"
                                    >
                                        No orders found
                                    </td>
                                </tr>
                            )}
                            {orders?.map((order) => (
                                <tr
                                    key={order.id}
                                    className="bg-white border-b"
                                >
                                    <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                                        {order.id}
                                    </td>
                                    <td className="px-6 py-4">
                                        {order.total_price}
                                    </td>
                                    <td className="px-6 py-4">
                                        {order.payment_method}
                                    </td>
                                    <td className="px-6 py-4">
                                        <div
                                            className={`px-2 rounded ${order.is_credit === 1
                                                    ? "bg-red-100 text-red-800"
                                                    : "bg-green-100 text-green-800"
                                                }`}
                                        >
                                            {order.is_credit === 1
                                                ? "Oui"
                                                : "Non"}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        {order.paid_price}
                                    </td>
                                    <td className="px-6 py-4">
                                        {order.remain_price}
                                    </td>
                                    <td className="px-6 py-4">
                                        {order.date_fin_credit}
                                    </td>
                                    <td className="px-6 py-4">
                                        {order.traita_date}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    );
}

export default ClientDetails;
