import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

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
import {
    Avatar,
    AvatarImage,
    AvatarFallback,
} from "../../components/ui/avatar";
import { Image } from "@radix-ui/react-avatar";
import { useCheckoutStore } from "../../store";
import { useAuth } from "@/hooks/useAuth";
import axiosClient from "@/api/axiosClient.jsx";
import { backEndUrl } from "@/helpers/utils";


function OrderProductsAdd() {

    const { csrf } = useAuth();

    const { setSelectedProd, clientId, selectedProd } = useCheckoutStore();
    
    const [products, setProducts] = useState([]);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [totalProducts, setTotalProducts] = useState(0);
    const [searchQuery, setSearchQuery] = useState("");
    const [searchStatus, setSearchStatus] = useState("");

    // const { clientId } = useParams();
    // const clientId = window.location.pathname.split('/').pop();
    const [client, setClient] = useState();
    const navigate = useNavigate();
    const [selectedProducts, setSelectedProducts] = useState([]);
    const handleSelectProduct = (productId) => {
        const isSelected = selectedProducts.includes(productId);
        if (isSelected) {
            setSelectedProducts((prevSelected) =>
                prevSelected.filter((id) => id !== productId)
            );
        } else {
            setSelectedProducts((prevSelected) => [...prevSelected, productId]);
        }
    };
    const handleSaveSelectedProducts = () => {
        setSelectedProd(selectedProducts);
        console.log("Selected Products:", selectedProducts);
        navigate("/orders/confirmed", {
            state: { selectedProducts, clientId },
        });
    };
    //
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

    const getProducts = async (page, perPage, query = "", status = "") => {
        try {
            await csrf();
            const res = await axiosClient.post(`/api/orders/products/add/${clientId}`, {
                params: {
                    page: page + 1,
                    per_page: perPage,
                    query: query,
                    status: status || "",
                },
            }
            );
            const data = res.data?.data?.data ?? [];
            const client = res?.data?.client ?? [];
            const total = res.data?.total_pages ?? 0;
            const totalProductsCount = res.data?.total ?? 0;

            setClient(client);
            setProducts(data);
            setTotalPages(total);
            setTotalProducts(totalProductsCount);
        } catch (err) {
            console.log("err", err);
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

    useEffect(() => {
        getProducts(page, rowsPerPage, searchQuery, searchStatus);
        setSelectedProd(selectedProducts);
    }, [page, rowsPerPage, searchQuery, searchStatus, selectedProducts]);

    return (
        <>
            <div className="flex p-2 justify-between">
                <div className="flex items-center ">
                    <Link to={"/orders/add"} className="mr-2 cursor-pointer">
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
                    <h4 className="text-2xl font-semibold dark:text-gray-300">
                        Select the products for the Order for {client?.name}
                    </h4>
                </div>
                <button
                    onClick={handleSaveSelectedProducts}
                    className=" select-none rounded-lg bg-gradient-to-tr from-gray-900 to-gray-800 py-2 px-4 text-center align-middle font-sans text-xs font-bold uppercase text-white shadow-md shadow-gray-900/10 transition-all hover:shadow-lg hover:shadow-gray-900/20 active:opacity-[0.85] disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none lg:inline-block"
                    type="button"
                >
                    Save Selected Products
                </button>
            </div>
            <div className="flex p-2 justify-start space-x-2">
                <select
                    value={searchStatus}
                    onChange={(e) => setSearchStatus(e.target.value)}
                    className="bg-gray-50 w-fit border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block  p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                >
                    <option value="">All</option>
                    <option value="Disponible">Disponible</option>
                    <option value="Stock faible">Stock faible</option>
                </select>

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
                            placeholder="Search by name or reference"
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
                                <TableCell className="flex items-center ">
                                    <Avatar className="mr-2">
                                        <AvatarImage asChild>
                                            <Image
                                                src={`${backEndUrl}/public/assets/uploads/products/${product.image}`}
                                                alt="avatar"
                                                width={40}
                                                height={40}
                                            />
                                        </AvatarImage>
                                        <AvatarFallback></AvatarFallback>
                                    </Avatar>
                                    <div className="flex flex-col">
                                        <div>{product.name}</div>
                                        <div>{product.reference}</div>
                                    </div>
                                </TableCell>
                                <TableCell>{product.price}</TableCell>
                                <TableCell>
                                    {product.quantity_available}
                                </TableCell>
                                <TableCell>
                                    <span
                                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColorClass(
                                            product.status
                                        )}`}
                                    >
                                        {product.status}
                                    </span>
                                </TableCell>

                                <TableCell>
                                    <div className="inline-flex items-center">
                                        <label
                                            className="relative flex items-center p-3 rounded-full cursor-pointer"
                                            htmlFor="amber"
                                        >
                                            <input
                                                checked={selectedProducts.includes(
                                                    product.id
                                                )}
                                                onChange={() =>
                                                    handleSelectProduct(
                                                        product.id
                                                    )
                                                }
                                                type="checkbox"
                                                className="before:content[''] peer relative h-5 w-5 cursor-pointer appearance-none rounded-md border border-blue-gray-200 transition-all before:absolute before:top-2/4 before:left-2/4 before:block before:h-12 before:w-12 before:-translate-y-2/4 before:-translate-x-2/4 before:rounded-full before:bg-blue-gray-500 before:opacity-0 before:transition-opacity checked:border-green-500 checked:bg-green-500 checked:before:bg-green-500 hover:before:opacity-10"
                                                id="amber"
                                            />
                                            <span className="absolute text-white transition-opacity opacity-0 pointer-events-none top-2/4 left-2/4 -translate-y-2/4 -translate-x-2/4 peer-checked:opacity-100">
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    className="h-3.5 w-3.5"
                                                    viewBox="0 0 20 20"
                                                    fill="currentColor"
                                                    stroke="currentColor"
                                                    strokeWidth="1"
                                                >
                                                    <path
                                                        fillRule="evenodd"
                                                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                                        clipRule="evenodd"
                                                    ></path>
                                                </svg>
                                            </span>
                                        </label>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                </TableBody>
            </Table>
            {/* <div className="flex justify-end mt-4 px-4">
                <Button
                    onClick={handleSaveSelectedProducts}
                    className="bg-green-400"
                >
                    Save Selected Products
                </Button>
            </div> */}
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

export default OrderProductsAdd;
