import { useEffect, useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { AlertTriangle } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import axiosClient from "@/api/axiosClient.jsx";
import { Card, CardHeader, CardContent } from "@/components/ui/card";

export function StockCard() {
  const { csrf } = useAuth();
  const [products, setProducts] = useState([]);
  const [isLoading, setisLoading] = useState(false);

  useEffect(() => {
    const fetchAvailableProducts = async () => {
      try {
        setisLoading(true);
        await csrf();
        const response = await axiosClient.get("/api/stock/product");
        setProducts(response.data);
      } catch (error) {
        console.error(
          "Erreur lors de la récupération des produits rupture de stock :",
          error
        );
      } finally {
        setisLoading(false);
      }
    };

    fetchAvailableProducts();
  }, []);

  const getStatusColorClass = (status) => {
    switch (status) {
      case "Stock faible":
        return "bg-amber-100 text-amber-800 border-amber-300";
      case "Disponible":
        return "bg-emerald-100 text-emerald-800 border-emerald-300";
      case "Rupture de stock":
        return "bg-rose-100 text-rose-800 border-rose-300";
      default:
        return "bg-gray-100 text-gray-800 border-gray-300";
    }
  };

  const getStatusIcon = (status) => {
    if (status === "Rupture de stock" || status === "Stock faible") {
      return <AlertTriangle className="h-4 w-4" />;
    }
    return null;
  };

  return (
    <Card className="border shadow-none h-full">
      <CardHeader className="pb-2 p-3 md:p-4">
        <div className="flex items-center">
          <AlertTriangle className="h-4 w-4 md:h-5 md:w-5 text-amber-500 mr-2" />
          <h3 className="text-base md:text-lg font-medium">
            Produit en rupture de stock
          </h3>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        {isLoading ? (
          <div className="h-64 w-full rounded-md animate-pulse bg-gray-100"></div>
        ) : (
          <ScrollArea className="h-[260px] md:h-[320px] w-full rounded-md">
            <div className="px-2 md:px-4">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="py-2 md:py-3 px-1 md:px-2 text-left text-xs md:text-sm font-medium text-gray-500">
                        Nom du Produit
                      </th>
                      <th className="py-2 md:py-3 px-1 md:px-2 text-left text-xs md:text-sm font-medium text-gray-500">
                        Référence
                      </th>
                      <th className="py-2 md:py-3 px-1 md:px-2 text-left text-xs md:text-sm font-medium text-gray-500">
                        Quantité
                      </th>
                      <th className="py-2 md:py-3 px-1 md:px-2 text-left text-xs md:text-sm font-medium text-gray-500">
                        Statut
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.length > 0 ? (
                      products.map((product) => (
                        <tr
                          key={product.id}
                          className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                        >
                          <td className="py-2 md:py-3 px-1 md:px-2 text-xs md:text-sm font-medium">
                            {product.name}
                          </td>
                          <td className="py-2 md:py-3 px-1 md:px-2 text-xs md:text-sm text-gray-600">
                            {product.reference}
                          </td>
                          <td className="py-2 md:py-3 px-1 md:px-2 text-xs md:text-sm text-gray-600">
                            {product.quantity_available}
                          </td>
                          <td className="py-2 md:py-3 px-1 md:px-2 text-xs md:text-sm">
                            <div
                              className={`inline-flex items-center px-1.5 md:px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColorClass(
                                product.status
                              )}`}
                            >
                              {getStatusIcon(product.status)}
                              {product.status === "Rupture de stock" ||
                              product.status === "Stock faible" ? (
                                <span className="ml-1">{product.status}</span>
                              ) : (
                                product.status
                              )}
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td
                          colSpan="4"
                          className="py-6 text-center text-gray-500"
                        >
                          Aucun produit en rupture de stock
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  );
}
