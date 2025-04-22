import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Button } from "../../components/ui/button.jsx";
import { ArrowLeft, Edit2, Loader, User, AlertCircle } from "lucide-react";
import { useToast } from "../../components/ui/use-toast.js";
import { useAuth } from "@/hooks/useAuth";
import axiosClient from "@/api/axiosClient.jsx";
import Loader2 from "@/components/loader";
import { renderImageDir } from "@/helpers/utils.jsx";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function ClientEdit() {
  const { id } = useParams();
  const { toast } = useToast();
  const navigate = useNavigate();
  const { csrf } = useAuth();
  const [loading, setLoading] = useState(false);
  const [isProgress, setInProgress] = useState(false);
  const [errors, setErrors] = useState({});

  // State to hold client data
  const [clientData, setClientData] = useState({
    name: "",
    lname: "",
    phone: "",
    city: "",
    address: "",
    image: "",
  });

  const [newImage, setNewImage] = useState("");
  const [imagePreview, setImagePreview] = useState("");

  useEffect(() => {
    const fetchClient = async () => {
      try {
        setLoading(true);
        await csrf();
        const response = await axiosClient.post(`/api/clients/edit/${id}`);
        if (response.status === 200) {
          setClientData(response.data);
          setImagePreview(
            renderImageDir(response?.data?.image ?? "", "client")
          );
        } else {
          throw new Error("Failed to fetch client data");
        }
      } catch (error) {
        console.error("Fetch Client Error", error);
        toast({
          title: "Erreur",
          description: "Impossible de récupérer les informations du client",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
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

    // Clear field error when user types
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }));
    }
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
      setNewImage("");
      setImagePreview(renderImageDir(clientData?.image ?? "", "client"));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic validation
    const newErrors = {};
    if (!clientData.name) newErrors.name = "Le nom est requis";
    if (!clientData.phone)
      newErrors.phone = "Le numéro de téléphone est requis";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      setInProgress(true);

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
      const response = await axiosClient.post(
        `/api/clients/update/${id}`,
        formData
      );
      if (response.status === 201) {
        toast({
          title: "Succès",
          description: "Client mis à jour avec succès!",
          variant: "success",
        });
        navigate("/clients");
      } else {
        throw new Error("Failed to update client data");
      }
    } catch (error) {
      console.error("Update error:", error);
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour le client",
        variant: "destructive",
      });
    } finally {
      setInProgress(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 />
      </div>
    );
  }

  return (
    <div className="mx-auto px-2 py-4 md:px-4 md:py-6">
      <Card className="shadow-md border border-gray-200 dark:border-gray-700">
        <CardHeader className="pb-4 border-b dark:border-gray-700">
          <div className="flex items-center">
            <Link
              to="/clients"
              className="mr-3 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <div className="flex items-center">
              <User className="h-6 w-6 mr-2 text-primary" />
              <CardTitle className="text-xl md:text-2xl font-bold">
                Modifier le client
              </CardTitle>
            </div>
          </div>
          <CardDescription className="mt-2 text-gray-500 dark:text-gray-400">
            {clientData.name} {clientData.lname}
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          {Object.keys(errors).length > 0 && (
            <Alert variant="destructive" className="mb-6">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Veuillez corriger les erreurs ci-dessous pour continuer.
              </AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit} encType="multipart/form-data">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-5">
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5"
                  >
                    Nom *
                  </label>
                  <input
                    id="name"
                    placeholder="Nom"
                    value={clientData.name}
                    onChange={handleChange}
                    name="name"
                    required
                    className={`w-full px-4 py-2.5 text-sm border ${
                      errors.name
                        ? "border-red-500 focus:ring-red-500"
                        : "border-gray-300 dark:border-gray-700 focus:ring-primary"
                    } rounded-lg dark:bg-gray-800 focus:border-transparent transition-all`}
                  />
                  {errors.name && (
                    <p className="mt-1.5 text-sm text-red-600">{errors.name}</p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="lname"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5"
                  >
                    Prénom
                  </label>
                  <input
                    id="lname"
                    placeholder="Prénom"
                    value={clientData.lname}
                    onChange={handleChange}
                    name="lname"
                    className="w-full px-4 py-2.5 text-sm border border-gray-300 dark:border-gray-700 rounded-lg dark:bg-gray-800 focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                  />
                </div>

                <div>
                  <label
                    htmlFor="phone"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5"
                  >
                    Numéro de téléphone *
                  </label>
                  <input
                    id="phone"
                    placeholder="Téléphone"
                    value={clientData.phone}
                    onChange={handleChange}
                    name="phone"
                    required
                    className={`w-full px-4 py-2.5 text-sm border ${
                      errors.phone
                        ? "border-red-500 focus:ring-red-500"
                        : "border-gray-300 dark:border-gray-700 focus:ring-primary"
                    } rounded-lg dark:bg-gray-800 focus:border-transparent transition-all`}
                  />
                  {errors.phone && (
                    <p className="mt-1.5 text-sm text-red-600">
                      {errors.phone}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="city"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5"
                  >
                    Ville
                  </label>
                  <input
                    id="city"
                    placeholder="Ville"
                    value={clientData.city}
                    onChange={handleChange}
                    name="city"
                    className="w-full px-4 py-2.5 text-sm border border-gray-300 dark:border-gray-700 rounded-lg dark:bg-gray-800 focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                  />
                </div>

                <div>
                  <label
                    htmlFor="address"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5"
                  >
                    Adresse
                  </label>
                  <input
                    id="address"
                    placeholder="Adresse"
                    value={clientData.address}
                    onChange={handleChange}
                    name="address"
                    className="w-full px-4 py-2.5 text-sm border border-gray-300 dark:border-gray-700 rounded-lg dark:bg-gray-800 focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Photo du client
                </label>
                <div className="mt-1 border-2 border-gray-300 dark:border-gray-700 border-dashed rounded-lg h-[300px] flex items-center justify-center overflow-hidden bg-gray-50 dark:bg-gray-800/50">
                  {imagePreview ? (
                    <div className="flex flex-col items-center p-4 w-full h-full">
                      <div className="relative w-full h-full flex items-center justify-center">
                        <img
                          src={imagePreview}
                          alt={clientData.name}
                          className="max-h-[200px] max-w-full object-contain rounded-md"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            setNewImage("");
                            setImagePreview(
                              renderImageDir(clientData?.image ?? "", "client")
                            );
                          }}
                          className="absolute -top-1 -right-1 bg-gray-700 hover:bg-gray-800 text-white rounded-full p-1.5 shadow-md transition-colors"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="14"
                            height="14"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path d="M21 4H8l-7 8 7 8h13a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2z"></path>
                            <line x1="18" y1="9" x2="12" y2="15"></line>
                            <line x1="12" y1="9" x2="18" y2="15"></line>
                          </svg>
                        </button>
                      </div>
                      <label
                        htmlFor="image"
                        className="mt-4 px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-md cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors text-sm inline-flex items-center"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4 mr-2"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                          <polyline points="17 8 12 3 7 8"></polyline>
                          <line x1="12" y1="3" x2="12" y2="15"></line>
                        </svg>
                        Changer l&apos;image
                        <input
                          id="image"
                          name="image"
                          type="file"
                          onChange={handleFileChange}
                          className="sr-only"
                          accept="image/png, image/jpg, image/jpeg"
                        />
                      </label>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center space-y-4 p-6 text-center">
                      <div className="p-4 bg-gray-100 dark:bg-gray-700 rounded-full">
                        <Edit2 className="h-8 w-8 text-primary" />
                      </div>
                      <div className="space-y-2">
                        <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          Aucune image disponible
                        </p>
                        <label
                          htmlFor="image"
                          className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-primary rounded-md cursor-pointer hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-colors"
                        >
                          Ajouter une image
                          <input
                            id="image"
                            name="image"
                            type="file"
                            onChange={handleFileChange}
                            className="sr-only"
                            accept="image/png, image/jpg, image/jpeg"
                          />
                        </label>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="flex justify-end mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
              <Link to="/clients">
                <Button type="button" variant="outline" className="mr-4">
                  Annuler
                </Button>
              </Link>
              <Button
                type="submit"
                disabled={isProgress}
                className="bg-primary hover:bg-primary/90 min-w-[150px]"
              >
                {isProgress ? (
                  <div className="flex items-center">
                    <Loader className="mr-2 h-4 w-4 animate-spin" />
                    Mise à jour...
                  </div>
                ) : (
                  "Mettre à jour"
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
