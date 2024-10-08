import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { useCheckoutStore } from "../../store";
import { useAuth } from "@/hooks/useAuth";
import axiosClient from "@/api/axiosClient";
import { backEndUrl, renderImageDir } from "@/helpers/utils";
import Spinner from "@/components/Spinner";

function OrderConfirmed() {

    const { csrf } = useAuth();

    const { removeFromSelectedProd, setCartI } = useCheckoutStore();
    const [products, setProducts] = useState([]);
    const [quantities, setQuantities] = useState({});
    const [totalPrice, setTotalPrice] = useState(0);
    const [cart, setCart] = useState({});

    const location = useLocation();
    const selectedProducts = location?.state?.selectedProducts;
    const clientId = location.state?.clientId;


    const [inProgress, setInProgress] = useState(false)

    const getProducts = async (selectedProducts) => {
        try {
            setInProgress(true)
            await csrf();
            const response = await axiosClient.get("/api/orders/confirmed", {
                params: {
                    selectedProductIds: selectedProducts,
                },
            });
            const products = response.data.products;
            setProducts(products);
        } catch (error) {
            console.error("Error fetching selected products:", error);
        } finally {
            setInProgress(false)
        }
    };

    const handleIncrementQuantity = (productId) => {
        const availableQuantity = products.find((product) => product.id === productId)?.quantity_available || 0;
        setQuantities((prevQuantities) => ({
            ...prevQuantities,
            [productId]: Math.min((prevQuantities[productId] || 1) + 1, availableQuantity),
        }));
    };

    const handleDecrementQuantity = (productId) => {
        setQuantities((prevQuantities) => ({
            ...prevQuantities,
            [productId]: Math.max((prevQuantities[productId] || 0) - 1, 1),
        }));
    };

    const handleInputChange = (productId, newQuantity) => {
        const availableQuantity =
            products.find((product) => product.id === productId)
                ?.quantity_available || 0;
        const parsedQuantity = parseInt(newQuantity, 10) || 0;
        const limitedQuantity = isNaN(parsedQuantity)
            ? 0
            : Math.min(parsedQuantity, availableQuantity);
        setQuantities((prevQuantities) => ({
            ...prevQuantities,
            [productId]: limitedQuantity,
        }));
    };


    const handleRemoveProduct = (productId) => {
        setProducts((prevProducts) =>
            prevProducts.filter((product) => product.id !== productId)
        );

        setQuantities((prevQuantities) => {
            const newQuantities = { ...prevQuantities };
            delete newQuantities[productId];
            return newQuantities;
        });
        removeFromSelectedProd(productId);
        // Calculate the new total price
        const newTotalPrice = products.reduce((acc, product) => {
            const quantity = quantities[product.id] || 0;
            return acc + quantity * product.price;
        }, 0);

        setTotalPrice(newTotalPrice);
    };

    const addToCart = async () => {
        const cartItem = {
            client_id: clientId,
            productsCart: selectedProducts.map((productId) => ({
                product_id: productId,
                quantity: quantities[productId] || 1,
                reference: products?.find((product) => product.id === productId)?.reference || "",
                name: products?.find((product) => product.id === productId)?.name || "",
                price: products?.find((product) => product.id === productId)?.price || "",
            })),
            total_price: totalPrice,
        };
        setCartI(cartItem);
        setCart(cartItem);
    };

    useEffect(() => {
        const newTotalPrice = products.reduce((acc, product) => {
            const quantity = quantities[product.id] || 1;
            return acc + quantity * product.price;
        }, 0);

        setTotalPrice(newTotalPrice);
    }, [quantities, products]);

    useEffect(() => {
        getProducts(selectedProducts);
    }, [selectedProducts]);

    useEffect(() => {
        handleInputChange(null, null);
    }, []);

    return inProgress ? <Spinner /> : (
        <>
            <div className=" h-screen py-2">
                <div className="container mx-auto md:px-4 px-0">
                    <div className="flex items-center mb-4">
                        <Link
                            to={`/orders/products/add/${clientId}`}
                            className="mr-2 cursor-pointer"
                        >
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
                        <h1 className="lg:text-2xl font-semibold ">
                            Confirm the order
                        </h1>
                    </div>
                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="md:w-3/4">
                            <div className="bg-white rounded-lg max-md:text-xs shadow-md md:p-6 py-4 px-1 mb-4">
                                <table className="w-full">
                                    <thead>
                                        <tr>
                                            <th className="text-left font-semibold">
                                                Produit
                                            </th>
                                            <th className="text-left font-semibold">
                                                Prix
                                            </th>
                                            <th className="text-left font-semibold">
                                            Quantité
                                            </th>
                                            <th className="text-left font-semibold">
                                                Total
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {products?.length > 0 ? (
                                            products.map((product, i) => {
                                                return (
                                                    <tr key={product.id}>
                                                        <td className="py-4 max-md:text-xs">
                                                            <div className="flex items-center">
                                                                <img
                                                                    className="md:h-16 md:w-16 w-10 md:mr-4 mr-1"
                                                                    src={renderImageDir(product.image)}
                                                                    alt=""
                                                                />
                                                                <div className="flex flex-col">
                                                                    <span className="font-semibold">{product.name}</span>
                                                                    <span className=" text-gray-500 text-sm">{product.reference}</span>
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td className="py-4">
                                                            {product.price}
                                                        </td>
                                                        <td className="py-4">
                                                            <div className="flex items-center">
                                                                <button
                                                                    className="border rounded-md md:py-2 md:px-4 px-2 py-1 md:mr-2 mr-1"
                                                                    onClick={() => {
                                                                        handleDecrementQuantity(product.id)
                                                                    }}>
                                                                    -
                                                                </button>
                                                                <span className="text-center md:w-8 select-none">
                                                                    {quantities[product.id] !== undefined ? quantities[product.id] : 1}
                                                                </span>
                                                                <button
                                                                    className="border rounded-md md:py-2 md:px-4 px-2 py-1 md:ml-2 ml-1"
                                                                    onClick={() => handleIncrementQuantity(product.id)}>
                                                                    +
                                                                </button>
                                                            </div>
                                                        </td>
                                                        <td className="py-4">
                                                            {" "}
                                                            {quantities[product.id] > 0 ? (product.price * quantities[product.id]).toFixed(2) : product.price}
                                                        </td>
                                                        <td className="py-4">
                                                            <button
                                                                className="text-red-500 hover:text-red-700"
                                                                onClick={() =>
                                                                    handleRemoveProduct(
                                                                        product.id
                                                                    )
                                                                }
                                                            >
                                                                <svg
                                                                    className="h-5 w-5"
                                                                    viewBox="0 0 20 20"
                                                                    fill="currentColor"
                                                                >
                                                                    <path
                                                                        fillRule="evenodd"
                                                                        d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                                                        clipRule="evenodd"
                                                                    />
                                                                </svg>
                                                            </button>
                                                        </td>
                                                    </tr>
                                                )
                                            })
                                        ) : (
                                            <p className="text-center w-full p-4 ">
                                                {" "}
                                                Aucun produit trouvé
                                            </p>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                        <div className="md:w-1/4">
                            {/* <div className="bg-white rounded-lg shadow-md mb-2 p-6">
                    <h2 className="text-lg font-semibold mb-4">Methode de payement</h2>
                    <hr className="my-2"/>
                    <div className="flex justify-between ">
                    </div>
                </div> */}
                            <div className="bg-white rounded-lg shadow-md p-6">
                                <h2 className="lg:text-lg font-semibold mb-4">
                                    Summary
                                </h2>
                                <hr className="my-2" />
                                <div className="flex justify-between ">
                                    <span className="font-semibold">Total</span>
                                    <span className="font-semibold">
                                        MAD {totalPrice.toFixed(2)}
                                    </span>
                                </div>
                                <button
                                    onClick={addToCart}
                                    className="bg-blue-500 text-white py-2 px-4 rounded-lg mt-4 w-full"
                                >
                                    <Link to={"/checkout"}>Aller à la caisse</Link>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default OrderConfirmed;