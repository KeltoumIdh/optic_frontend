import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
    CaretSortIcon,
    ChevronDownIcon,
    DotsHorizontalIcon,
} from "@radix-ui/react-icons";
import { Checkbox } from "@/components/ui/checkbox";
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { Pencil, Trash2 } from "lucide-react";

import { useToast } from "../components/ui/use-toast";
import { axiosUser } from "../api/axios";
import { BiSolidShow } from "react-icons/bi";

export const FactureTable = () => {
    const [clients, setClients] = useState([]);
    const { toast } = useToast();
    const navigate = useNavigate();
    const showPDF = (url) => {
        window.open(url, '_blank');
    };
 

  
    useEffect(() => {
        const fetchClients = async () => {
            try {
                const response = await axiosUser.get("/order/facture");
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
                 Factures
                </h4>
            </div>
            {/* <div className="flex items-end py-4">
                <Input placeholder="Filter emails..." className="max-w-sm" />
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline" className="ml-auto">
                            Columns <ChevronDownIcon className="ml-2 h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                       
                    </DropdownMenuContent>
                   
                </DropdownMenu>
                <div className="p-2">
                        <Link to="/user/add">
                            <Button variant="outline">Add User</Button>
                        </Link>
                    </div>
            </div> */}
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
                                onClick={() => showPDF(`http://localhost:8000/assets/uploads/pdf/${client.invoice}`)}
                            >
                                Show PDF
                            </Button>
</TableCell>
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
