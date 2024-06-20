import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import {
    Form,
    FormField,
} from "../../components/ui/form";
import { Input } from "../../components/ui/input.jsx";
import { Button } from "../../components/ui/button.jsx";
import { Loader } from "lucide-react";
import { useToast } from "../../components/ui/use-toast.js";
import { useAuth } from "@/hooks/useAuth";
import axiosClient from "@/api/axiosClient.jsx";

export default function ClientAdd() {
    const { toast } = useToast();
    const navigate = useNavigate();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const form = useForm();
    const {
        register,
        handleSubmit,
        setError,
        reset,
        setValue,
        formState: { errors },
    } = form;

    const { csrf } = useAuth()

    // state to store image Obj
    const [image, setImage] = useState({})
    
    const handleFileChange = (e) => {
        const files = e.target.files;

        if (files.length > 0) {
            const firstFile = files[0];
            setValue("image", firstFile);
            setImage(firstFile);
        }
    };

    
    
    const onSubmit = async (values) => {
        // setIsSubmitting(true);

        // re-arrange data
        const formData = new FormData();
        formData.append("name", values.name);
        formData.append("lname", values.lname);
        formData.append("phone", values.phone);
        formData.append("city", values.city);
        formData.append("address", values.address);
        formData.append("image", image);

        try {
            await csrf();
            const response = await axiosClient.post('/api/clients/add',formData);
            if (response.status === 201) {
                toast({
                    title: "Success",
                    description: "Client created successfully!",
                });
                reset();
                navigate("/clients");
            }
        } catch (error) {
            if (error.response) {
                const { data } = error.response;
                if (data.errors) {
                    Object.entries(data.errors).forEach(
                        ([fieldName, errorMessages]) => {
                            setError(fieldName, {
                                message: errorMessages.join(),
                            });
                        }
                    );
                } else {
                    toast({
                        title: "Error",
                        description:
                            data.message ||
                            "An error occurred while creating the client.",
                    });
                }
            } else if (error.request) {
                toast({
                    title: "Error",
                    description: "No response received from the server.",
                });
            } else {
                toast({
                    title: "Error",
                    description:
                        "An error occurred while processing the request.",
                });
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <>
            <div className="flex items-center p-2">
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
                <h2 className=" text-2xl font-semibold  dark:text-gray-300 ">
                    Ajouter un client
                </h2>
            </div>

            <Form {...form}>
                <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="space-y-3 p-2"
                    encType="multipart/form-data"
                >
                    <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                            <Input placeholder="Name" {...field} />
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="lname"
                        render={({ field }) => (
                            <Input placeholder="Last Name" {...field} />
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="phone"
                        type="tel"
                        render={({ field }) => (
                            <Input placeholder="Phone" {...field} />
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="city"
                        render={({ field }) => (
                            <Input placeholder="City" {...field} />
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="address"
                        render={({ field }) => (
                            <Input placeholder="Address" {...field} />
                        )}
                    />
                    <div className="grid w-full max-w-sm items-center gap-1.5">
                        <label htmlFor="image" className="block mb-1">
                            Image
                        </label>
                        <input
                            // {...register("image")}
                            // name="image"
                            type="file"
                            onChange={handleFileChange}
                            className="w-full p-2 border border-gray-300 rounded"
                        />
                    </div>
                    <Button type="submit" disabled={isSubmitting}>
                        {isSubmitting && (
                            <Loader className="mx-2 my-2 animate-spin" />
                        )}
                        Create
                    </Button>
                </form>
            </Form>
        </>
    );
}
