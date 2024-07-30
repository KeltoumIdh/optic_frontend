import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import dayjs from "dayjs";
import { useAuth } from "@/hooks/useAuth";
import axiosClient from "@/api/axiosClient";
import Loader from "@/components/loader";
import { renderImageDir } from "@/helpers/utils";


function ProductDetails() {

    const { csrf } = useAuth()

    const [loading, setLoading] = useState(false);

    const [product, setProduct] = useState();
    const [orders, setOrders] = useState();

    const { id } = useParams();

    const getProduct = async () => {
        try {
            setLoading(true)
            await csrf()
            const response = await axiosClient.get(`/api/products/details/${id}`);
            setProduct(response.data.product);
            setOrders(response.data.orders);
        } catch (err) {
            console.log("err", err);
        } finally {
            setLoading(false)
        }
    };

    useEffect(() => {
        getProduct();
    }, [id]);

    return loading ? <Loader /> : (
        <>
            <div className="pb-14 px-4 md:px-6 2xl:px-20 2xl:container 2xl:mx-auto">
                <div className="flex justify-start item-start space-y-2 flex-col">
                    <div className="flex items-center">
                        <Link to={"/products"} className="mr-2">
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
                            Product #{product?.reference}
                        </h1>
                    </div>
                    <p className="lg:text-base text-xs dark:text-gray-300 px-4 font-medium leading-6 text-gray-600">
                        {dayjs(product?.created_at).format(
                            "DD MMMM YYYY à HH:mm"
                        )}
                    </p>
                </div>

                <div></div>
                <div className="mt-5 flex flex-col xl:flex-row jusitfy-center items-stretch w-full xl:space-x-8 space-y-4 md:space-y-6 xl:space-y-0">
                    <div className="flex flex-col justify-start items-start w-full space-y-4 md:space-y-6 xl:space-y-8">
                        <div className="flex flex-col justify-start items-start dark:bg-gray-800 bg-gray-50 px-4 py-4 md:py-4 md:p-4 xl:p-4 w-full">
                            <div className="max-md:mt-4 flex flex-col md:flex-row justify-start max-md:justify-center md:items-center items-center md:space-x-6 xl:space-x-8 w-full">
                                <div className="max-md:pb-4 w-44 md:w-48 ">
                                    <img
                                        className="w-full hidden r md:block  "
                                        src={renderImageDir(product?.image)}
                                        alt="product_img"
                                    />
                                    <img
                                        className="w-full md:hidden"
                                        src={renderImageDir(product?.image)}
                                        alt="product"
                                    />
                                </div>

                                <div className=" py-4 md:flex-col flex-col flex justify-between items-start h-full w-full  space-y-4 md:space-y-6">
                                    <div className="justify-between flex w-full">
                                        <div className="w-full flex flex-col justify-start items-start space-y-8">
                                            <h3 className="text-lg uppercase dark:text-white xl:text-2xl font-semibold leading-6 text-gray-800">
                                                {product?.name}
                                            </h3>
                                        </div>
                                        <div className="flex justify-end space-x-8 items-start w-full">
                                            <p className="text-base dark:text-white text-green-700 font-bold  leading-6">
                                                {product?.price} dh
                                            </p>
                                        </div>
                                    </div>
                                    <div className="justify-between mt-5 flex flex-col w-full">
                                        <div className="w-full flex  justify-start items-center space-x-2">
                                            <h3 className="text-lg dark:text-white  font-semibold leading-6 text-gray-800">
                                                Initial Quantity :
                                            </h3>
                                            <p className="text-base dark:text-white font-bold xl:text-lg leading-6">
                                                {product?.initial_quantity}
                                            </p>
                                        </div>
                                        <div className="w-full flex  justify-start items-center space-x-2">
                                            <h3 className="text-lg dark:text-white  font-semibold leading-6 text-gray-800">
                                                Quantity :
                                            </h3>
                                            <p className="text-base dark:text-white font-bold xl:text-lg leading-6">
                                                {product?.quantity_available}
                                            </p>
                                        </div>
                                        <div className="w-full flex  justify-start items-center space-x-2">
                                            <h3 className="text-lg dark:text-white  font-semibold leading-6 text-gray-800">
                                                Quantity sold :
                                            </h3>
                                            <p className="text-base dark:text-white font-bold xl:text-lg leading-6">
                                                {product?.quantity_sold}
                                            </p>
                                        </div>
                                        <div className="w-full flex  justify-start items-center space-x-2">
                                            <h3 className="text-lg dark:text-white  font-semibold leading-6 text-gray-800">
                                                Note :
                                            </h3>
                                            <p className="text-base dark:text-white font-bold xl:text-lg leading-6">
                                                {product?.message}
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
                            <Link to={`/products/edit/${product?.id}`}>
                                Modifier le produit
                            </Link>
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}

export default ProductDetails;
