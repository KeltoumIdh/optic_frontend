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
} from "@/components/ui/table";
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination";

import { axiosProduct } from "../../api/axios";
import { Button } from "../../components/ui/button";
import { backEndUrl } from "@/helpers/utils";
import { useAuth } from "@/hooks/useAuth";
import axiosClient from "@/api/axiosClient";
import Loader from "@/components/loader";



function Products() {
    
    const { csrf } = useAuth()

    const [products, setProducts] = useState([]);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [totalProducts, setTotalProducts] = useState(0);
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
        getProducts(0, rowsPerPage, searchQuery, searchStatus);
    };
    const handleChangeSearch = (event) => {
        setSearchQuery(event.target.value);
    };

    const [loading, setLoading] = useState(false);

    const getProducts = async (page, perPage, query = "", status = "") => {
        try {
            setLoading(true)
            await csrf();
            const res = await axiosProduct.get("/products", {
                params: {
                    page: page + 1,
                    per_page: perPage,
                    query: query, // Use consistent naming (either 'query' or 'search')
                    status: status || "", // Ensure status is set to an empty string if not provided
                },
            });

            const data = res.data?.data ?? [];
            const total = res.data?.total_pages ?? 0;
            const totalProductsCount = res.data?.total ?? 0;

            setProducts(data);
            setTotalPages(total);
            setTotalProducts(totalProductsCount);
        } catch (err) {
            console.log("err", err);
        } finally {
            setLoading(false)
        }
    };
    const getStatusColorClass = (status) => {
        switch (status) {
            case "Stock faible":
                return "bg-yellow-100 text-yellow-800";
            case "Disponible":
                return "bg-green-100 text-green-800";
            case "Rupture de stock":
                return "bg-red-100 text-red-800";
            default:
                return "bg-gray-100 text-gray-800";
        }
    };

    const handleDelete = async (id) => {
        try {
            await csrf();
            await axiosClient.delete(`/api/products/delete/${id}`);
            setProducts((prevProducts) =>
                prevProducts.filter((product) => product.id !== id)
            );
        } catch (err) {
            console.log("err", err);
        }
    };
    useEffect(() => {
        getProducts(page, rowsPerPage, searchQuery, searchStatus);
    }, [page, rowsPerPage, searchQuery, searchStatus]);

    return loading ? <Loader /> : (
        <>
            <div className="flex p-2 justify-between">
            <h4 className="lg:text-2xl text-lg font-semibold dark:text-gray-300">
                    Products
                </h4>
                <button
                    className=" select-none rounded-lg bg-gradient-to-tr from-gray-900 to-gray-800 lg:py-2 lg:px-4 px-2 text-center align-middle font-sans md:text-xs text-[10px] font-bold uppercase text-white shadow-md shadow-gray-900/10 transition-all hover:shadow-lg hover:shadow-gray-900/20 active:opacity-[0.85] disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none inline-block"
                    type="button"
                >
                    <Link className={"flex items-center"} to={"/products/add"}>
                        {" "}
                        Ajouter
                    </Link>
                </button>
            </div>
            <div className="flex p-2 justify-start space-x-2">
                <select
                    value={searchStatus}
                    onChange={(e) => setSearchStatus(e.target.value)}
                    className="bg-gray-50 w-fit border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block  md:p-2.5 p-1 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                >
                    <option value="">All</option>
                    <option value="Disponible">Disponible</option>
                    <option value="Stock faible">Stock faible</option>
                    <option value="Rupture de stock">Rupture de stock</option>
                </select>

                <form className="lg:w-1/2 w-full ">
                    {/* <label
                        htmlFor="default-search"
                        className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white"
                    >
                        Search
                    </label> */}
                    <div className="relative">
                        <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                            <svg
                                className="md:w-4 md:h-4 h-3  text-gray-500 dark:text-gray-400"
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
                            className="block w-full lg:px-4 md:py-3 p-2 ps-10 md:text-sm text-xs text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                            placeholder="Recherche par nom du produit ou reference."
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
                        <TableHead>Product</TableHead>
                        <TableHead>Price</TableHead>
                        <TableHead>Quantity</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {products?.length > 0 &&
                        products.map((product) => (
                            <TableRow key={product.id}>
                                <TableCell className="flex items-center max-md:p-2">
                                    <img
                                        src={`${backEndUrl}/assets/uploads/products/${product.image}`}
                                        alt="avatar"
                                        width="40px"
                                        height="40px"
                                        className="pr-2"
                                    />{" "}
                                    <div className="flex flex-col">
                                        <div>{product.name}</div>
                                        <div>{product.reference}</div>
                                    </div>
                                </TableCell>
                                <TableCell className="max-md:p-2 text-center">{product.price}</TableCell>
                                <TableCell className="max-md:p-2 text-center">
                                    {product.quantity_available}
                                </TableCell>
                                <TableCell className="max-md:p-2">
                                    <span
                                        className={`px-2 inline-flex text-center text-xs leading-5 font-semibold rounded-full ${getStatusColorClass(
                                            product.status
                                        )}`}
                                    >
                                        {product.status}
                                    </span>
                                </TableCell>
                                <TableCell className="max-md:p-2 flex items-center h-full">
                                    <Button className="bg-blue-400 mr-2 max-md:px-3">
                                        <Link
                                            to={`/products/edit/${product.id}`}
                                        >
                                            <RiEditFill/>
                                        </Link>
                                    </Button>
                                    <Button className="bg-purple-400 mr-2 max-md:px-3">
                                        <Link
                                            to={`/products/details/${product.id}`}
                                        >
                                            <BiSolidShow/>
                                        </Link>
                                    </Button>
                                    {/* <Button
                                        className="bg-red-500"
                                        onClick={() => handleDelete(product.id)}
                                    >
                                        Delete
                                    </Button> */}
                                </TableCell>
                            </TableRow>
                        ))}
                </TableBody>
            </Table>
            <div className="flex justify-between mt-4 px-4">
                <div className="w-full">
                    <p className="text-sm w-full text-gray-500">
                        Showing {products.length} of {totalProducts} products
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

export default Products;
