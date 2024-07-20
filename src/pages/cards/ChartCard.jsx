import { BarChart } from '@mui/x-charts/BarChart';
import React, { useState, useEffect } from 'react';
import { Card } from "@/components/ui/card";
import { useAuth } from '@/hooks/useAuth';
import axiosClient from '@/api/axiosClient';


export default function ChartCard() {
    const [products, setProducts] = useState([]);

    const { csrf } = useAuth();

    const [isLoading, setisLoading] = React.useState(false)

    useEffect(() => {
        const fetchTopSellingProducts = async () => {
            try {
                setisLoading(true) 
                await csrf();
                const response = await axiosClient.get('/api/top/product');
                setProducts(response?.data || []);
            } catch (error) {
                console.error('Erreur lors de la récupération des produits les plus vendus :', error);
            } finally {
                setisLoading(false)
            }
        };

        fetchTopSellingProducts();
    }, []);

    // Extraire les noms des produits et les quantités vendues
    const productNames = products?.map(product => product.name);
    const quantitiesSold = products?.map(product => product.quantity_sold);

    return isLoading ? <div className="h-72 w-100 rounded-md border animate-pulse"></div> : (
        <Card className="h-[100%] w-[100%]">
            <h4 className="mb-4 text-lg font-medium leading-none p-4 ">Produit plus vende</h4>
            {products.length > 0 &&
            <BarChart
                series={[{ data: quantitiesSold }]}
                height={290}
                xAxis={[{ data: productNames, scaleType: 'band' }]}
                margin={{ top: 10, bottom: 30, left: 40, right: 10 }}
            />}
        </Card>
    );
}
