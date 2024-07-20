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
import { useAuth } from "@/hooks/useAuth";
import axiosClient from "@/api/axiosClient";


export const DataTable = () => {
    const [clients, setClients] = useState([]);
    const { toast } = useToast();
    const navigate = useNavigate();

    const { csrf } = useAuth();

    useEffect(() => {
        const fetchClients = async () => {
            try {
                await csrf();
                const response = await axiosClient.get("/api/order/check");
                if (response.status === 200) {
                    setClients(response.data);
                    console.log("clients", response.data);
                } else {
                    throw new Error("Failed to fetch clients");
                }
            } catch (error) {
                console.error("Error fetching clients:", error);
            }
        };

        fetchClients();
    }, []);

    return (
        <div className="w-full">
            <div className="flex p-2 justify-between">
                <h4 className="text-2xl font-semibold dark:text-gray-300">
                 Banque
                </h4>
            </div>
            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Nom</TableHead>
                            <TableHead>
                                <Button variant="ghost">
                                    phone{" "}
                                    <CaretSortIcon className="ml-2 h-4 w-4" />
                                </Button>
                            </TableHead>
                            <TableHead>méthode de payement</TableHead>
                            <TableHead>payement status </TableHead>
                            <TableHead>reste prix </TableHead>
                            <TableHead>fichier </TableHead>
                            <TableHead>Actions</TableHead>
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
                                <TableCell>{client.remain_price}</TableCell>
                                <TableCell>{client.payment_file}</TableCell>
                                <TableHead>  <Button className="bg-purple-400 mr-2">
                                        <Link
                                            to={`/orders/details/${client.id}`}
                                        >
                                            <BiSolidShow/>
                                        </Link>
                                    </Button></TableHead>
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
                    Précédent
                    </Button>
                    <Button variant="outline" size="sm">
                    Suivant
                    </Button>
                </div>
            </div>
        </div>
    );
};
