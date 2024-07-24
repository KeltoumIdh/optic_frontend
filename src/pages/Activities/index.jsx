import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { BiSolidShow } from "react-icons/bi";
import { RiEditFill } from "react-icons/ri";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
    // TableContainer,
    // TablePagination,
} from "@/components/ui/table";
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination";
import { Button } from "../../components/ui/button";
import { useAuth } from "@/hooks/useAuth.jsx";
import axiosClient from "@/api/axiosClient.jsx";
import Loader from "@/components/loader";
import Spinner from "@/components/Spinner";
import { renderImageDir } from "@/helpers/utils";



export default function Activities() {
    const [clients, setClients] = useState([]);
    const [totalPages, setTotalPages] = useState(0);
    const [totalClients, setTotalClients] = useState(0);

    const { csrf } = useAuth()

    const [loading, setLoading] = useState(false);


    const getClients = async () => {
        try {
            setLoading(true)

            await csrf();
            
            const res = await axiosClient.get("/api/getAllActivities");

            const data = res.data?.data ?? [];
            const total = res.data?.total_pages ?? 0;
            const totalClientsCount = res.data?.total ?? 0;

            setClients(data);
            setTotalPages(total);
            setTotalClients(totalClientsCount);
        } catch (err) {
            console.log("err", err);
        } finally {
            setLoading(false)
        }
    };

    useEffect(() => {
        getClients()
    },[])

    return (
        <div>
            <div className="flex p-2 justify-between">
                <h4 className="text-2xl font-semibold dark:text-gray-300">
                    Activities
                </h4>
            </div>

            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Id</TableHead>
                        <TableHead>User</TableHead>
                        <TableHead>Type</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {loading ? suspense() :
                        clients?.length === 0 ? notFound() :
                            clients.map((client) => (
                                <TableRow key={client.id}>
                                    <TableCell>{client.id}</TableCell>
                                    <TableCell>
                                        <div className="group cursor-context-menu flex items-center gap-2">
                                            <div className="w-10 h-10 bg-blue-50 rounded-full">
                                                {/* // */}
                                            </div>
                                            <span className="underline group-hover:no-underline text-blue-500">
                                                {client?.user?.name ?? 'unknown'}
                                            </span>
                                        </div>
                                    </TableCell>
                                    <TableCell>{client.type}</TableCell>
                                </TableRow>
                            ))}
                </TableBody>
            </Table>

            {!loading && clients?.length > 0 &&
            <div className="flex justify-between mt-4 lg:px-4">
                <div className="w-full">
                    <p className="text-sm w-full text-gray-500">
                        Showing {clients.length} of {totalClients} clients
                    </p>
                </div>
            </div>}
        </div>
    );
}


const suspense = () => <TableRow className="bg-white hover:bg-white"><TableCell colSpan={5}><Spinner /></TableCell></TableRow>
const notFound = () => <TableRow className="bg-white hover:bg-white"><TableCell colSpan={5}>No results!</TableCell></TableRow>
