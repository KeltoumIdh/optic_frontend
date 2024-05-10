import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

import { Button } from "../../components/ui/button.jsx";
import { Loader } from "lucide-react";
import { useToast } from "../../components/ui/use-toast.js";
import { axiosProduct } from "../../api/axios.js";

export default function ProductAdd() {
    const { id } = useParams();
    const { toast } = useToast();
    const navigate = useNavigate();

    const [product, setproduct] = useState({
        name: "",
        reference: "",
        message: "",
        price: "",
        quantity_sold: "",
        quantity_available: "",
        image: "",
    });

    const [newImage, setNewImage] = useState({})


    const fetchProduct = async () => {
        try {
            const response = await axiosProduct.post(
                `/products/edit/${id}`
            );
            if (response.status === 200) {
                setproduct(response.data);
            } else {
                throw new Error("Failed to fetch Product data");
            }
        } catch (error) {
            console.error("Error fetching Product data:", error);
        }
    };


    useEffect(() => {
        fetchProduct();
    }, []);


    // Change Product Image
    const handleFileChange = (event) => {
        const newImage = event.target.files[0];

        if (newImage) setNewImage(newImage);
    };

    const [isProgress, setInProgress] = useState(false)

    /**
     * Form Submit
     * re-arrange data and send request to the backend
    */
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setInProgress(true)


            const formData = new FormData();
            formData.append("name", product.name);
            formData.append("reference", product.reference);
            formData.append("message", product.message);
            formData.append("price", product.price);
            formData.append("quantity_available", product.quantity_available);
            formData.append("quantity_sold", product.quantity_sold);
            formData.append("image", newImage);


            const response = await axiosProduct.post(`/products/update/${id}`, formData);


            if (response.status === 200) {
                toast({
                    title: "Success",
                    description: "Product updated successfully!",
                });
                navigate("/products");
            }
            setInProgress(false)
        } catch (error) {
            console.error("Error updating product:", error);
            setInProgress(false)
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setproduct((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    return (
        <>
            <div className="flex items-center p-2">
                <Link to={"/products"} className="mr-2">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth="1.5"
                        stroke="currentColor"
                        className="w-6 h-6 max-md:w-4"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18"
                        />
                    </svg>
                </Link>
                <h4 className="lg:text-2xl text-lg font-semibold dark:text-gray-300">
                    Modifier produit
                </h4>
            </div>
            {/* onSubmit={onSubmit} */}
            {/* <form onSubmit={handleSubmit(onSubmit)} className="space-y-3 p-2"> */}
            <form onSubmit={handleSubmit} className="space-y-3 p-2" encType="multipart/form-data">
                <div className="mb-3">
                    <label htmlFor="name" className="block mb-1 max-md:text-sm">
                        Nom *
                    </label>
                    <input
                        placeholder="Nom"
                        value={product.name}
                        onChange={handleChange}
                        name="name"
                        className="w-full md:p-2 px-2 py-1 max-md:text-xs border border-gray-300 rounded"
                        />

                    {/* <span className="text-red-500">
                        {errors.name && errors.name.message}
                    </span> */}
                </div>

                <div className="mb-3">
                    <label htmlFor="reference" className="block mb-1 max-md:text-sm">
                        Reference *
                    </label>
                    <input
                        placeholder="Reference"
                        value={product.reference}
                        onChange={handleChange}
                        name="reference"
                        className="w-full md:p-2 px-2 py-1 max-md:text-xs border border-gray-300 rounded"
                        />
                    <span className="text-red-500">
                        {/* {errors.reference && errors.reference.message} */}
                    </span>
                </div>

                <div className="mb-3">
                    <label htmlFor="price" className="block mb-1 max-md:text-sm">
                        Price *
                    </label>
                    <input
                        type="number"
                        placeholder="Price"
                        value={product.price}
                        onChange={handleChange}
                        name="price"
                        className="w-full md:p-2 px-2 py-1 max-md:text-xs border border-gray-300 rounded"
                        />
                    <span className="text-red-500">
                        {/* {errors.price && errors.price.message} */}
                    </span>
                </div>

                <div className="mb-3">
                    <label htmlFor="quantity" className="block mb-1 max-md:text-sm">
                        Quantity *
                    </label>
                    <input
                        placeholder="Quantity"
                        value={product.quantity_available}
                        onChange={handleChange}
                        name="quantity_available"
                        className="w-full md:p-2 px-2 py-1 max-md:text-xs border border-gray-300 rounded"
                        />
                    <span className="text-red-500">
                        {/* {errors.quantity && errors.quantity.message} */}
                    </span>
                </div>

                <div className="mb-3">
                    <label htmlFor="message" className="block mb-1 max-md:text-sm">
                        Note
                    </label>
                    <input
                        placeholder="Note.."
                        value={product.message}
                        onChange={handleChange}
                        name="message"
                        className="w-full md:p-2 px-2 py-1 max-md:text-xs border border-gray-300 rounded"
                        />
                    <span className="text-red-500">
                        {/* {errors.message && errors.message.message} */}
                    </span>
                </div>

                <div className="grid w-full max-w-sm items-center gap-1.5">
                    <label htmlFor="image" className="block mb-1 max-md:text-sm">
                        Image
                    </label>
                    <input
                        name="image"
                        type="file"
                        onChange={handleFileChange}
                        className="w-full md:p-2 px-2 py-1 max-md:text-xs border border-gray-300 rounded"
                        accept="image/png,image/jpeg,image/jpg"
                    />
                </div>

                <Button className="mt-3 max-md:text-sm max-md:p-2" type="submit">
                    {isProgress && <Loader className={"mx-2 my-2 animate-spin"} />}
                    modifier
                </Button>
            </form>
        </>
    );
}
