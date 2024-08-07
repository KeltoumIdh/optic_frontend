import React, { useEffect, useState } from 'react'
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { useAuth } from '@/hooks/useAuth'
import axiosClient from "@/api/axiosClient.jsx";


export function StockCard() {

  const { csrf } = useAuth();

  const [products, setProducts] = useState([]);

  const [isLoading, setisLoading] = React.useState(false)
  useEffect(() => {
    const fetchAvailableProducts = async () => {
      try {
        setisLoading(true)
        await csrf()
        const response = await axiosClient.get('/api/stock/product');
        setProducts(response.data);
        console.log('stock', response.data)
      } catch (error) {
        console.error('Erreur lors de la récupération des produits rupture de stock :', error);
      } finally {
        setisLoading(false)
      }
    };

    fetchAvailableProducts();
  }, []);
  const getStatusColorClass = (status) => {
    switch (status) {
      case "Stock faible":
        return "bg-yellow-100 text-yellow-800";
      case "Disponible":
        return "bg-green-100 text-green-800";
      case "Rupture de stock":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };
  return isLoading ? <div className="h-72 w-100 rounded-md border animate-pulse"></div> : (
    <ScrollArea className="h-72 w-full rounded-md border">
  <div className="md:p-4 py-4">
    <h4 className="mb-4 max-md:px-4 text-lg font-medium leading-none py-4">
      Produit en rupture de stock
    </h4>
    <div className="relative overflow-x-auto">
      <div className="overflow-y-auto h-56">
        <table className="min-w-full table-auto">
          <thead className="sticky top-0 bg-gray-100">
            <tr>
              <th className="md:px-4 px-2 py-2 text-sm font-medium">Nom du Produit</th>
              <th className="md:px-4 px-2 py-2 text-sm font-medium">Référence</th>
              <th className="md:px-4 px-2 py-2 text-sm font-medium">Quantité Disponible</th>
              <th className="md:px-4 px-2 py-2 text-sm font-medium">Statut</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id} className="bg-white border-b">
                <td className="md:px-4 px-2 py-2 text-sm">{product.name}</td>
                <td className="md:px-4 px-2 py-2 text-sm">{product.reference}</td>
                <td className="md:px-4 px-2 py-2 text-sm">{product.quantity_available}</td>
                <td className="md:px-4 px-2 py-2 text-sm">
                  <span
                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColorClass(
                      product.status
                    )}`}
                  >
                    {product.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  </div>
</ScrollArea>


  )
}

