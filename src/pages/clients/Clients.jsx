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



export default function Clients() {
    const [clients, setClients] = useState([]);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [totalClients, setTotalClients] = useState(0);
    const [searchQuery, setSearchQuery] = useState("");
    const [searchStatus, setSearchStatus] = useState("");

    const { csrf } = useAuth()

    const [loading, setLoading] = useState(false);


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
            setLoading(true)
            await csrf();
            const res = await axiosClient.get("/api/clients", {
                params: {
                    page: page + 1,
                    per_page: perPage,
                    query: query, // Use consistent naming (either 'query' or 'search')
                    status: status || "", // Ensure status is set to an empty string if not provided
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
        } finally {
            setLoading(false)
        }
    };

    const handleDelete = async (id) => {
        try {
            await csrf();
            await axiosClient.delete(`/api/clients/delete/${id}`);
            setClients((prevClients) =>
                prevClients.filter((client) => client.id !== id)
            );
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
                <h4 className="text-2xl font-semibold dark:text-gray-300">
                    Clients
                </h4>
                <Link className={"flex items-center"} to={"/clients/add"}>
                    <button
                        className=" select-none rounded-lg bg-gradient-to-tr from-gray-900 to-gray-800 py-2 px-4 text-center align-middle font-sans text-xs font-bold uppercase text-white shadow-md shadow-gray-900/10 transition-all hover:shadow-lg hover:shadow-gray-900/20 active:opacity-[0.85] disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none lg:inline-block"
                        type="button"
                    >
                        {" "}
                        Ajouter
                    </button>
                </Link>
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
                    {loading ? suspense() :
                        clients?.length === 0 ? notFound() :
                            clients.map((client) => (
                                <TableRow key={client.id}>
                                    <TableCell className="h-full flex items-center">
                                        <img
                                            src={renderImageDir(client.image)}
                                            alt="avatar"
                                            width="40"
                                            height="40"
                                            className="pr-2"
                                        />
                                        {client.name} {client.lname}
                                    </TableCell>
                                    <TableCell className='max-md:p-2'>{client.phone}</TableCell>
                                    <TableCell>{client.city}</TableCell>
                                    <TableCell className='flex justify-center max-md:p-2'>{client.orders_count}</TableCell>
                                    <TableCell className="text-center max-md:p-2">
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
                                    <TableCell className='max-md:p-2 flex items-center h-full'>
                                        <Button className="bg-blue-400 m-1  max-md:px-3">
                                            <Link
                                                to={`/clients/edit/${client.id}`}
                                                className="max-lg:text-xs "
                                            >
                                                <RiEditFill />
                                            </Link>
                                        </Button>
                                        <Button className="bg-purple-400 mx-1 max-lg:text-sm max-md:px-3">
                                            <Link
                                                to={`/clients/details/${client.id}`}
                                                className="max-lg:text-xs "
                                            >
                                                <BiSolidShow />
                                            </Link>
                                        </Button>
                                        {/* <Button
                                        className="bg-red-500 max-lg:text-xs m-1 max-lg:p-2"
                                        onClick={() => handleDelete(client.id)}
                                    >
                                        Supprimer
                                    </Button> */}
                                    </TableCell>
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
            </div>}
        </>
    );
}


const suspense = () => <TableRow className="bg-white hover:bg-white"><TableCell colSpan={5}><Spinner /></TableCell></TableRow>
const notFound = () => <TableRow className="bg-white hover:bg-white"><TableCell colSpan={5}>No results!</TableCell></TableRow>
