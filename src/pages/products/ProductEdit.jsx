import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Button } from "../../components/ui/button.jsx";
import { ArrowLeft, Edit2, Loader, Package, AlertCircle } from "lucide-react";
import { useToast } from "../../components/ui/use-toast.js";
import { useAuth } from "@/hooks/useAuth";
import axiosClient from "@/api/axiosClient";
import Spinner from "@/components/Spinner.jsx";
import { renderImageDir } from "@/helpers/utils.jsx";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function ProductEdit() {
  const { csrf } = useAuth();
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

  const [image, setImage] = useState("");
  const [imagePreview, setImagePreview] = useState("");
  const [loading, setLoading] = useState(false);
  const [isProgress, setInProgress] = useState(false);
  const [errors, setErrors] = useState({});

  const fetchProduct = async () => {
    try {
      setLoading(true);
      await csrf();
      const response = await axiosClient.post(`/api/products/edit/${id}`);
      if (response.status === 200) {
        setproduct(response.data);
        setImagePreview(renderImageDir(response?.data?.image ?? ""));
      } else {
        throw new Error("Failed to fetch Product data");
      }
    } catch (error) {
      console.error("Error fetching Product data:", error);
      toast({
        title: "Erreur",
        description: "Impossible de récupérer les informations du produit",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProduct();
  }, []);

  // Change Product Image
  const handleFileChange = (e) => {
    const file = e.target.files[0];

    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result); // Base64 string
        setImagePreview(reader.result); // Base64 string
      };
      reader.readAsDataURL(file);
    } else {
      setImage("");
      setImagePreview(renderImageDir(product?.image ?? ""));
    }
  };

  /**
   * Form Submit
   * re-arrange data and send request to the backend
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    // Reset errors
    setErrors({});

    // Basic validation
    const newErrors = {};
    if (!product.name) newErrors.name = "Le nom est requis";
    if (!product.reference) newErrors.reference = "La référence est requise";
    if (!product.price) newErrors.price = "Le prix est requis";
    if (product.price && parseFloat(product.price) < 0)
      newErrors.price = "Le prix doit être positif";
    if (!product.quantity_available)
      newErrors.quantity_available = "La quantité est requise";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      setInProgress(true);

      const formData = new FormData();
      formData.append("name", product.name);
      formData.append("reference", product.reference);
      formData.append("message", product.message);
      formData.append("price", product.price);
      formData.append("quantity_available", product.quantity_available);
      formData.append("quantity_sold", product.quantity_sold);
      formData.append("image", image);

      await csrf();
      const response = await axiosClient.post(
        `/api/products/update/${id}`,
        formData
      );

      if (response.status === 200) {
        toast({
          title: "Succès",
          description: "Produit mis à jour avec succès!",
          variant: "success",
        });
        navigate("/products");
      }
    } catch (error) {
      console.error("Error updating product:", error);
      if (error.response?.data?.errors) {
        const serverErrors = {};
        Object.entries(error.response.data.errors).forEach(([key, value]) => {
          serverErrors[key] = Array.isArray(value) ? value[0] : value;
        });
        setErrors(serverErrors);
      } else {
        toast({
          title: "Erreur",
          description:
            "Une erreur s'est produite lors de la mise à jour du produit",
          variant: "destructive",
        });
      }
    } finally {
      setInProgress(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setproduct((prevData) => ({
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

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Spinner />
      </div>
    );
  }

  return (
    <div className=" mx-auto px-2 py-4 md:px-4 md:py-6">
      <Card className="shadow-md border border-gray-200 dark:border-gray-700">
        <CardHeader className="pb-4 border-b dark:border-gray-700">
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
                Modifier le produit
              </CardTitle>
            </div>
          </div>
          <CardDescription className="mt-2 text-gray-500 dark:text-gray-400">
            Référence: <span className="font-medium">{product.reference}</span>
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

          <form
            onSubmit={handleSubmit}
            className="space-y-6"
            encType="multipart/form-data"
          >
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
                    value={product.name}
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
                    htmlFor="reference"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5"
                  >
                    Référence *
                  </label>
                  <input
                    id="reference"
                    placeholder="Référence du produit"
                    value={product.reference}
                    onChange={handleChange}
                    name="reference"
                    required
                    className={`w-full px-4 py-2.5 text-sm border ${
                      errors.reference
                        ? "border-red-500 focus:ring-red-500"
                        : "border-gray-300 dark:border-gray-700 focus:ring-primary"
                    } rounded-lg dark:bg-gray-800 focus:border-transparent transition-all`}
                  />
                  {errors.reference && (
                    <p className="mt-1.5 text-sm text-red-600">
                      {errors.reference}
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
                        value={product.price}
                        onChange={handleChange}
                        name="price"
                        required
                        className={`w-full pl-4 pr-12 py-2.5 text-sm border ${
                          errors.price
                            ? "border-red-500 focus:ring-red-500"
                            : "border-gray-300 dark:border-gray-700 focus:ring-primary"
                        } rounded-lg dark:bg-gray-800 focus:border-transparent transition-all`}
                      />
                      <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                        <span className="text-gray-500 dark:text-gray-400">
                          DH
                        </span>
                      </div>
                    </div>
                    {errors.price && (
                      <p className="mt-1.5 text-sm text-red-600">
                        {errors.price}
                      </p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="quantity_available"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5"
                    >
                      Quantité disponible *
                    </label>
                    <input
                      id="quantity_available"
                      type="number"
                      placeholder="Quantité disponible"
                      value={product.quantity_available}
                      onChange={handleChange}
                      name="quantity_available"
                      required
                      className={`w-full px-4 py-2.5 text-sm border ${
                        errors.quantity_available
                          ? "border-red-500 focus:ring-red-500"
                          : "border-gray-300 dark:border-gray-700 focus:ring-primary"
                      } rounded-lg dark:bg-gray-800 focus:border-transparent transition-all`}
                    />
                    {errors.quantity_available && (
                      <p className="mt-1.5 text-sm text-red-600">
                        {errors.quantity_available}
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="quantity_sold"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5"
                  >
                    Quantité vendue
                  </label>
                  <input
                    id="quantity_sold"
                    type="number"
                    placeholder="Quantité vendue"
                    value={product.quantity_sold}
                    onChange={handleChange}
                    name="quantity_sold"
                    className="w-full px-4 py-2.5 text-sm border border-gray-300 dark:border-gray-700 rounded-lg dark:bg-gray-800 focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                    readOnly
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    Ce champ est calculé automatiquement et ne peut pas être
                    modifié
                  </p>
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
                    value={product.message || ""}
                    onChange={handleChange}
                    name="message"
                    className="w-full px-4 py-2.5 text-sm border border-gray-300 dark:border-gray-700 rounded-lg dark:bg-gray-800 focus:ring-2 focus:ring-primary focus:border-transparent transition-all resize-none"
                  />
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
                          alt={product.name}
                          className="max-h-[200px] max-w-full object-contain rounded-md"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            setImage("");
                            setImagePreview(
                              renderImageDir(product?.image ?? "")
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
                        htmlFor="__img"
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
                          id="__img"
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
                          htmlFor="__img"
                          className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-primary rounded-md cursor-pointer hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-colors"
                        >
                          Ajouter une image
                          <input
                            id="__img"
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
                {errors.image && (
                  <p className="mt-1.5 text-sm text-red-600">{errors.image}</p>
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
