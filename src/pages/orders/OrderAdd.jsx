import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

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

import { axiosClient, axiosOrder } from "../../api/axios";
import { Button } from "../../components/ui/button";
import {
    Avatar,
    AvatarImage,
    AvatarFallback,
} from "../../components/ui/avatar";
import { Image } from "@radix-ui/react-avatar";
import { useCheckoutStore } from "../../store";

function OrderAdd() {
    const { setClient } = useCheckoutStore();
    const [clients, setClients] = useState([]);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [totalClients, setTotalClients] = useState(0);
    const [searchQuery, setSearchQuery] = useState("");
    const [searchStatus, setSearchStatus] = useState("");

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };
    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };
    const handleSearch = () => {
        console.log("Search Query2:", searchQuery);
        getClients(0, rowsPerPage, searchQuery, searchStatus);
    };
    const handleChangeSearch = (event) => {
        setSearchQuery(event.target.value);
    };

    const getClients = async (page, perPage, query = "", status = "") => {
        try {
            const res = await axiosOrder.get("/orders/add", {
                params: {
                    page: page + 1,
                    per_page: perPage,
                    query: query,
                    status: status || "",
                },
            });

            const data = res.data?.data ?? [];
            const total = res.data?.total_pages ?? 0;
            const totalClientsCount = res.data?.total ?? 0;

            setClients(data);
            setTotalPages(total);
            setTotalClients(totalClientsCount);
        } catch (err) {
            console.log("err", err);
        }
    };

    useEffect(() => {
        getClients(page, rowsPerPage, searchQuery, searchStatus);
    }, [page, rowsPerPage, searchQuery, searchStatus]);

    return (
        <>
            <div className="flex p-2 justify-between">
                <div className="flex items-center ">
                    <Link to={"/orders"} className="mr-2 cursor-pointer">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth="1.5"
                            stroke="currentColor"
                            className="w-6 h-6"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18"
                            />
                        </svg>
                    </Link>

                    <h4 className="lg:text-2xl text-lg font-semibold dark:text-gray-300">
                        Les Clients
                    </h4>
                </div>
                <button
                    className=" select-none rounded-lg bg-gradient-to-tr from-gray-900 to-gray-800 py-2 px-4 text-center align-middle font-sans text-xs font-bold uppercase text-white shadow-md shadow-gray-900/10 transition-all hover:shadow-lg hover:shadow-gray-900/20 active:opacity-[0.85] disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none inline-block"
                    type="button"
                >
                    <Link className={"flex items-center"} to={"/clients/add"}>
                        {" "}
                        Créer une nouvelle commande pour un invité
                    </Link>
                </button>
            </div>
            <div className="flex p-2 justify-start space-x-2">
                {/* <select
                    value={searchStatus}
                    onChange={(e) => setSearchStatus(e.target.value)}
                    className="bg-gray-50 w-fit border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block  p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                >
                    <option value="">All</option>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                </select> */}

                <form className="lg:w-1/2 w-full ">
                    <label
                        htmlFor="default-search"
                        className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white"
                    >
                        Search
                    </label>
                    <div className="relative">
                        <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                            <svg
                                className="w-4 h-4 text-gray-500 dark:text-gray-400"
                                aria-hidden="true"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 20 20"
                            >
                                <path
                                    stroke="currentColor"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                                />
                            </svg>
                        </div>
                        <input
                            value={searchQuery}
                            onChange={handleChangeSearch}
                            type="search"
                            id="default-search"
                            className="block w-full px-4 py-3 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                            placeholder="Search by name, email, or phone"
                            required
                        />
                        {/* <button
                            onClick={handleSearch}
                            type="submit"
                            className="text-white font-sans uppercase  absolute end-2.5 bottom-2 bg-gray-900 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-xs px-4 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                        >
                            Search
                        </button> */}
                    </div>
                </form>
            </div>

            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Client</TableHead>
                        <TableHead>Numéro de téléphone</TableHead>
                        <TableHead>Ville</TableHead>
                        <TableHead>Nbr Commandes</TableHead>
                        <TableHead>Credit</TableHead>
                        <TableHead className='text-right mr-6'>Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {clients?.length > 0 &&
                        clients.map((client) => (
                            <TableRow key={client.id}>
                                <TableCell className="h-full flex items-center">
                                    <img
                                        src={`http://localhost:8000/assets/uploads/clients/${client.image}`}
                                        alt="avatar"
                                        width="40"
                                        height="40"
                                        className="pr-2"
                                    />
                                    {client.name} {client.lname}
                                </TableCell>
                                <TableCell>{client.phone}</TableCell>
                                <TableCell>{client.city}</TableCell>
                                <TableCell className='flex justify-center'>{client.orders_count}</TableCell>
                                <TableCell className="text-center ">
                                    {client.has_credit ? (
                                        <div className="bg-red-100 rounded text-red-800">
                                            {" "}
                                            Oui{" "}
                                        </div>
                                    ) : (
                                        <div className="bg-green-100 text-green-800">
                                            Non{" "}
                                        </div>
                                    )}
                                </TableCell>
                                <TableCell>
                                    <Button className="bg-blue-400 mr-2">
                                        <Link
                                            onClick={() => setClient(client.id)}
                                            to={`/orders/products/add/${client.id}`}
                                        >
                                            Create Order
                                        </Link>
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                </TableBody>
            </Table>
            <div className="flex justify-between mt-4 px-4">
                <div className="w-full">
                    <p className="text-sm w-full text-gray-500">
                        Showing {clients.length} of {totalClients} clients
                    </p>
                </div>
                <Pagination className="flex justify-end">
                    <PaginationContent>
                        <PaginationItem>
                            <PaginationPrevious
                                href="#"
                                onClick={(e) => handleChangePage(e, page - 1)}
                                style={{ color: page > 0 ? "blue" : "gray" }}
                            />
                        </PaginationItem>
                        {[...Array(totalPages)].map((_, index) => (
                            <PaginationItem key={index}>
                                <PaginationLink
                                    href="#"
                                    onClick={(e) => handleChangePage(e, index)}
                                    style={{
                                        color: index === page ? "red" : "black",
                                    }}
                                >
                                    {index + 1}
                                </PaginationLink>
                            </PaginationItem>
                        ))}
                        <PaginationItem>
                            <PaginationNext
                                href="#"
                                onClick={(e) => handleChangePage(e, page + 1)}
                                style={{
                                    color:
                                        page < totalPages - 1 ? "blue" : "gray",
                                }}
                            />
                        </PaginationItem>
                    </PaginationContent>
                </Pagination>
            </div>
        </>
    );
}

export default OrderAdd;
