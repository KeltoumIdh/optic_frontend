import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { Button } from "../../components/ui/button.jsx";
import { ArrowLeft, ImagePlus, Loader, Package, Info } from "lucide-react";
import { useToast } from "../../components/ui/use-toast.js";
import { useAuth } from "@/hooks/useAuth.jsx";
import axiosClient from "@/api/axiosClient.jsx";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

export default function ProductAdd() {
  const { toast } = useToast();
  const [image, setImage] = useState("");
  const [imagePreview, setImagePreview] = useState(null);
  const navigate = useNavigate();
  const { csrf } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
    reset,
  } = useForm();

  const handleFileChange = (e) => {
    const file = e.target.files[0];

    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result); // Base64 string
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      setImage("");
      setImagePreview(null);
    }
  };

  const onSubmit = async (values) => {
    const formData = new FormData();
    formData.append("name", values.name);
    formData.append("reference", values.reference);
    formData.append("message", values.message || "");
    formData.append("quantity", values.quantity);
    formData.append("price", values.price);
    formData.append("image", image);

    try {
      await csrf();
      const { status } = await axiosClient.post("/api/products/add", formData);

      if (status === 201) {
        toast({
          title: "Succès",
          description: "Produit créé avec succès!",
          variant: "success",
        });
        reset();
        navigate("/products");
      }
    } catch ({ response }) {
      if (response?.data?.errors) {
        Object.entries(response.data.errors).forEach((error) => {
          const [fieldName, errorMessages] = error;
          setError(fieldName, {
            message: errorMessages.join(),
          });
        });
      } else {
        toast({
          title: "Erreur",
          description:
            "Une erreur s'est produite lors de la création du produit",
          variant: "destructive",
        });
      }
    }
  };

  return (
    <div className=" mx-auto px-2 py-4 md:px-4 md:py-6">
      <Card className="shadow-md border border-gray-200 dark:border-gray-700">
        <CardHeader className="pb-4 border-b dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Link
                to="/products"
                className="mr-3 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                <ArrowLeft className="h-5 w-5" />
              </Link>
              <div className="flex items-center">
                <Package className="h-6 w-6 mr-2 text-primary" />
                <CardTitle className="text-xl md:text-2xl font-bold">
                  Ajouter un produit
                </CardTitle>
              </div>
            </div>
            <div className="flex items-center">
              <div className="p-2 bg-gray-100 dark:bg-gray-700 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
                <Info className="h-5 w-5 text-gray-500 dark:text-gray-400" />
              </div>
            </div>
          </div>
          <CardDescription className="mt-2 text-gray-500 dark:text-gray-400">
            Créez un nouveau produit en remplissant les informations ci-dessous
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-5">
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5"
                  >
                    Nom du produit *
                  </label>
                  <input
                    id="name"
                    placeholder="Nom du produit"
                    {...register("name", { required: "Le nom est requis" })}
                    className="w-full px-4 py-2.5 text-sm border border-gray-300 dark:border-gray-700 rounded-lg dark:bg-gray-800 focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                  />
                  {errors.name && (
                    <p className="mt-1.5 text-sm text-red-600">
                      {errors.name.message}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="reference"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5"
                  >
                    Référence *
                  </label>
                  <input
                    id="reference"
                    placeholder="Référence du produit"
                    {...register("reference", {
                      required: "La référence est requise",
                    })}
                    className="w-full px-4 py-2.5 text-sm border border-gray-300 dark:border-gray-700 rounded-lg dark:bg-gray-800 focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                  />
                  {errors.reference && (
                    <p className="mt-1.5 text-sm text-red-600">
                      {errors.reference.message}
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="price"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5"
                    >
                      Prix *
                    </label>
                    <div className="relative">
                      <input
                        id="price"
                        type="number"
                        placeholder="Prix"
                        {...register("price", {
                          required: "Le prix est requis",
                          min: {
                            value: 0,
                            message: "Le prix doit être positif",
                          },
                        })}
                        className="w-full pl-4 pr-12 py-2.5 text-sm border border-gray-300 dark:border-gray-700 rounded-lg dark:bg-gray-800 focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                      />
                      <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                        <span className="text-gray-500 dark:text-gray-400">
                          DH
                        </span>
                      </div>
                    </div>
                    {errors.price && (
                      <p className="mt-1.5 text-sm text-red-600">
                        {errors.price.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="quantity"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5"
                    >
                      Quantité *
                    </label>
                    <input
                      id="quantity"
                      type="number"
                      placeholder="Quantité"
                      {...register("quantity", {
                        required: "La quantité est requise",
                        min: {
                          value: 0,
                          message: "La quantité doit être positive",
                        },
                      })}
                      className="w-full px-4 py-2.5 text-sm border border-gray-300 dark:border-gray-700 rounded-lg dark:bg-gray-800 focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                    />
                    {errors.quantity && (
                      <p className="mt-1.5 text-sm text-red-600">
                        {errors.quantity.message}
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="message"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5"
                  >
                    Note (optionnel)
                  </label>
                  <textarea
                    id="message"
                    placeholder="Note supplémentaire..."
                    rows="4"
                    {...register("message")}
                    className="w-full px-4 py-2.5 text-sm border border-gray-300 dark:border-gray-700 rounded-lg dark:bg-gray-800 focus:ring-2 focus:ring-primary focus:border-transparent transition-all resize-none"
                  />
                  {errors.message && (
                    <p className="mt-1.5 text-sm text-red-600">
                      {errors.message.message}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Image du produit
                </label>
                <div className="mt-1 border-2 border-gray-300 dark:border-gray-700 border-dashed rounded-lg h-[300px] flex items-center justify-center overflow-hidden bg-gray-50 dark:bg-gray-800/50">
                  {imagePreview ? (
                    <div className="flex flex-col items-center p-4 w-full h-full">
                      <div className="relative w-full h-full flex items-center justify-center">
                        <img
                          src={imagePreview}
                          alt="Preview"
                          className="max-h-[200px] max-w-full object-contain rounded-md"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            setImage("");
                            setImagePreview(null);
                          }}
                          className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-1 shadow-md hover:bg-red-600 transition-colors"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path d="M18 6L6 18"></path>
                            <path d="M6 6l12 12"></path>
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
                          type="file"
                          {...register("image")}
                          onChange={handleFileChange}
                          className="sr-only"
                          accept="image/png, image/jpg, image/jpeg"
                        />
                      </label>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center space-y-4 p-6 text-center">
                      <div className="p-4 bg-gray-100 dark:bg-gray-700 rounded-full">
                        <ImagePlus className="h-8 w-8 text-primary" />
                      </div>
                      <div className="space-y-2">
                        <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          Déposez votre image ici, ou
                        </p>
                        <label
                          htmlFor="image"
                          className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-primary rounded-md cursor-pointer hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-colors"
                        >
                          Parcourir
                          <input
                            id="image"
                            type="file"
                            {...register("image")}
                            onChange={handleFileChange}
                            className="sr-only"
                            accept="image/png, image/jpg, image/jpeg"
                          />
                        </label>
                      </div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        PNG, JPG, JPEG jusqu&apos;à 5MB
                      </p>
                    </div>
                  )}
                </div>
                {errors.image && (
                  <p className="mt-1.5 text-sm text-red-600">
                    {errors.image.message}
                  </p>
                )}
              </div>
            </div>

            <div className="flex justify-end mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
              <Link to="/products">
                <Button type="button" variant="outline" className="mr-4">
                  Annuler
                </Button>
              </Link>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="bg-primary hover:bg-primary/90 min-w-[150px]"
              >
                {isSubmitting ? (
                  <div className="flex items-center">
                    <Loader className="mr-2 h-4 w-4 animate-spin" />
                    Création...
                  </div>
                ) : (
                  "Créer le produit"
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
