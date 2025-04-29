import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import dayjs from "dayjs";
import {
  ArrowLeft,
  Download,
  Edit,
  Receipt,
  Phone,
  AlertTriangle,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import axiosClient from "@/api/axiosClient.jsx";
import { renderImageDir } from "@/helpers/utils";
import Spinner from "@/components/Spinner";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";

function OrderDetails() {
  const { csrf } = useAuth();
  const [order, setOrder] = useState({});
  const [products, setProducts] = useState([]);
  const [deletedProducts, setDeletedProducts] = useState([]);
  const { id } = useParams();
  const [isProgress, setIsProgress] = useState(false);

  const getOrder = async () => {
    try {
      setIsProgress(true);
      await csrf();
      const response = await axiosClient.get(`/api/orders/details/${id}`);
      setOrder(response.data.order);
      setProducts(response.data.products);
      setDeletedProducts(response.data.deleted_products || []);
    } catch (err) {
      console.log("err", err);
    } finally {
      setIsProgress(false);
    }
  };

  const [isLoading, setIsLoading] = useState(false);
  const handleDownload = async () => {
    try {
      setIsLoading(true);
      await csrf();

      const { data: filePath } = await axiosClient.post(
        `/api/download-invoice/${id}`
      );

      const alink = document.createElement("a");
      alink.href = filePath ?? "";
      alink.setAttribute("target", "_blank");
      document.body.appendChild(alink);
      alink.click();

      setIsLoading(false);
    } catch (err) {
      console.log("err", err);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getOrder();
  }, [id]);

  if (isProgress) {
    return (
      <div className="flex justify-center items-center min-h-[80vh]">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="mx-auto px-2 py-4 md:px-4 md:py-6">
      <Card className="shadow-md border border-gray-200 dark:border-gray-700">
        <CardHeader className="pb-3 border-b dark:border-gray-700">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <Link
                to="/orders"
                className="mr-3 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                <ArrowLeft className="h-5 w-5" />
              </Link>
              <div>
                <CardTitle className="flex items-center text-xl md:text-2xl font-bold">
                  <Receipt className="h-6 w-6 mr-2 text-primary" />
                  Commande #{order.id}
                </CardTitle>
                <CardDescription className="mt-1 text-gray-500 dark:text-gray-400">
                  {dayjs(order.created_at).format("DD MMMM YYYY à HH:mm")}
                </CardDescription>
              </div>
            </div>
            <div className="flex space-x-2">
              <Button
                onClick={handleDownload}
                disabled={isLoading}
                className="bg-emerald-600 hover:bg-emerald-700 text-white"
              >
                <Download className="h-4 w-4 mr-2" />
                {isLoading ? "Chargement..." : "Télécharger facture"}
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-4 pt-6">
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Products section (2 columns) */}
            <div className="lg:col-span-2 space-y-4">
              <h3 className="text-lg font-medium mb-2">Produits</h3>

              <div className="space-y-3">
                {order?.cart &&
                  JSON.parse(order.cart).productsCart.map((p) => {
                    // Check if the product exists in active products
                    const product = products.find(
                      (product) => product.id === p.product_id
                    );

                    // If it's found in active products, render it
                    if (product) {
                      return (
                        <div
                          key={p.product_id}
                          className="flex items-center p-4 rounded-lg bg-gray-50 dark:bg-gray-800"
                        >
                          <div className="flex-shrink-0 w-16 h-16 mr-4">
                            <img
                              className="w-full h-full object-cover rounded"
                              src={renderImageDir(product.image)}
                              alt={product.name}
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                              {product.name}
                              <span className="text-xs text-gray-500 ml-1">
                                ({product.reference})
                              </span>
                            </h4>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              {p.quantity} x {p.price} dh
                            </p>
                          </div>
                          <div className="text-right">
                            <span className="inline-block font-medium text-green-600">
                              {(p.price * p.quantity).toFixed(2)} dh
                            </span>
                          </div>
                        </div>
                      );
                    }

                    // Check if it's a deleted product
                    const deletedProduct = deletedProducts.find(
                      (delProduct) => delProduct.id === p.product_id
                    );

                    if (deletedProduct) {
                      return (
                        <div
                          key={`deleted-${p.product_id}`}
                          className="flex items-center p-4 rounded-lg bg-gray-50 dark:bg-gray-800 border border-amber-300"
                        >
                          <div className="flex-shrink-0 w-16 h-16 mr-4 flex items-center justify-center bg-gray-200 rounded">
                            <AlertTriangle className="h-8 w-8 text-amber-500" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="text-sm font-medium text-gray-900 dark:text-white flex items-center">
                              {deletedProduct.name}
                              <span className="text-xs text-gray-500 ml-1">
                                ({deletedProduct.reference})
                              </span>
                              <Badge
                                className="ml-2 bg-amber-500"
                                variant="secondary"
                              >
                                Produit supprimé
                              </Badge>
                            </h4>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              {p.quantity} x {p.price} dh
                            </p>
                          </div>
                          <div className="text-right">
                            <span className="inline-block font-medium text-green-600">
                              {(p.price * p.quantity).toFixed(2)} dh
                            </span>
                          </div>
                        </div>
                      );
                    }

                    // If neither found in active or deleted products
                    return null;
                  })}
              </div>

              {/* Order summary */}
              <div className="mt-6 p-4 rounded-lg bg-gray-50 dark:bg-gray-800">
                <h3 className="text-lg font-medium mb-4">Récapitulatif</h3>

                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 dark:text-gray-400">
                      Prix payé
                    </span>
                    <span>{order.paid_price} dh</span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 dark:text-gray-400">
                      Prix restant
                    </span>
                    <span
                      className={
                        order.remain_price === "0.00"
                          ? "text-green-600"
                          : "text-red-600"
                      }
                    >
                      {order.remain_price} dh
                    </span>
                  </div>

                  <Separator className="my-2" />

                  <div className="flex justify-between items-center font-medium">
                    <span>Total</span>
                    <span className="text-lg text-green-600">
                      {order.total_price} dh
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Client and payment info section */}
            <div className="space-y-6">
              {/* Client info card */}
              <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-800">
                <h3 className="text-lg font-medium mb-4">Client</h3>

                <div className="flex items-center mb-4">
                  <div className="flex-shrink-0 mr-3">
                    <img
                      src={renderImageDir(order?.client?.image)}
                      alt={order?.client?.name}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                  </div>
                  <div>
                    <h4 className="font-medium">
                      {order?.client?.name} {order?.client?.lname}
                    </h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {order?.client?.city} {order?.client?.address}
                    </p>
                  </div>
                </div>

                <div className="flex items-center text-gray-600">
                  <Phone className="h-4 w-4 mr-2" />
                  <span>{order?.client?.phone}</span>
                </div>
              </div>

              {/* Payment info card */}
              <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-800">
                <h3 className="text-lg font-medium mb-4">
                  Détails du paiement
                </h3>

                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-1">
                    <span className="text-gray-600 dark:text-gray-400">
                      Méthode:
                    </span>
                    <span className="font-medium capitalize">
                      {order?.payment_method}
                    </span>
                  </div>

                  {order?.payment_method === "traita" &&
                    order?.client_traita && (
                      <div className="grid grid-cols-2 gap-1">
                        <span className="text-gray-600 dark:text-gray-400">
                          Nom du client:
                        </span>
                        <span className="font-medium">
                          {order?.client_traita}
                        </span>
                      </div>
                    )}

                  {order?.reference_credit && (
                    <div className="grid grid-cols-2 gap-1">
                      <span className="text-gray-600 dark:text-gray-400">
                        Référence:
                      </span>
                      <span>{order?.reference_credit}</span>
                    </div>
                  )}

                  {order?.is_credit === 1 && (
                    <div className="grid grid-cols-2 gap-1">
                      <span className="text-gray-600 dark:text-gray-400">
                        Date fin:
                      </span>
                      <span>{order?.date_fin_credit}</span>
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-1">
                    <span className="text-gray-600 dark:text-gray-400">
                      Crédit:
                    </span>
                    <Badge
                      variant={
                        order.is_credit === 1 ? "destructive" : "success"
                      }
                    >
                      {order.is_credit === 1 ? "Oui" : "Non"}
                    </Badge>
                  </div>
                </div>
              </div>

              {/* Action button */}
              <div className="text-center mt-4">
                <Button variant="outline" className="w-full" asChild>
                  <Link to={`/orders/edit/${order.id}`}>
                    <Edit className="mr-2 h-4 w-4" />
                    Modifier la commande
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Floating action button for invoice download on mobile */}
      <div className="md:hidden fixed bottom-4 right-4 z-50">
        <Button
          onClick={handleDownload}
          disabled={isLoading}
          className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-full shadow-lg h-14 w-14 p-0"
        >
          <Download className="h-6 w-6" />
        </Button>
      </div>
    </div>
  );
}

export default OrderDetails;
