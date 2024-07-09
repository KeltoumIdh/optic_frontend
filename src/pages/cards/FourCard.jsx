import React, { useEffect, useState } from 'react'
import { UsersRound, Mailbox, Glasses } from "lucide-react"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
} from "@/components/ui/card";
import { useAuth } from "@/hooks/useAuth"
import axiosClient from "@/api/axiosClient.jsx";
import Spinner from '@/components/Spinner';
import { Link } from "react-router-dom"


export const FourCard = () => {

    const { csrf } = useAuth();


    const [totalP, setTotalP] = useState(0);
    const [totalO, setTotalO] = useState(0);
    const [totalC, setTotalC] = useState(0);
    const [totalU, setTotalU] = useState(0);

    const [totalPLoading, setTotalPLoading] = useState(false);
    const [totalOLoading, setTotalOLoading] = useState(false);
    const [totalCLoading, setTotalCLoading] = useState(false);
    const [totalULoading, setTotalULoading] = useState(false);

    useEffect(() => {
        (async () => {
            try {
                setTotalPLoading(true)
                await csrf();
                const response = await axiosClient.get('/api/total/product');
                setTotalP(response.data.total);
                console.log(response.data.total);
            } catch (error) {
                console.error('Erreur lors de la récupération du total des produits :', error);
            } finally {
                setTotalPLoading(false)
            }
        })();
    }, []);

    useEffect(() => {
        (async () => {
            try {
                setTotalULoading(true)
                await csrf();
                const response = await axiosClient.get('/api/total/user');
                setTotalU(response.data.total);
                console.log(response.data.total);
            } catch (error) {
                console.error('Erreur lors de la récupération du total des users :', error);
            } finally {
                setTotalULoading(false)
            }
        })();
    }, []);

    useEffect(() => {
        (async () => {
            try {
                setTotalOLoading(true)
                await csrf();
                const response = await axiosClient.get('/api/total/order');
                setTotalO(response.data.total);
                console.log(response.data.total);
            } catch (error) {
                console.error('Erreur lors de la récupération du total des produits :', error);
            } finally {
                setTotalOLoading(false)
            }
        })();
    }, []);

    useEffect(() => {
        (async () => {
            try {
                setTotalCLoading(true)
                await csrf();
                const response = await axiosClient.get('/api/total/client');
                setTotalC(response.data.total);
                console.log(response.data.total);
            } catch (error) {
                console.error('Erreur lors de la récupération du total des produits :', error);
            } finally {
                setTotalCLoading(false)
            }
        })();
    }, []);


    const isLoading = totalPLoading || totalOLoading || totalCLoading || totalULoading;


    return isLoading ? <div className="w-full rounded-md border animate-pulse"><Spinner /></div> : (
        <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 justify-between items-center w-full gap-2">
            <Link to="/clients" className='group'>
                <Card className="h-[100%] w-[100%]">
                    <CardHeader className="flex flex-row justify-between items-center">
                        <h2 className="text-xl group-hover:underline">Clients</h2>
                        <UsersRound strokeWidth={1.5} />
                    </CardHeader>
                    <CardContent className="flex flex-row justify-between items-center">
                        <div>
                            <p className="text-lg">Total Clients</p>
                            <CardDescription>
                                {totalC} Client
                            </CardDescription>
                        </div>
                    </CardContent>
                </Card>
            </Link>

            <Link to="/orders" className='group'>
                <Card className="h-[100%] w-[100%]">
                    <CardHeader className="flex flex-row justify-between items-center">
                        <h2 className="text-xl group-hover:underline">Orders</h2>
                        <Mailbox strokeWidth={1.5} />
                    </CardHeader>
                    <CardContent className="flex flex-row justify-between items-center">
                        <div>
                            <p className="text-lg">Total Orders</p>
                            <CardDescription>
                                {totalO} Order
                            </CardDescription>
                        </div>
                    </CardContent>
                </Card>
            </Link>

            <Link to="/products" className='group'>
                <Card className="h-[100%] w-[100%]">
                    <CardHeader className="flex flex-row justify-between items-center">
                        <h2 className="text-xl group-hover:underline">Products</h2>
                        <Glasses strokeWidth={1.5} />
                    </CardHeader>
                    <CardContent className="flex flex-row justify-between items-center">
                        <div>
                            <p className="text-lg">Total Products</p>

                            <CardDescription>
                                {totalP} Product
                            </CardDescription>
                        </div>

                    </CardContent>
                </Card>
            </Link>

            <Link to="/user/list" className='group'>
                <Card className="h-[100%] w-[100%]">
                    <CardHeader className="flex flex-row justify-between items-center">
                        <h2 className="text-xl group-hover:underline">Users</h2>
                        <UsersRound strokeWidth={1.5} />
                    </CardHeader>
                    <CardContent className="flex flex-row justify-between items-center">
                        <div>
                            <p className="text-lg">Total Users</p>
                            <CardDescription>
                                {totalU} Users
                            </CardDescription>
                        </div>
                    </CardContent>
                </Card>
            </Link>
        </div>
    )
}


