import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useCheckoutStore } from "../../store";
import { useAuth } from "@/hooks/useAuth";
import axiosClient from "@/api/axiosClient";
import { renderImageDir } from "@/helpers/utils";
import Spinner from "@/components/Spinner";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  ArrowLeft,
  ArrowRight,
  ShoppingCart,
  Minus,
  Plus,
  Trash2,
  AlertCircle,
  CheckCircle,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Input } from "@/components/ui/input";

function OrderConfirmed() {
  const { csrf } = useAuth();
  const navigate = useNavigate();
  const { removeFromSelectedProd, setCartI } = useCheckoutStore();
  const [products, setProducts] = useState([]);
  const [quantities, setQuantities] = useState({});
  const [totalPrice, setTotalPrice] = useState(0);
  const [inProgress, setInProgress] = useState(false);

  const location = useLocation();
  const selectedProducts = location?.state?.selectedProducts;
  const clientId = location.state?.clientId;

  if (!selectedProducts || !clientId) {
    return (
      <div className="mx-auto px-2 py-4 md:px-4 md:py-6">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Erreur</AlertTitle>
          <AlertDescription>
            Informations manquantes pour créer une commande. Veuillez retourner
            à la sélection des produits.
          </AlertDescription>
          <Button
            variant="outline"
            className="mt-4"
            onClick={() => navigate("/orders/add")}
          >
            <ArrowLeft className="mr-2 h-4 w-4" /> Retour à la sélection
          </Button>
        </Alert>
      </div>
    );
  }

  const getProducts = async (selectedProducts) => {
    try {
      setInProgress(true);
      await csrf();
      const response = await axiosClient.get("/api/orders/confirmed", {
        params: {
          selectedProductIds: selectedProducts,
        },
      });
      const products = response.data.products;
      setProducts(products);

      // Initialiser les quantités pour tous les produits à 1
      const initialQuantities = products.reduce((acc, product) => {
        acc[product.id] = 1;
        return acc;
      }, {});
      setQuantities(initialQuantities);
    } catch (error) {
      console.error("Error fetching selected products:", error);
    } finally {
      setInProgress(false);
    }
  };

  const handleIncrementQuantity = (productId) => {
    const availableQuantity =
      products.find((product) => product.id === productId)
        ?.quantity_available || 0;
    setQuantities((prevQuantities) => ({
      ...prevQuantities,
      [productId]: Math.min(
        (prevQuantities[productId] || 1) + 1,
        availableQuantity
      ),
    }));
  };

  const handleDecrementQuantity = (productId) => {
    setQuantities((prevQuantities) => ({
      ...prevQuantities,
      [productId]: Math.max((prevQuantities[productId] || 0) - 1, 1),
    }));
  };

  const handleQuantityChange = (productId, value) => {
    const availableQuantity =
      products.find((product) => product.id === productId)
        ?.quantity_available || 0;

    // Convert to number and handle invalid inputs
    let quantity = parseInt(value);
    if (isNaN(quantity) || quantity < 1) {
      quantity = 1;
    } else if (availableQuantity && quantity > availableQuantity) {
      quantity = availableQuantity;
    }

    setQuantities((prevQuantities) => ({
      ...prevQuantities,
      [productId]: quantity,
    }));
  };

  const handleRemoveProduct = (productId) => {
    setProducts((prevProducts) =>
      prevProducts.filter((product) => product.id !== productId)
    );

    setQuantities((prevQuantities) => {
      const newQuantities = { ...prevQuantities };
      delete newQuantities[productId];
      return newQuantities;
    });

    removeFromSelectedProd(productId);
  };

  const proceedToCheckout = () => {
    const cartItem = {
      client_id: clientId,
      productsCart: products.map((product) => ({
        product_id: product.id,
        quantity: quantities[product.id] || 1,
        reference: product.reference || "",
        name: product.name || "",
        price: product.price || "",
      })),
      total_price: totalPrice,
    };

    setCartI(cartItem);
    navigate("/checkout", { state: { clientId } });
  };

  useEffect(() => {
    const newTotalPrice = products.reduce((acc, product) => {
      const quantity = quantities[product.id] || 1;
      return acc + quantity * product.price;
    }, 0);

    setTotalPrice(newTotalPrice);
  }, [quantities, products]);

  useEffect(() => {
    if (selectedProducts && selectedProducts.length > 0) {
      getProducts(selectedProducts);
    }
  }, [selectedProducts]);

  if (inProgress) {
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
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Link
                to={`/orders/products/add/${clientId}`}
                className="mr-3 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                <ArrowLeft className="h-5 w-5" />
              </Link>
              <div className="flex items-center">
                <ShoppingCart className="h-6 w-6 mr-2 text-primary" />
                <CardTitle className="text-xl md:text-2xl font-bold">
                  Confirmation de la commande
                </CardTitle>
              </div>
            </div>
          </div>
          <CardDescription className="mt-2 text-gray-500 dark:text-gray-400">
            Vérifiez et ajustez les quantités de produits avant de continuer
          </CardDescription>
        </CardHeader>

        <CardContent className="p-4">
          {products.length === 0 ? (
            <Alert className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Aucun produit</AlertTitle>
              <AlertDescription>
                Aucun produit n'a été sélectionné pour cette commande.
              </AlertDescription>
              <Button
                variant="outline"
                className="mt-4"
                onClick={() => navigate(`/orders/products/add/${clientId}`)}
              >
                <ArrowLeft className="mr-2 h-4 w-4" /> Retour à la sélection
              </Button>
            </Alert>
          ) : (
            <div className="rounded-md border border-gray-200 dark:border-gray-700 overflow-hidden">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader className="bg-gray-50 dark:bg-gray-800">
                    <TableRow>
                      <TableHead className="font-medium w-2/5">
                        Produit
                      </TableHead>
                      <TableHead className="font-medium whitespace-nowrap">
                        Prix
                      </TableHead>
                      <TableHead className="font-medium whitespace-nowrap">
                        Quantité
                      </TableHead>
                      <TableHead className="font-medium whitespace-nowrap">
                        Total
                      </TableHead>
                      <TableHead className="font-medium w-10"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {products.map((product) => (
                      <TableRow
                        key={product.id}
                        className="hover:bg-gray-50 dark:hover:bg-gray-800"
                      >
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <img
                              src={renderImageDir(product.image)}
                              alt={product.name}
                              className="h-16 w-16 rounded object-cover hidden sm:block"
                            />
                            <div>
                              <p className="font-medium line-clamp-2">
                                {product.name}
                              </p>
                              <p className="text-xs text-gray-500">
                                Réf: {product.reference}
                              </p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <span className="font-medium">
                            {product.price} dh
                          </span>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-7 w-7"
                              onClick={() =>
                                handleDecrementQuantity(product.id)
                              }
                            >
                              <Minus className="h-3 w-3" />
                            </Button>
                            <div className="relative">
                              <Input
                                type="number"
                                min="1"
                                max={product.quantity_available || 9999}
                                value={quantities[product.id] || 1}
                                onChange={(e) =>
                                  handleQuantityChange(
                                    product.id,
                                    e.target.value
                                  )
                                }
                                className="w-14 text-center h-7 px-1 text-xs"
                              />
                              <span className="absolute text-[10px] -top-4 left-0 text-gray-500">
                                Max: {product.quantity_available || "N/A"}
                              </span>
                            </div>
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-7 w-7"
                              onClick={() =>
                                handleIncrementQuantity(product.id)
                              }
                            >
                              <Plus className="h-3 w-3" />
                            </Button>
                          </div>
                        </TableCell>
                        <TableCell>
                          <span className="font-medium">
                            {(
                              (quantities[product.id] || 1) * product.price
                            ).toFixed(2)}{" "}
                            dh
                          </span>
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-50"
                            onClick={() => handleRemoveProduct(product.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          )}

          {products.length > 0 && (
            <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-md">
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-gray-500 dark:text-gray-400">
                    Sous-total
                  </span>
                  <span>{totalPrice.toFixed(2)} dh</span>
                </div>
                <div className="flex justify-between items-center font-bold text-lg">
                  <span>Total</span>
                  <span>{totalPrice.toFixed(2)} dh</span>
                </div>
              </div>
            </div>
          )}
        </CardContent>

        <CardFooter className="flex justify-between border-t p-4 dark:border-gray-700 sticky bottom-0 bg-white dark:bg-gray-900 z-10 shadow-md">
          <Button
            variant="outline"
            onClick={() => navigate(`/orders/products/add/${clientId}`)}
          >
            <ArrowLeft className="mr-2 h-4 w-4" /> Retour
          </Button>

          <Button
            onClick={proceedToCheckout}
            className="bg-primary hover:bg-primary/90"
            disabled={products.length === 0}
            size="lg"
          >
            Continuer <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}

export default OrderConfirmed;
