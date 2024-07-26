import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Button } from "../../components/ui/button.jsx";
import ClientApi from "../../services/Api/Clients/ClientApi.jsx";
import { useToast } from "../../components/ui/use-toast.js";
import { Edit2, Loader } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import axiosClient from "@/api/axiosClient.jsx";
import Loader2 from "@/components/loader";
import { renderImageDir } from "@/helpers/utils.jsx";

export default function ClientEdit() {
    const { id } = useParams();
    const { toast } = useToast();
    const navigate = useNavigate();

    const { csrf } = useAuth();

    const [loading, setLoading] = useState(false);

    // State to hold client data
    const [clientData, setClientData] = useState({
        name: "",
        lname: "",
        phone: "",
        city: "",
        address: "",
        image: "",
    });

    const [newImage, setNewImage] = useState("")
    const [imagePreview, setImagePreview] = useState("")

    useEffect(() => {
        const fetchClient = async () => {
            try {
                setLoading(true)
                await csrf();
                const response = await axiosClient.post(`/api/clients/edit/${id}`);
                if (response.status === 200) {
                    setClientData(response.data);
                    setImagePreview(renderImageDir(response?.data?.image ?? ""))
                } else {
                    throw new Error("Failed to fetch client data");
                }
            } catch (error) {
                console.error("Fetch Client Error", error);
            } finally {
                setLoading(false)
            }
        };
        fetchClient();
    }, [id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setClientData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];

        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setNewImage(reader.result); // Base64 string
                setImagePreview(reader.result); // Base64 string
            };
            reader.readAsDataURL(file);
        } else {
            setNewImage('')
            setImagePreview(renderImageDir(clientData?.image ?? ""))
        }
    }


    const [isProgress, setInProgress] = useState(false)


    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setInProgress(true)

            // re-arrange data
            const formData = new FormData();
            formData.append("name", clientData.name);
            formData.append("lname", clientData.lname);
            formData.append("phone", clientData.phone);
            formData.append("city", clientData.city);
            formData.append("address", clientData.address);
            formData.append("image", newImage ?? "");

            await csrf();

            // Call API to update client data
            const response = await axiosClient.post(`/api/clients/update/${id}`, formData);
            if (response.status === 201) {
                toast({
                    title: "Success",
                    description: "Client updated successfully!",
                });
                navigate("/clients");
            } else {
                throw new Error("Failed to update client data");
            }

            setInProgress(false)
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to update client data",
            });

            setInProgress(false)
        }
    };

    return loading ? <Loader2 /> : (
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
                <h2 className="text-2xl font-semibold dark:text-gray-300">
                    Modifier client
                </h2>
            </div>

            <form onSubmit={handleSubmit} method="PUT" encType="multipart/form-data">
                <div className="space-y-3 p-2">
                    <div className="mb-3">
                        <label htmlFor="name" className="block mb-1">
                            Nom *
                        </label>
                        <input
                            placeholder="Nom"
                            value={clientData.name}
                            onChange={handleChange}
                            name="name"
                            className="w-full p-2 border border-gray-300 rounded"
                        />
                    </div>
                </div>
                <div className="space-y-3 p-2">
                    <div className="mb-3">
                        <label htmlFor="lname" className="block mb-1">
                            Prénom
                        </label>
                        <input
                            placeholder="Prénom"
                            value={clientData.lname}
                            onChange={handleChange}
                            name="lname"
                            className="w-full p-2 border border-gray-300 rounded"
                        />
                    </div>
                </div>
                <div className="space-y-3 p-2">
                    <div className="mb-3">
                        <label htmlFor="phone" className="block mb-1">
                            Téléphone
                        </label>
                        <input
                            placeholder="Téléphone"
                            value={clientData.phone}
                            onChange={handleChange}
                            name="phone"
                            className="w-full p-2 border border-gray-300 rounded"
                        />
                    </div>
                </div>
                <div className="space-y-3 p-2">
                    <div className="mb-3">
                        <label htmlFor="city" className="block mb-1">
                            Ville
                        </label>
                        <input
                            placeholder="Ville"
                            value={clientData.city}
                            onChange={handleChange}
                            name="city"
                            className="w-full p-2 border border-gray-300 rounded"
                        />
                    </div>
                </div>
                <div className="space-y-3 p-2">
                    <div className="mb-3">
                        <label htmlFor="address" className="block mb-1">
                            Adresse
                        </label>
                        <input
                            placeholder="Adresse"
                            value={clientData.address}
                            onChange={handleChange}
                            name="address"
                            className="w-full p-2 border border-gray-300 rounded"
                        />
                    </div>
                </div>
                <div className="grid w-full max-w-sm items-center gap-1.5">
                    <label htmlFor="__img" className="block mb-1 max-md:text-sm">
                        <span>Image</span>
                        <div className="max-w-[200px] cursor-pointer hover:opacity-95 rounded relative">
                            <img src={imagePreview} alt="" className="w-full h-auto rounded" />
                            <span className="border rounded bg-black/20 absolute bottom-2 right-2 hover:bg-black/50 text-white p-2"><Edit2 className="w-4 h-4" /></span>
                        </div>
                    </label>
                    <input
                        id="__img"
                        name="image"
                        type="file"
                        onChange={handleFileChange}
                        className="w-full md:p-2 px-2 py-1 max-md:text-xs border border-gray-300 rounded"
                        accept="image/png, image/jpg, image/jpeg"
                        hidden
                    />
                </div>
                <Button type="submit" className='m-2' disabled={isProgress}>
                    {isProgress && (
                        <Loader className="mx-2 my-2 animate-spin " />
                    )}
                    Modifier
                </Button>
            </form>
        </>
    );
}
