import { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import dayjs from "dayjs";
import { useAuth } from "@/hooks/useAuth";
import axiosClient from "@/api/axiosClient";
import Loader from "@/components/loader";
import { renderImageDir } from "@/helpers/utils";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import {
  ArrowLeft,
  Package,
  Edit,
  Trash,
  Calendar,
  Tag,
  CircleDollarSign,
  ShoppingCart,
  Info,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";

// Simple custom Badge component
const Badge = ({ children, variant = "default", className = "" }) => {
  const getVariantClass = () => {
    switch (variant) {
      case "success":
        return "bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100";
      case "warning":
        return "bg-amber-100 text-amber-800 dark:bg-amber-800 dark:text-amber-100";
      case "destructive":
        return "bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100";
      case "outline":
        return "bg-transparent border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300";
      default:
        return "bg-primary text-white";
    }
  };

  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${getVariantClass()} ${className}`}
    >
      {children}
    </span>
  );
};

// Add PropTypes validation
Badge.propTypes = {
  children: PropTypes.node.isRequired,
  variant: PropTypes.oneOf([
    "default",
    "success",
    "warning",
    "destructive",
    "outline",
  ]),
  className: PropTypes.string,
};

function ProductDetails() {
  const { csrf } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [product, setProduct] = useState();
  const [orders, setOrders] = useState([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const { id } = useParams();

  // Function to determine product status
  const getProductStatus = (quantityAvailable, initialQuantity) => {
    // If no quantities are provided, return default status
    if (quantityAvailable === undefined || initialQuantity === undefined) {
      return { text: "Indéterminé", variant: "outline" };
    }

    // Convert to numbers to ensure proper comparison
    const qtyAvailable = parseInt(quantityAvailable);
    const initialQty = parseInt(initialQuantity);

    // Calculate threshold for low stock (10% of initial quantity)
    const lowStockThreshold = Math.max(1, Math.floor(initialQty * 0.1));

    if (qtyAvailable <= 0) {
      return { text: "Rupture de stock", variant: "destructive" };
    } else if (qtyAvailable <= lowStockThreshold) {
      return { text: "Stock faible", variant: "warning" };
    } else {
      return { text: "Disponible", variant: "success" };
    }
  };

  const getProduct = async () => {
    try {
      setLoading(true);
      await csrf();
      const response = await axiosClient.get(`/api/products/details/${id}`);
      setProduct(response.data.product);
      setOrders(response.data.orders || []);
    } catch (err) {
      console.log("err", err);
      toast({
        title: "Erreur",
        description: "Impossible de récupérer les détails du produit",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProduct = async () => {
    try {
      setDeleteLoading(true);
      await csrf();
      const response = await axiosClient.delete(`/api/products/delete/${id}`);
      if (response.status === 201) {
        toast({
          title: "Succès",
          description: "Produit supprimé avec succès",
          variant: "success",
        });
        navigate("/products");
      }
    } catch (err) {
      console.log("err", err);
      toast({
        title: "Erreur",
        description: "Impossible de supprimer le produit",
        variant: "destructive",
      });
    } finally {
      setDeleteLoading(false);
      setShowDeleteModal(false);
    }
  };

  useEffect(() => {
    getProduct();
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader />
      </div>
    );
  }

  // Get product status
  const productStatus = getProductStatus(
    product?.quantity_available,
    product?.initial_quantity
  );

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
              <div>
                <div className="flex items-center">
                  <Package className="h-6 w-6 mr-2 text-primary" />
                  <CardTitle className="text-xl md:text-2xl font-bold">
                    {product?.name}
                  </CardTitle>
                </div>
                <CardDescription className="mt-1 text-gray-500 dark:text-gray-400 flex items-center">
                  <Tag className="h-4 w-4 mr-1" />
                  Référence: {product?.reference}
                </CardDescription>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Link to={`/products/edit/${product?.id}`}>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-1"
                >
                  <Edit className="h-4 w-4" />
                  <span className="hidden sm:inline">Modifier</span>
                </Button>
              </Link>
              <Button
                variant="destructive"
                size="sm"
                className="flex items-center gap-1"
                onClick={() => setShowDeleteModal(true)}
              >
                <Trash className="h-4 w-4" />
                <span className="hidden sm:inline">Supprimer</span>
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-1 flex flex-col">
              <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4 flex items-center justify-center h-[300px] border border-gray-200 dark:border-gray-700">
                {product?.image ? (
                  <img
                    src={renderImageDir(product.image)}
                    alt={product?.name}
                    className="max-h-full max-w-full object-contain rounded-md"
                  />
                ) : (
                  <div className="flex flex-col items-center text-center p-4">
                    <div className="p-4 bg-gray-100 dark:bg-gray-700 rounded-full mb-3">
                      <Package className="h-10 w-10 text-gray-400" />
                    </div>
                    <p className="text-gray-500 dark:text-gray-400">
                      Aucune image disponible
                    </p>
                  </div>
                )}
              </div>

              <div className="mt-6 bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                <h3 className="font-medium text-gray-900 dark:text-gray-100 mb-3 flex items-center">
                  <Calendar className="h-4 w-4 mr-2" />
                  Information
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between items-center py-1 border-b border-gray-200 dark:border-gray-700">
                    <span className="text-gray-600 dark:text-gray-400">
                      Date de création
                    </span>
                    <span className="font-medium">
                      {dayjs(product?.created_at).format("DD/MM/YYYY")}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-1 border-b border-gray-200 dark:border-gray-700">
                    <span className="text-gray-600 dark:text-gray-400">
                      Dernière mise à jour
                    </span>
                    <span className="font-medium">
                      {dayjs(product?.updated_at).format("DD/MM/YYYY")}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="md:col-span-2">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4 border border-green-100 dark:border-green-800">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-sm text-green-600 dark:text-green-400">
                        Prix
                      </p>
                      <h3 className="text-2xl font-bold text-green-700 dark:text-green-300 mt-1">
                        {product?.price} DH
                      </h3>
                    </div>
                    <div className="p-2 bg-green-100 dark:bg-green-800 rounded-full">
                      <CircleDollarSign className="h-5 w-5 text-green-600 dark:text-green-400" />
                    </div>
                  </div>
                </div>

                <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 border border-blue-100 dark:border-blue-800">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-sm text-blue-600 dark:text-blue-400">
                        Stock initial
                      </p>
                      <h3 className="text-2xl font-bold text-blue-700 dark:text-blue-300 mt-1">
                        {product?.initial_quantity}
                      </h3>
                    </div>
                    <div className="p-2 bg-blue-100 dark:bg-blue-800 rounded-full">
                      <Package className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                    </div>
                  </div>
                </div>

                <div className="bg-amber-50 dark:bg-amber-900/20 rounded-lg p-4 border border-amber-100 dark:border-amber-800">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-sm text-amber-600 dark:text-amber-400">
                        Stock disponible
                      </p>
                      <h3 className="text-2xl font-bold text-amber-700 dark:text-amber-300 mt-1">
                        {product?.quantity_available}
                      </h3>
                    </div>
                    <div className="p-2 bg-amber-100 dark:bg-amber-800 rounded-full">
                      <Package className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-4 border border-purple-100 dark:border-purple-800">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-sm text-purple-600 dark:text-purple-400">
                        Quantité vendue
                      </p>
                      <h3 className="text-2xl font-bold text-purple-700 dark:text-purple-300 mt-1">
                        {product?.quantity_sold}
                      </h3>
                    </div>
                    <div className="p-2 bg-purple-100 dark:bg-purple-800 rounded-full">
                      <ShoppingCart className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Status
                      </p>
                      <div className="mt-2">
                        <Badge variant={productStatus.variant}>
                          {productStatus.text}
                        </Badge>
                      </div>
                    </div>
                    <div className="p-2 bg-gray-100 dark:bg-gray-700 rounded-full">
                      <Info className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                    </div>
                  </div>
                </div>
              </div>

              {product?.message && (
                <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4 mb-6 border border-gray-200 dark:border-gray-700">
                  <h3 className="font-medium text-gray-900 dark:text-gray-100 mb-2">
                    Note
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    {product.message}
                  </p>
                </div>
              )}

              {orders && orders.length > 0 && (
                <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                  <h3 className="font-medium text-gray-900 dark:text-gray-100 mb-3">
                    Dernières commandes
                  </h3>
                  <div className="space-y-2">
                    {orders.slice(0, 3).map((order) => (
                      <div
                        key={order.id}
                        className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-700 last:border-0"
                      >
                        <div>
                          <p className="font-medium">Commande #{order.id}</p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {dayjs(order.created_at).format("DD/MM/YYYY")}
                          </p>
                        </div>
                        <Badge variant="outline" className="text-xs">
                          {order.quantity} unité(s)
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </CardContent>

        <CardFooter className="flex justify-end border-t dark:border-gray-700 pt-4">
          <Link to="/products">
            <Button variant="outline" className="mr-2">
              Retour à la liste
            </Button>
          </Link>
          <Link to={`/products/edit/${product?.id}`}>
            <Button className="bg-primary hover:bg-primary/90">
              Modifier le produit
            </Button>
          </Link>
        </CardFooter>
      </Card>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white dark:bg-gray-800 rounded-lg max-w-md w-full p-6 shadow-lg">
            <h2 className="text-lg font-semibold">Êtes-vous sûr ?</h2>
            <p className="text-sm text-gray-500 mt-2 mb-4">
              Cette action ne peut pas être annulée. Ce produit sera
              définitivement supprimé.
            </p>
            <div className="flex justify-end space-x-2 mt-6">
              <Button
                variant="outline"
                onClick={() => setShowDeleteModal(false)}
                className="mr-2"
              >
                Annuler
              </Button>
              <Button
                variant="destructive"
                onClick={handleDeleteProduct}
                disabled={deleteLoading}
              >
                {deleteLoading ? "Suppression..." : "Supprimer"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ProductDetails;
