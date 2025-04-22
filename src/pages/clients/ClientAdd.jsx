import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import {
    Form,
    FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "../../components/ui/form";
import { Input } from "../../components/ui/input.jsx";
import { Button } from "../../components/ui/button.jsx";
import { ArrowLeft, Loader, User, ImagePlus } from "lucide-react";
import { useToast } from "../../components/ui/use-toast.js";
import { useAuth } from "@/hooks/useAuth";
import axiosClient from "@/api/axiosClient.jsx";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";

export default function ClientAdd() {
    const { toast } = useToast();
    const navigate = useNavigate();
    const [isSubmitting, setIsSubmitting] = useState(false);
  const [image, setImage] = useState("");
  const [imagePreview, setImagePreview] = useState(null);

  const form = useForm({
    defaultValues: {
      name: "",
      lname: "",
      phone: "",
      city: "",
      address: "",
    },
  });

    const {
        register,
        handleSubmit,
        setError,
        reset,
        formState: { errors },
    } = form;

  const { csrf } = useAuth();

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
        setIsSubmitting(true);

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
      const response = await axiosClient.post("/api/clients/add", formData);
            if (response.status === 201) {
                toast({
          title: "Succès",
          description: "Client créé avec succès!",
          variant: "success",
                });
                reset();
                navigate("/clients");
            }
        } catch (error) {
            if (error.response) {
                const { data } = error.response;
                if (data.errors) {
          Object.entries(data.errors).forEach(([fieldName, errorMessages]) => {
                            setError(fieldName, {
                                message: errorMessages.join(),
                            });
          });
                } else {
                    toast({
            title: "Erreur",
                        description:
                            data.message ||
              "Une erreur s'est produite lors de la création du client.",
            variant: "destructive",
                    });
                }
            } else if (error.request) {
                toast({
          title: "Erreur",
          description: "Aucune réponse reçue du serveur.",
          variant: "destructive",
                });
            } else {
                toast({
          title: "Erreur",
                    description:
            "Une erreur s'est produite lors du traitement de la demande.",
          variant: "destructive",
                });
            }
        } finally {
            setIsSubmitting(false);
        }
    };

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
                    Ajouter un client
              </CardTitle>
            </div>
          </div>
          <CardDescription className="mt-2 text-gray-500 dark:text-gray-400">
            Créez un nouveau client en remplissant les informations ci-dessous
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
            <Form {...form}>
                <form
                    onSubmit={handleSubmit(onSubmit)}
              className="space-y-6"
                    encType="multipart/form-data"
                >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-5">
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Nom *
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Nom"
                        {...register("name", { required: "Le nom est requis" })}
                        className="w-full px-4 py-2.5 text-sm border border-gray-300 dark:border-gray-700 rounded-lg dark:bg-gray-800 focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                      />
                    </FormControl>
                    {errors.name && (
                      <p className="mt-1.5 text-sm text-red-600">
                        {errors.name.message}
                      </p>
                    )}
                  </FormItem>

                  <FormItem>
                    <FormLabel className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Prénom *
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Prénom"
                        {...register("lname", {
                          required: "Le prénom est requis",
                        })}
                        className="w-full px-4 py-2.5 text-sm border border-gray-300 dark:border-gray-700 rounded-lg dark:bg-gray-800 focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                      />
                    </FormControl>
                    {errors.lname && (
                      <p className="mt-1.5 text-sm text-red-600">
                        {errors.lname.message}
                      </p>
                        )}
                  </FormItem>

                  <FormItem>
                    <FormLabel className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Numéro de téléphone *
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Téléphone"
                        {...register("phone", {
                          required: "Le numéro de téléphone est requis",
                        })}
                        className="w-full px-4 py-2.5 text-sm border border-gray-300 dark:border-gray-700 rounded-lg dark:bg-gray-800 focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                      />
                    </FormControl>
                    {errors.phone && (
                      <p className="mt-1.5 text-sm text-red-600">
                        {errors.phone.message}
                      </p>
                        )}
                  </FormItem>

                  <FormItem>
                    <FormLabel className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Ville
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Ville"
                        {...register("city")}
                        className="w-full px-4 py-2.5 text-sm border border-gray-300 dark:border-gray-700 rounded-lg dark:bg-gray-800 focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                      />
                    </FormControl>
                    {errors.city && (
                      <p className="mt-1.5 text-sm text-red-600">
                        {errors.city.message}
                      </p>
                        )}
                  </FormItem>

                  <FormItem>
                    <FormLabel className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Adresse
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Adresse"
                        {...register("address")}
                        className="w-full px-4 py-2.5 text-sm border border-gray-300 dark:border-gray-700 rounded-lg dark:bg-gray-800 focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                      />
                    </FormControl>
                    {errors.address && (
                      <p className="mt-1.5 text-sm text-red-600">
                        {errors.address.message}
                      </p>
                        )}
                  </FormItem>
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
                <Link to="/clients">
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
                    "Créer le client"
                        )}
                    </Button>
              </div>
                </form>
            </Form>
        </CardContent>
      </Card>
    </div>
    );
}
