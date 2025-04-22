import { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
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
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCheckoutStore } from "../../store";
import { useAuth } from "@/hooks/useAuth";
import axiosClient from "@/api/axiosClient.jsx";
import { renderImageDir } from "@/helpers/utils";
import Spinner from "@/components/Spinner";
import {
  ArrowRight,
  ArrowLeft,
  Package,
  Search,
  BoxSelect,
  AlertTriangle,
} from "lucide-react";

export default function OrderProductsAdd() {
  const { id } = useParams();
  const { csrf } = useAuth();
  const {
    setSelectedProd,
    clientId: storeClientId,
    selectedProd,
  } = useCheckoutStore();
  const [products, setProducts] = useState([]);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalProducts, setTotalProducts] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchStatus, setSearchStatus] = useState("all");
  const [client, setClient] = useState(null);
  const navigate = useNavigate();
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  const clientId = id || storeClientId;

  const handleSelectProduct = (productId, availableQNT = 0) => {
    if (availableQNT === 0) return;

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
    if (selectedProducts.length === 0) {
      return; // Prevent continuing without selecting products
    }
    setSelectedProd(selectedProducts);
    navigate("/orders/confirmed", {
      state: { selectedProducts, clientId },
    });
  };

  const handleChangePage = (newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleChangeSearch = (event) => {
    setSearchQuery(event.target.value);
  };

  const getProducts = async (page, perPage, query = "", status = "") => {
    try {
      setLoading(true);
      await csrf();
      console.log("Fetching products with client ID:", clientId);

      const res = await axiosClient.get(
        `/api/orders/products/add/${clientId}`,
        {
          params: {
            page: page + 1,
            per_page: perPage,
            query: query,
            status: status === "all" ? "" : status,
          },
        }
      );

      console.log("API Response:", res.data);

      const data = res.data?.data?.data ?? [];
      const client = res?.data?.client ?? [];
      const total = res.data?.total_pages ?? 0;
      const totalProductsCount = res.data?.total ?? 0;

      console.log("Parsed products:", data);
      console.log("Client info:", client);

      setClient(client);
      setProducts(data);
      setTotalPages(total);
      setTotalProducts(totalProductsCount);
    } catch (err) {
      console.error("Error fetching products:", err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "Stock faible":
        return (
          <Badge variant="warning" className="flex items-center gap-1">
            <AlertTriangle className="h-3 w-3" /> {status}
          </Badge>
        );
      case "Disponible":
        return <Badge variant="success">{status}</Badge>;
      case "Rupture de stock":
        return <Badge variant="destructive">{status}</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  useEffect(() => {
    console.log("Client ID from store:", storeClientId);
    console.log("Client ID from URL params:", id);
    console.log("Using client ID:", clientId);
  }, [storeClientId, id, clientId]);

  useEffect(() => {
    getProducts(page, rowsPerPage, searchQuery, searchStatus);
  }, [page, rowsPerPage, searchQuery, searchStatus]);

  // Initialize selectedProducts with any previously selected products
  useEffect(() => {
    if (selectedProd && selectedProd.length > 0) {
      setSelectedProducts(selectedProd);
    }
  }, [selectedProd]);

  const renderNoProductsFound = () => (
    <TableRow>
      <TableCell colSpan={5} className="text-center py-8 text-gray-500">
        <div className="flex flex-col items-center">
          <Package className="h-12 w-12 text-gray-400 mb-2" />
          <p className="text-lg font-medium">Aucun produit trouvé</p>
          <p className="text-sm text-gray-500 mt-1">
            {searchQuery
              ? "Essayez une autre recherche."
              : "Aucun produit n'est disponible."}
          </p>
        </div>
      </TableCell>
    </TableRow>
  );

  const renderLoadingSpinner = () => (
    <TableRow>
      <TableCell colSpan={5}>
        <div className="flex justify-center items-center min-h-[300px]">
          <Spinner />
        </div>
      </TableCell>
    </TableRow>
  );

  return (
    <div className="mx-auto px-2 py-4 md:px-4 md:py-6">
      <Card className="shadow-md border border-gray-200 dark:border-gray-700">
        <CardHeader className="pb-3 border-b dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Link
                to="/orders/add"
                className="mr-3 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                <ArrowLeft className="h-5 w-5" />
              </Link>
              <div className="flex items-center">
                <Package className="h-6 w-6 mr-2 text-primary" />
                <CardTitle className="text-xl md:text-2xl font-bold">
                  Sélectionner des produits
                </CardTitle>
              </div>
            </div>
            <Button
              onClick={handleSaveSelectedProducts}
              className="bg-primary hover:bg-primary/90"
              disabled={selectedProducts.length === 0}
              size="lg"
            >
              Suivant
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
          <CardDescription className="mt-2 text-gray-500 dark:text-gray-400">
            {client?.name ? (
              <>
                Sélectionnez les produits pour le client{" "}
                <span className="font-medium">{client.name}</span>
              </>
            ) : (
              "Sélectionnez les produits pour votre commande"
            )}
          </CardDescription>
        </CardHeader>

        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-4 gap-3">
            <Select
              value={searchStatus}
              onValueChange={(value) => setSearchStatus(value)}
            >
              <SelectTrigger className="md:w-[180px] w-full">
                <SelectValue placeholder="Filtrer par statut" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous</SelectItem>
                <SelectItem value="Disponible">Disponible</SelectItem>
                <SelectItem value="Stock faible">Stock faible</SelectItem>
              </SelectContent>
            </Select>

            <div className="relative w-full md:max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
              <Input
                value={searchQuery}
                onChange={handleChangeSearch}
                className="w-full pl-10"
                placeholder="Rechercher par nom ou référence"
              />
            </div>
          </div>

          <div className="mb-4 p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg flex items-center justify-between">
            <div className="flex items-center gap-2">
              <BoxSelect className="h-5 w-5 text-blue-500" />
              <p className="text-sm text-blue-700 dark:text-blue-400">
                {selectedProducts.length} produit
                {selectedProducts.length !== 1 ? "s" : ""} sélectionné
                {selectedProducts.length !== 1 ? "s" : ""}
              </p>
            </div>
            {selectedProducts.length > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSelectedProducts([])}
                className="h-8 text-blue-600"
              >
                Effacer la sélection
              </Button>
            )}
          </div>

          <div className="rounded-md border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader className="bg-gray-50 dark:bg-gray-800">
                  <TableRow>
                    <TableHead className="w-[50px]"></TableHead>
                    <TableHead className="font-medium">Produit</TableHead>
                    <TableHead className="font-medium whitespace-nowrap">
                      Prix
                    </TableHead>
                    <TableHead className="font-medium whitespace-nowrap">
                      Quantité
                    </TableHead>
                    <TableHead className="font-medium whitespace-nowrap">
                      Statut
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading
                    ? renderLoadingSpinner()
                    : products?.length === 0
                    ? renderNoProductsFound()
                    : products.map((product) => {
                        const QNT = product.quantity_available;
                        const isDisabled = QNT === 0;
                        const isSelected = selectedProducts.includes(
                          product.id
                        );

                        return (
                          <TableRow
                            key={product.id}
                            className={`hover:bg-gray-50 dark:hover:bg-gray-800 ${
                              isDisabled ? "opacity-60" : ""
                            }`}
                          >
                            <TableCell>
                              <Checkbox
                                checked={isSelected}
                                onCheckedChange={() =>
                                  handleSelectProduct(product.id, QNT)
                                }
                                disabled={isDisabled}
                              />
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-3">
                                <img
                                  src={renderImageDir(product.image)}
                                  alt={product.name}
                                  className="h-10 w-10 rounded object-cover hidden sm:block"
                                />
                                <div>
                                  <p className="font-medium line-clamp-2">
                                    {product.name}
                                  </p>
                                  <p className="text-xs text-gray-500">
                                    Réf: {product.reference}
                                  </p>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <span className="font-medium">
                                {product.price} dh
                              </span>
                            </TableCell>
                            <TableCell>
                              <span
                                className={
                                  QNT < 10 && QNT > 0
                                    ? "text-amber-600 font-medium"
                                    : ""
                                }
                              >
                                {QNT}
                              </span>
                            </TableCell>
                            <TableCell>
                              {getStatusBadge(product.status)}
                            </TableCell>
                          </TableRow>
                        );
                      })}
                </TableBody>
              </Table>
            </div>
          </div>

          {!loading && products?.length > 0 && (
            <div className="flex flex-col md:flex-row justify-between items-center mt-4 gap-2">
              <div className="text-sm text-gray-500">
                Affichage de {products.length} sur {totalProducts} produits
              </div>

              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      onClick={() => handleChangePage(Math.max(0, page - 1))}
                      disabled={page === 0}
                      className={
                        page === 0 ? "pointer-events-none opacity-50" : ""
                      }
                    />
                  </PaginationItem>

                  {[...Array(Math.min(totalPages, 5)).keys()].map((i) => (
                    <PaginationItem key={i}>
                      <PaginationLink
                        onClick={() => handleChangePage(i)}
                        isActive={page === i}
                      >
                        {i + 1}
                      </PaginationLink>
                    </PaginationItem>
                  ))}

                  <PaginationItem>
                    <PaginationNext
                      onClick={() =>
                        handleChangePage(Math.min(totalPages - 1, page + 1))
                      }
                      disabled={page >= totalPages - 1}
                      className={
                        page >= totalPages - 1
                          ? "pointer-events-none opacity-50"
                          : ""
                      }
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </CardContent>
        {selectedProducts.length > 0 && (
          <div className="fixed bottom-4 right-4 md:hidden z-50">
            <Button
              onClick={handleSaveSelectedProducts}
              className="bg-primary hover:bg-primary/90 shadow-lg rounded-full h-14 w-14 p-0"
            >
              <ArrowRight className="h-6 w-6" />
            </Button>
          </div>
        )}
      </Card>
    </div>
  );
}
