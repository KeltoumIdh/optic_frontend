import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import dayjs from "dayjs";
import OrderApi from "../../services/Api/Orders/OrderApi";
import { axiosOrder } from "../../api/axios";
import { Loader } from "lucide-react";

function OrderDetails() {
    const [order, setOrder] = useState({});
    const [products, setProducts] = useState();

    const { id } = useParams();

    const getOrder = async () => {
        try {
            const response = await OrderApi.show(id);
            setOrder(response.data.order);
            setProducts(response.data.products);
        } catch (err) {
            console.log("err", err);
        }
    };

    const [isLoading, setIsLoading] = useState(false);
    const handleDownload = async () => {
        try {
            setIsLoading(true);

            const { data: filePath } = await axiosOrder.post(
                `/download-invoice/${id}`
            );

            const alink = document.createElement("a");
            alink.href = filePath ?? "";
            alink.setAttribute("target", "_blank");
            document.body.appendChild(alink);
            alink.click();

            setIsLoading(false);
        } catch (err) {
            console.log("err", err);
            setIsLoading(false);
        }
    };

    useEffect(() => {
        getOrder();
    }, [id]);

    return (
        <>
            <div
                id="pdfElement"
                className="pb-14 px-4 md:px-6 2xl:px-20 2xl:container 2xl:mx-auto"
            >
                <div className="flex justify-start item-start space-y-2 flex-col">
                    <div className="flex justify-between items-center">
                        <div className="flex items-center">
                            <Link to={"/orders"} className="mr-2">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    strokeWidth="1.5"
                                    stroke="currentColor"
                                    className="w-5 h-5"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18"
                                    />
                                </svg>
                            </Link>
                            <h1 className="md:text-2xl text-lg dark:text-white  font-semibold leading-7 lg:leading-9 text-gray-800">
                                La Commande #{order.id}
                            </h1>
                        </div>
                        <div className="flex space-x-2 items-center">
                            <button
                                onClick={handleDownload}
                                className="bg-blue-500 hover:bg-blue-700 text-white font-bold text-sm py-2 px-4 rounded inline-flex items-center"
                            >
                                <svg
                                    className="fill-current w-3 h-3 md:mr-2"
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 20 20"
                                >
                                    <path d="M13 8V2H7v6H2l8 8 8-8h-5zM0 18h20v2H0v-2z" />
                                </svg>
                                <span>
                                    {!isLoading ? (
                                        <span className="md:block hidden">
                                            Download
                                        </span>
                                    ) : (
                                        <Loader
                                            className={"mx-2 my-2 animate-spin"}
                                        />
                                    )}
                                </span>
                            </button>
                            {/* <button className="bg-orange-500 hover:bg-orange-700 text-white text-sm font-bold py-2 px-4 rounded">
                            <Link
                                to={`/view-invoice/${order.id}`}
                                target="_blank"
                            >
                                Afficher
                            </Link>
                        </button> */}
                        </div>
                    </div>
                    <p className="md:text-base text-xs dark:text-gray-300 font-medium leading-6 text-gray-600">
                        {/* 21st Mart 2021 at 10:34 PM ...{" "} */}
                        {dayjs(order.created_at).format("DD MMMM YYYY à HH:mm")}
                    </p>
                </div>

                <div></div>
                <div className="mt-5 flex flex-col xl:flex-row jusitfy-center items-stretch w-full xl:space-x-8 space-y-4 md:space-y-6 xl:space-y-0">
                    <div className="flex flex-col justify-start items-start w-full space-y-4  ">
                        {order?.cart &&
                            JSON.parse(order.cart).productsCart.map((p) => {
                                const product = products.find(
                                    (product) => product.id === p.product_id
                                );
                                if (!product) return null;
                                return (
                                    <div
                                        key={p.product_id}
                                        className="flex flex-col justify-start items-start dark:bg-gray-800 bg-gray-50 px-4 py-4 md:py-4 md:p-4 xl:p-4 w-full"
                                    >
                                        <div className="max-md:mt-4 flex flex-col md:flex-row justify-start items-start md:items-center md:space-x-6 xl:space-x-8 w-full">
                                            <div className="max-md:pb-4 w-full md:w-20 max-md:flex justify-center">
                                                <img
                                                    className="w-full hidden md:block"
                                                    src={`http://localhost:8000/assets/uploads/products/${product.image}`}
                                                    alt="product_img"
                                                />
                                                <img
                                                    className="w-1/2 md:hidden"
                                                    src={`http://localhost:8000/assets/uploads/products/${product.image}`}
                                                    alt="product"
                                                />
                                            </div>

                                            <div className=" border-gray-200 md:flex-row flex-col flex justify-between items-center w-full  space-y-4 md:space-y-0">
                                                <div className="w-full flex flex-col justify-start items-start space-y-8">
                                                    <h3 className="text-lg dark:text-white font-semibold leading-6 text-gray-800">
                                                        {product.name}{" "}
                                                        <apan className="text-sm">
                                                            ({product.reference}
                                                            )
                                                        </apan>
                                                    </h3>
                                                </div>
                                                <div className="flex justify-between space-x-8 items-center w-full">
                                                    <p className="text-base dark:text-white  leading-6">
                                                        {p.price} dh
                                                    </p>
                                                    <p className="text-base dark:text-white  leading-6 text-gray-800">
                                                        x{p.quantity}
                                                    </p>
                                                    <p className="text-base  text-right text-green-700 font-bold xl:text-lg  leading-6 ">
                                                        {p.price * p.quantity}{" "}
                                                        dh
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}

                        <div className="flex justify-center flex-col md:flex-row  items-stretch w-full space-y-4 md:space-y-0 md:space-x-6 xl:space-x-8">
                            <div className="flex flex-col px-4 py-6 md:p-6 xl:p-8 w-full bg-gray-100 dark:bg-gray-800 space-y-6">
                                <h3 className="text-xl dark:text-white font-semibold leading-5 text-gray-800">
                                    Sommaire
                                </h3>
                                <div className="flex justify-center items-center w-full space-y-4 flex-col border-gray-200 border-b pb-4">
                                    <div className="flex justify-between w-full">
                                        <p className="text-base dark:text-white leading-4 text-gray-800">
                                            PRIX PAYÉ
                                        </p>
                                        <p className="text-base dark:text-gray-300 leading-4 text-gray-600">
                                            {order.paid_price}
                                        </p>
                                    </div>
                                    <div className="flex justify-between items-center w-full">
                                        <p className="text-base dark:text-white leading-4 text-gray-800">
                                            PRIX RESTANT
                                        </p>
                                        <p
                                            className={`${
                                                order.remain_price === "0.00"
                                                    ? "text-red-600"
                                                    : "text-gray-600"
                                            }text-base dark:text-gray-300 leading-4 `}
                                        >
                                            {order.remain_price}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex justify-between items-center w-full">
                                    <p className="text-base dark:text-white font-semibold leading-4 text-gray-800">
                                        Total
                                    </p>
                                    <p className="text-base dark:text-gray-300 font-bold leading-4 text-green-700">
                                        {order.total_price} dh
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="bg-gray-100 dark:bg-gray-800 w-full xl:w-96 flex justify-between  md:h-fit items-start px-4 py-6  flex-col">
                        <div>
                            <h3 className="text-xl dark:text-white font-semibold leading-5 text-gray-800">
                                Client
                            </h3>
                            <div className="flex flex-col md:flex-row  xl:flex-col justify-start items-stretch h-full w-full md:space-x-6 lg:space-x-8 xl:space-x-0">
                                <div className="flex-col justify-between items-center flex-shrink-0">
                                    <div className="flex justify-start w-full md:justify-start items-center space-x-4 py-4  border-gray-200">
                                        <img
                                            src={`http://localhost:8000/assets/uploads/clients/${order?.client?.image}`}
                                            alt="avatar"
                                            className="w-10"
                                        />
                                        <div className="flex justify-start items-start flex-col space-y-2">
                                            <p className="text-base dark:text-white font-semibold leading-4 text-left text-gray-800">
                                                {order?.client?.name}{" "}
                                                {order?.client?.lname}
                                            </p>
                                            <p className="text-sm dark:text-gray-300 leading-5 text-gray-600">
                                            {order?.client?.city}{' '}{order?.client?.address}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex justify-start text-gray-800 dark:text-white md:justify-start items-center space-x-4    border-gray-200 w-full">
                                        <img
                                            className="w-5 ml-3"
                                            src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAACXBIWXMAAAsTAAALEwEAmpwYAAADS0lEQVR4nO2ZS0hUURjHf6ZZGJWUVqYWGbQSMlpkRYtE2oRBRAVFmGIYZLWM1tKqwih6CLWpXUXagx4LSVr0EiwhIm3Rg4qg1J5oz4lD/wuHYebOXBnvnIH5wd3M/c7c79x7vv/5vu9AlixpZR3QA4wCfcByMox84DgQibqGgVIyhOlAlxwfAVqAIuCyfrtOBjAHeCyH3wJLo+591L1GHGYa0CtHnwLzY9hs1f1PwDwcZBJwR04+AWb62Ha4vMQOyLlXQFkCW7PEBmVfj2MMybHVSdpvk70ZV4JDjMqxwgBjrmmMWWrO8FxOVQYYU6agN+M24wgdcsioUhB2aFw/jtAih84GHFekcb+BHBxgIfAX+AJMDTBuuyZi8jFn6JJTO5O0nwy8dFGGN1nrPS8J+/2yfwRMwCFylZoY55oT2M4CPsu2FgfZIOfeAQU+du2yMxmxk+QAD+TkQZ/Y+CqbJhxmCfAT+AOsimOzxyq0FuAwrVbgF8T5cldl8zDBMkx7qdsnR03JG4tCSxw6JRZOUqVS1zja4LORfpBNuyu7eywarNp9WUyL/50VL/jbcJijliTH66DUWF/vMI4yEbgtJ+/6BHad1C6iitNJioEXcvKGxCAWG63JtLkaM4uA93LyvI9K1VnL7JSrarZYm6Bx8rTPG6+xBKAzznLMlZiYpNNsvgNKXENjBfAticCutqS5J6pPVmvtU9HXRWA2IbEG+GFNJt6XqbA2zSGVxl5GEFHcmVqmSPe8jNp0NLeENZn11mTO+MSCyQCuRL114/A+JaA25RITz65DfbRQvoy3zC74qJn5YrsVNydVz/jRaMXioPpo485K66E3EySQpjWbLKVW7yyiJTmXEPIyT5rvpbj7WG91Qod9UqWU7jNeM+JNih9YYomEketQMoBuPXDUJ2seCzP0v98JMTc7Zq3tEykqvPZa+V6oNFjN8QGJwliptqR+LWmgytrBTRpyCJgS8D8qLCE5QhrJVw/gl1XXNCfZBCwGnmncLS3btGMOVu9bsdOv9my8XnO5ld70BuxJjzs5agJ6bzmixvk5HWlU6njcZM+vLbkNLYkMSp4Oh7p0ChCJc3VrYhmBCeZdwCWp24iy39aAKU2WLKSQf3jSBy3qRwNwAAAAAElFTkSuQmCC"
                                        />
                                        <p className="cursor-pointer text-sm leading-5 ">
                                            {order?.client?.phone}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="w-full">
                            <h3 className="text-xl dark:text-white font-semibold leading-5 py-4 text-gray-800">
                                Methode de Payement
                            </h3>
                            <div className="flex flex-col md:flex-row  xl:flex-col justify-start items-stretch h-full w-full md:space-x-6 lg:space-x-8 xl:space-x-0">
                                <div className="flex-col justify-between items-center flex-shrink-0">
                                    <div className="flex justify-start w-full md:justify-start items-center space-x-4   border-gray-200">
                                        <div className="flex justify-start items-start ml-4  flex-col space-y-2">
                                            <p className="text-sm dark:text-white font-semibold leading-4 text-left text-gray-800">
                                                Methode de payement :{" "}
                                                <span className="text-gray-500">
                                                    {order?.payment_method}
                                                </span>
                                            </p>
                                            {order?.reference_credit && (
                                                <>
                                                    <p className="text-sm dark:text-white font-semibold leading-4 text-left text-gray-800">
                                                        Ref:
                                                        <span className="text-gray-500">
                                                            {" "}
                                                            {
                                                                order?.reference_credit
                                                            }
                                                        </span>
                                                    </p>
                                                </>
                                            )}
                                            {order?.is_credit === 1 && (
                                                <>
                                                    <p className="text-sm dark:text-white font-semibold leading-4 text-left text-gray-800">
                                                        date fin:
                                                        <span className="text-gray-500">
                                                            {" "}
                                                            {
                                                                order?.date_fin_credit
                                                            }
                                                        </span>
                                                    </p>
                                                </>
                                            )}
                                            <p className="text-sm dark:text-white font-semibold leading-4 flex items-center  text-left text-gray-800">
                                                Credit :{" "}
                                                <span
                                                    className={`${
                                                        order.is_credit === 1
                                                            ? "bg-red-100 text-red-800"
                                                            : "bg-green-100 text-green-800"
                                                    } flex items-center w-fit p-1 mx-2 rounded-md`}
                                                >
                                                    {order.is_credit === 1
                                                        ? "Oui"
                                                        : "Non"}
                                                </span>
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex justify-between xl:h-full items-center w-full flex-col mt-4 ">
                                    <div className="flex w-fit justify-center items-center ">
                                        <button className="mt-6 md:mt-0 dark:border-white dark:hover:bg-gray-900 dark:bg-transparent dark:text-white py-3 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-800 border border-gray-800 font-medium  p-4  text-base leading-4 text-gray-800">
                                            <Link
                                                to={`/orders/edit/${order.id}`}
                                            >
                                                Modifier la Commande
                                            </Link>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default OrderDetails;
