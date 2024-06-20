import React, { useState } from "react";
import { Link, useNavigate } from 'react-router-dom'
import { useForm, FormProvider } from "react-hook-form";
import { Button } from "../../components/ui/button.jsx";
import { Loader } from "lucide-react";
import { useToast } from "../../components/ui/use-toast.js";
import { useAuth } from "@/hooks/useAuth.jsx";
import axiosClient from "@/api/axiosClient.jsx";


export default function ProductEdit() {
    const { toast } = useToast()
    const [imageName, setImageName] = useState('');
    const methods = useForm();
    const navigate = useNavigate();

    const { csrf } = useAuth()

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        setError,
        reset,
    } = useForm();

    const handleFileChange = (event) => {
        const files = event.target.files;

        if (files.length > 0) {
            const firstFile = files[0];
            setImageName(firstFile.name);
        }
    }
    const onSubmit = async (values) => {

        const formData = new FormData();
        formData.append('name', values.name);
        formData.append('reference', values.reference);
        formData.append('message', values.message);
        formData.append('quantity', values.quantity);
        formData.append('price', values.price);
        if (values.image && values.image.length > 0) {
            formData.append('image', values.image[0]);
        }

        try {
            await csrf();
            const { status, data } = await axiosClient.post('/api/products/add', formData);

            if (status === 201) {
                toast({
                    title: "Success",
                    description: "Product created successfully!",
                });
                reset();
                navigate("/products");
            }

        } catch ({ response }) {
            Object.entries(response.data.errors).forEach((error) => {
                const [fieldName, errorMessages] = error;
                setError(fieldName, {
                    message: errorMessages.join(),
                });
            });
        }
    };


    return (
        <>
            <div className="flex items-center p-2">
                <Link to={'/products'} className='mr-2'>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6 max-md:w-4">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
                    </svg>
                </Link>
                <h4 className="lg:text-2xl text-lg font-semibold dark:text-gray-300">
                    Ajouter produit
                </h4>
            </div>

            <FormProvider {...methods}>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-3 p-2">
                    <div className="mb-3">
                        <label htmlFor="name" className="block mb-1 max-md:text-sm">
                            Nom
                        </label>
                        <input
                            placeholder="Nom"
                            {...register("name", { required: "Name is required" })}
                            className="w-full md:p-2 px-2 py-1 max-md:text-xs border border-gray-300 rounded"
                        />
                        <span className="text-red-500">{errors.name && errors.name.message}</span>
                    </div>

                    <div className="mb-3">
                        <label htmlFor="reference" className="block mb-1 max-md:text-sm">
                            Reference
                        </label>
                        <input
                            placeholder="Reference"
                            {...register("reference", { required: "Reference is required" })}
                            className="w-full md:p-2 px-2 py-1 max-md:text-xs border border-gray-300 rounded"
                        />
                        <span className="text-red-500">{errors.reference && errors.reference.message}</span>
                    </div>

                    <div className="mb-3">
                        <label htmlFor="price" className="block mb-1 max-md:text-sm">
                            Price
                        </label>
                        <input
                            type="number"
                            placeholder="Price"
                            {...register("price", { required: "Price is required" })}
                            className="w-full md:p-2 px-2 py-1 max-md:text-xs border border-gray-300 rounded"
                        />
                        <span className="text-red-500">{errors.price && errors.price.message}</span>
                    </div>

                    <div className="mb-3">
                        <label htmlFor="quantity" className="block mb-1 max-md:text-sm">
                            Quantity
                        </label>
                        <input
                            placeholder="Quantity"
                            {...register("quantity", { required: "Quantity is required" })}
                            className="w-full md:p-2 px-2 py-1 max-md:text-xs border border-gray-300 rounded"
                        />
                        <span className="text-red-500">{errors.quantity && errors.quantity.message}</span>
                    </div >

                    <div className="mb-3">
                        <label htmlFor="message" className="block mb-1 max-md:text-sm">
                            Note
                        </label>
                        <input
                            placeholder="Note.."
                            {...register("message")}
                            className="w-full md:p-2 px-2 py-1 max-md:text-xs border border-gray-300 rounded"
                        />
                        <span className="text-red-500">{errors.message && errors.message.message}</span>
                    </div>

                    <div className="grid w-full max-w-sm items-center gap-1.5">
                        <label htmlFor="image" className="block mb-1 max-md:text-sm">
                            Image
                        </label>
                        <input
                            {...register("image")}
                            name="image"
                            type="file"
                            onChange={handleFileChange}
                            className="w-full md:p-2 px-2 py-1 max-md:text-xs border border-gray-300 rounded"
                        />
                    </div>

                    <Button className="mt-3 max-md:text-sm max-md:p-2" type="submit">
                        {isSubmitting && <Loader className={'m-2  animate-spin'} />} {' '}
                        Create
                    </Button>
                </form>
            </FormProvider>
        </>
    )
}
