// import React from 'react'
// import {
//     Card,
//     CardContent,
//     CardDescription,
//     CardFooter,
//     CardHeader,
//     CardTitle,
// } from "@/components/ui/card";


// export const ChartCard = () => {
//   return (
//     <Card className="h-[100%] w-[50%]">
//     <CardHeader className="flex flex-row justify-between items-center">
//       <h2 className="text-xl"></h2>
     
//     </CardHeader>
//     <CardContent className="flex flex-row justify-between items-center">
//       <div>
//         <p className="text-lg"></p>
//         <CardDescription>
    
//         </CardDescription>
//       </div>
     
//     </CardContent>
//   </Card>
//   )
// }

// export default ChartCard

import { BarChart } from '@mui/x-charts/BarChart';
import React, { useState, useEffect } from 'react';
import { Card } from "@/components/ui/card";

import { axiosUser } from '../../api/axios';

export default function ChartCard() {
    const [products, setProducts] = useState([]);

    useEffect(() => {
        const fetchTopSellingProducts = async () => {
            try {
                const response = await axiosUser.get('/top/product');
                setProducts(response.data);
            } catch (error) {
                console.error('Erreur lors de la récupération des produits les plus vendus :', error);
            }
        };

        fetchTopSellingProducts(); 
    }, []);

    // Vérifiez si les données sont disponibles ou non
    if (!products || products.length === 0) {
        return <div>Chargement...</div>;
    }

    // Extraire les noms des produits et les quantités vendues
    const productNames = products.map(product => product.name);
    const quantitiesSold = products.map(product => product.quantity_sold);

    return (
        <Card className="h-[100%] w-[100%]">
      <h4 className="mb-4 text-lg font-medium leading-none p-4 ">Produit plus vende</h4>
            <BarChart
                series={[{ data: quantitiesSold }]}
                height={290}
                xAxis={[{ data: productNames, scaleType: 'band' }]}
                margin={{ top: 10, bottom: 30, left: 40, right: 10 }}
            />
        </Card>
    );
}
