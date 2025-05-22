import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { BiSolidShow } from "react-icons/bi";
import { RiEditFill, RiSearchLine } from "react-icons/ri";
import { HiPlus } from "react-icons/hi";
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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { axiosProduct } from "../../api/axios";
import { Button } from "../../components/ui/button";
import { renderImageDir } from "@/helpers/utils";
import { useAuth } from "@/hooks/useAuth";
import Spinner from "@/components/Spinner";
import { AlertTriangle, Package } from "lucide-react";

export default function Products() {
  const { csrf } = useAuth();
  const { authUser } = useAuth();

  const isOwner = authUser?.data?.role === "owner";

  const [products, setProducts] = useState([]);
  const [rowsPerPage] = useState(5);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalProducts, setTotalProducts] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchStatus, setSearchStatus] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChangePage = (event, newPage) => {
    if (newPage >= 0 && newPage < totalPages) {
      setPage(newPage);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    getProducts(0, rowsPerPage, searchQuery, searchStatus);
    setPage(0); // Reset to first page when searching
  };

  const handleChangeSearch = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleStatusChange = (e) => {
    setSearchStatus(e.target.value);
    setPage(0); // Reset to first page when filter changes
    getProducts(0, rowsPerPage, searchQuery, e.target.value);
  };

  const getProducts = async (page, perPage, query = "", status = "") => {
    try {
      setLoading(true);
      await csrf();
      const res = await axiosProduct.get("/products", {
        params: {
          page: page + 1,
          per_page: perPage,
          query: query,
          status: status || "",
        },
      });

      const data = res.data?.data ?? [];
      const total = res.data?.total_pages ?? 0;
      const totalProductsCount = res.data?.total ?? 0;

      setProducts(data);
      setTotalPages(total);
      setTotalProducts(totalProductsCount);
    } catch (err) {
      console.error("Error fetching products:", err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColorClass = (status) => {
    switch (status) {
      case "Stock faible":
        return "bg-amber-100 text-amber-800 border-amber-300 border";
      case "Disponible":
        return "bg-emerald-100 text-emerald-800 border-emerald-300 border";
      case "Rupture de stock":
        return "bg-rose-100 text-rose-800 border-rose-300 border";
      default:
        return "bg-gray-100 text-gray-800 border-gray-300 border";
    }
  };

  // Fetch products when page, rowsPerPage change
  useEffect(() => {
    getProducts(page, rowsPerPage, searchQuery, searchStatus);
  }, [page, rowsPerPage]);

  // Trigger search when search query changes after delay
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (searchQuery !== undefined) {
        getProducts(0, rowsPerPage, searchQuery, searchStatus);
        setPage(0);
      }
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);

  return (
    <div className=" mx-auto px-2 py-4 md:px-4 md:py-6">
      <Card className="shadow-sm">
        <CardHeader className="pb-2">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex items-center">
              <Package className="h-5 w-5 mr-2 text-primary" />
              <CardTitle className="text-xl md:text-2xl font-bold">
                Les Produits
              </CardTitle>
            </div>
            <Link to="/products/add">
              <Button className="bg-primary hover:bg-primary/90 rounded-md flex items-center gap-1">
                <HiPlus className="mr-1" />
                <span className="hidden sm:inline">Ajouter un produit</span>
                <span className="sm:hidden">Ajouter</span>
              </Button>
            </Link>
          </div>
        </CardHeader>
        <CardContent>
          <div className="mb-6 space-y-4">
            <div className="flex flex-col sm:flex-row gap-4 sm:items-center">
              <div className="w-full sm:w-auto">
                <select
                  value={searchStatus}
                  onChange={handleStatusChange}
                  className="bg-white   border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-gray-100 text-sm rounded-md w-full px-3 py-2 outline-none focus:ring-2 focus:ring-primary/50"
                >
                  <option value="">Tous les statuts</option>
                  <option value="Disponible">Disponible</option>
                  <option value="Stock faible">Stock faible</option>
                  <option value="Rupture de stock">Rupture de stock</option>
                </select>
              </div>
              <form onSubmit={handleSearch} className="flex-1 relative">
                <div className="relative">
                  <input
                    value={searchQuery}
                    onChange={handleChangeSearch}
                    type="search"
                    className="block w-full px-4 py-2 ps-10 text-sm text-gray-900 dark:text-gray-100 border border-gray-300 dark:border-gray-700 rounded-md bg-white   focus:ring-2 focus:ring-primary/50 outline-none"
                    placeholder="Recherche par nom ou référence..."
                  />
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3">
                    <RiSearchLine className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                  </div>
                  <button type="submit" className="sr-only">
                    Rechercher
                  </button>
                </div>
              </form>
            </div>
          </div>

          <div className="border rounded-md overflow-hidden">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader className="bg-gray-50  ">
                  <TableRow>
                    <TableHead className="py-3 font-medium">Produit</TableHead>
                    <TableHead className="py-3 font-medium text-center">
                      Prix
                    </TableHead>
                    <TableHead className="py-3 font-medium text-center">
                      Quantité
                    </TableHead>
                    <TableHead className="py-3 font-medium">Status</TableHead>
                    <TableHead className="py-3 font-medium">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-8">
                        <div className="flex justify-center">
                          <Spinner />
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : products?.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={5}
                        className="text-center py-8 text-gray-500"
                      >
                        <div className="flex flex-col items-center justify-center space-y-3">
                          <AlertTriangle className="h-8 w-8 text-amber-500 opacity-40" />
                          <p>Aucun produit trouvé</p>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : (
                    products.map((product) => (
                      <TableRow
                        key={product.id}
                        className="border-b hover:bg-gray-50 dark:hover:bg-gray-800/50"
                      >
                        <TableCell className="py-3 flex items-center">
                          <div className="h-10 w-10 mr-3 rounded-md overflow-hidden bg-gray-100 flex-shrink-0">
                            <img
                              src={renderImageDir(product?.image || "")}
                              alt={product.name}
                              className="h-full w-full object-cover"
                            />
                          </div>
                          <div className="flex flex-col">
                            <p className="font-medium text-sm">
                              {product.name}
                            </p>
                            <p className="text-xs text-gray-500">
                              {product.reference}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell className="py-3 text-center">
                          <span className="font-medium">{product.price}</span>
                        </TableCell>
                        <TableCell className="py-3 text-center">
                          <span
                            className={
                              product.quantity_available <= 5
                                ? "text-amber-600 font-medium"
                                : ""
                            }
                          >
                            {product.quantity_available}
                          </span>
                        </TableCell>
                        <TableCell className="py-3">
                          <span
                            className={`px-2.5 py-1 inline-flex text-xs items-center justify-center font-medium rounded-full ${getStatusColorClass(
                              product.status
                            )}`}
                          >
                            {product.status}
                          </span>
                        </TableCell>
                        <TableCell className="py-3">
                          <div className="flex space-x-2">
                            {isOwner && (
                              <Link to={`/products/edit/${product.id}`}>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="h-8 w-8 p-0 border-blue-200 hover:bg-blue-50 hover:text-blue-600"
                                >
                                  <RiEditFill className="h-4 w-4" />
                                </Button>
                              </Link>
                            )}
                            <Link to={`/products/details/${product.id}`}>
                              <Button
                                size="sm"
                                variant="outline"
                                className="h-8 w-8 p-0 border-purple-200 hover:bg-purple-50 hover:text-purple-600"
                              >
                                <BiSolidShow className="h-4 w-4" />
                              </Button>
                            </Link>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </div>

          {!loading && products?.length > 0 && (
            <div className="flex flex-col sm:flex-row justify-between items-center mt-4 gap-4">
              <div>
                <p className="text-sm text-gray-500">
                  Affichage de {products.length} sur {totalProducts} produits
                </p>
              </div>
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      onClick={(e) => handleChangePage(e, page - 1)}
                      className={
                        page > 0
                          ? "cursor-pointer hover:text-primary"
                          : "cursor-not-allowed opacity-50"
                      }
                    />
                  </PaginationItem>
                  {Array.from({ length: Math.min(totalPages, 5) }).map(
                    (_, index) => {
                      // Show only 5 pages at a time with smart pagination
                      let pageIndex = page;
                      if (page < 2) {
                        pageIndex = index;
                      } else if (page >= totalPages - 2) {
                        pageIndex = totalPages - 5 + index;
                      } else {
                        pageIndex = page - 2 + index;
                      }

                      if (pageIndex >= 0 && pageIndex < totalPages) {
                        return (
                          <PaginationItem key={pageIndex}>
                            <PaginationLink
                              onClick={(e) => handleChangePage(e, pageIndex)}
                              isActive={pageIndex === page}
                              className={
                                pageIndex === page
                                  ? "bg-primary text-white border-primary"
                                  : "hover:bg-gray-50"
                              }
                            >
                              {pageIndex + 1}
                            </PaginationLink>
                          </PaginationItem>
                        );
                      }
                      return null;
                    }
                  )}
                  <PaginationItem>
                    <PaginationNext
                      onClick={(e) =>
                        page < totalPages - 1 && handleChangePage(e, page + 1)
                      }
                      className={
                        page < totalPages - 1
                          ? "cursor-pointer hover:text-primary"
                          : "cursor-not-allowed opacity-50"
                      }
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
