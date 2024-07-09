import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
    CaretSortIcon,
} from "@radix-ui/react-icons";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Link, useNavigate } from "react-router-dom";

import { useToast } from "../components/ui/use-toast";
import { BiSolidShow } from "react-icons/bi";
import { backEndUrl } from "@/helpers/utils";
import { useAuth } from "@/hooks/useAuth";
import Loader from "@/components/loader";
import axiosClient from "@/api/axiosClient";
import Spinner from "@/components/Spinner";


export const FactureTable = () => {
    const [clients, setClients] = useState([]);
    const { toast } = useToast();
    const navigate = useNavigate();
    const showPDF = (url) => {
        window.open(url, '_blank');
    };

    const { csrf } = useAuth();

    const [loading, setLoading] = useState(false);



    useEffect(() => {
        const fetchClients = async () => {
            try {
                setLoading(true)
                await csrf()
                const response = await axiosClient.get("/api/order/facture");
                if (response.status === 200) {
                    setClients(response.data);
                } else {
                    throw new Error("Failed to fetch clients");
                }
            } catch (error) {
                console.error("Error fetching clients:", error);
            } finally {
                setLoading(false)
            }
        };

        fetchClients();
    }, []);

    return loading ? <Spinner /> : (
        <div className="w-full">
            <div className="flex p-2 justify-between">
                <h4 className="text-2xl font-semibold dark:text-gray-300">
                    Factures
                </h4>
            </div>
            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Name</TableHead>
                            <TableHead>
                                <Button variant="ghost">
                                    phone{" "}
                                    <CaretSortIcon className="ml-2 h-4 w-4" />
                                </Button>
                            </TableHead>
                            <TableHead>méthode de payement</TableHead>
                            <TableHead>payement status </TableHead>
                            <TableHead>Facture file </TableHead>
                            <TableHead>Actions </TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {clients.map((client) => (
                            <TableRow key={client.id}>
                                <TableCell>
                                    {client.name} {client.lname}
                                </TableCell>
                                <TableCell>{client.phone}</TableCell>
                                <TableCell>{client.payment_method}</TableCell>
                                <TableCell>{client.payment_status}</TableCell>
                                <TableCell>
                                    <Button
                                        className="bg-green-400 mr-2"
                                        onClick={() => showPDF(`${backEndUrl}/assets/uploads/pdf/${client.invoice}`)}
                                    >
                                        Show PDF
                                    </Button>
                                </TableCell>
                                <TableHead>
                                    <Link
                                        to={`/orders/details/${client.id}`}
                                    >
                                        <Button className="bg-purple-400 mr-2">
                                            <BiSolidShow />
                                        </Button>
                                    </Link>
                                </TableHead>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
            <div className="flex items-center justify-end space-x-2 py-4">
                <div className="flex-1 text-sm text-muted-foreground">
                    {/* Row selection information */}
                </div>
                <div className="space-x-2">
                    <Button variant="outline" size="sm">
                        Previous
                    </Button>
                    <Button variant="outline" size="sm">
                        Next
                    </Button>
                </div>
            </div>
        </div>
    );
};
