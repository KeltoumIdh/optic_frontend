import { BarChart } from '@mui/x-charts/BarChart';
import React, { useState, useEffect } from 'react';
import { Card } from "@/components/ui/card";
import { useAuth } from '@/hooks/useAuth';
import axiosClient from '@/api/axiosClient';


export default function ChartCard() {
    const [products, setProducts] = useState([]);
    
    const { csrf } = useAuth();

    useEffect(() => {
        const fetchTopSellingProducts = async () => {
            try {
                await csrf();
                const response = await axiosClient.get('/api/top/product');
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
