import { BarChart } from "@mui/x-charts/BarChart";
import React, { useState, useEffect } from "react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { useAuth } from "@/hooks/useAuth";
import axiosClient from "@/api/axiosClient";
import { BarChart2 } from "lucide-react";

export default function ChartCard() {
  const [products, setProducts] = useState([]);
  const { csrf } = useAuth();
  const [isLoading, setisLoading] = React.useState(false);

  useEffect(() => {
    const fetchTopSellingProducts = async () => {
      try {
        setisLoading(true);
        await csrf();
        const response = await axiosClient.get("/api/top/product");
        setProducts(response?.data || []);
      } catch (error) {
        console.error(
          "Erreur lors de la récupération des produits les plus vendus :",
          error
        );
      } finally {
        setisLoading(false);
      }
    };

    fetchTopSellingProducts();
  }, []);

  // Extract product names and quantities sold
  const productNames = products?.map((product) => product.name);
  const quantitiesSold = products?.map((product) => product.quantity_sold);

  // Define colors for the chart
  const chartColors = ["#3b82f6", "#60a5fa", "#93c5fd", "#bfdbfe", "#dbeafe"];

  return (
    <Card className="border shadow-none h-full">
      <CardHeader className="pb-2 p-3 md:p-4">
        <div className="flex items-center">
          <BarChart2 className="h-4 w-4 md:h-5 md:w-5 text-green-500 mr-2" />
          <h3 className="text-base md:text-lg font-medium">
            Produits les plus vendus
          </h3>
        </div>
      </CardHeader>
      <CardContent className="p-2 md:p-4">
        {isLoading ? (
          <div className="h-64 w-full rounded-md animate-pulse bg-gray-100"></div>
        ) : products.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-center text-gray-500 space-y-2">
            <BarChart2 className="h-8 w-8 md:h-10 md:w-10 opacity-20" />
            <p className="text-xs md:text-sm">
              Aucune donnée de vente disponible
            </p>
          </div>
        ) : (
          <div className="h-[220px] md:h-[280px]">
            <BarChart
              series={[
                {
                  data: quantitiesSold,
                  color: chartColors[0],
                  label: "Quantité vendue",
                },
              ]}
              height={220}
              xAxis={[
                {
                  data: productNames,
                  scaleType: "band",
                  tickLabelStyle: {
                    angle: 0,
                    textAnchor: "middle",
                    fontSize: 10,
                  },
                },
              ]}
              margin={{ top: 10, bottom: 30, left: 30, right: 10 }}
              slotProps={{
                bar: {
                  borderRadius: 4,
                  paddingInner: 0.4,
                },
              }}
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
}
