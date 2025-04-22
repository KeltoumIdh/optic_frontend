import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAuth } from "@/hooks/useAuth";
import axiosClient from "@/api/axiosClient.jsx";
import Spinner from "@/components/Spinner";
import {
  Package,
  Search,
  PlusCircle,
  CreditCard,
  Eye,
  Pencil,
  CheckCircle,
  XCircle,
  Truck,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

function Orders() {
  const { csrf } = useAuth();
  const [orders, setOrders] = useState([]);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalOrders, setTotalOrders] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchStatus, setSearchStatus] = useState("all");
  const [loading, setLoading] = useState(false);

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

  const getOrders = async (page, perPage, query = "", status = "") => {
    try {
      setLoading(true);
      await csrf();
      const res = await axiosClient.get("/api/orders", {
        params: {
          page: page + 1,
          per_page: perPage,
          query: query,
          status: status === "all" ? "" : status,
        },
      });

      const data = res.data?.data ?? [];
      const total = res.data?.total_pages ?? 0;
      const totalOrdersCount = res.data?.total ?? 0;

      setOrders(data);
      setTotalPages(total);
      setTotalOrders(totalOrdersCount);
    } catch (err) {
      console.error("Error fetching orders:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getOrders(page, rowsPerPage, searchQuery, searchStatus);
  }, [page, rowsPerPage, searchQuery, searchStatus]);

  const getOrderStatusBadge = (status) => {
    switch (status) {
      case "in_delivery":
        return (
          <Badge variant="secondary" className="flex items-center gap-1">
            <Truck className="h-3 w-3" /> En livraison
          </Badge>
        );
      case "delivered":
        return (
          <Badge variant="success" className="flex items-center gap-1">
            <CheckCircle className="h-3 w-3" /> Livré
          </Badge>
        );
      case "canceled":
        return (
          <Badge variant="destructive" className="flex items-center gap-1">
            <XCircle className="h-3 w-3" /> Annulé
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="mx-auto px-2 py-4 md:px-4 md:py-6">
      <Card className="shadow-md border border-gray-200 dark:border-gray-700">
        <CardHeader className="pb-3 border-b dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Package className="h-6 w-6 mr-2 text-primary" />
              <CardTitle className="text-xl md:text-2xl font-bold">
                Commandes
              </CardTitle>
            </div>
            <Link to="/orders/add">
              <Button className="bg-primary hover:bg-primary/90">
                <PlusCircle className="mr-2 h-4 w-4" />
                <span className="hidden sm:inline">Nouvelle commande</span>
                <span className="sm:hidden">Ajouter</span>
              </Button>
            </Link>
          </div>
          <CardDescription className="mt-2 text-gray-500 dark:text-gray-400">
            Gérer et suivre toutes les commandes
          </CardDescription>
        </CardHeader>

        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-4 gap-3">
            <div className="flex flex-col md:flex-row gap-3 w-full">
              <Select value={searchStatus} onValueChange={setSearchStatus}>
                <SelectTrigger className="md:w-[180px] w-full">
                  <SelectValue placeholder="Filtrer par statut" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous</SelectItem>
                  <SelectItem value="credit">Crédit</SelectItem>
                  <SelectItem value="notCredit">Pas de crédit</SelectItem>
                </SelectContent>
              </Select>

              <div className="relative w-full md:max-w-sm">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                <Input
                  value={searchQuery}
                  onChange={handleChangeSearch}
                  className="w-full pl-10"
                  placeholder="Rechercher par nom ou téléphone du client"
                />
              </div>
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center items-center min-h-[300px]">
              <Spinner />
            </div>
          ) : (
            <>
              <div className="rounded-md border border-gray-200 dark:border-gray-700 overflow-hidden">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader className="bg-gray-50 dark:bg-gray-800">
                      <TableRow>
                        <TableHead className="font-medium whitespace-nowrap">
                          Commande
                        </TableHead>
                        <TableHead className="font-medium">Client</TableHead>
                        <TableHead className="font-medium whitespace-nowrap hidden sm:table-cell">
                          Prix
                        </TableHead>
                        <TableHead className="font-medium whitespace-nowrap hidden md:table-cell">
                          Prix restant
                        </TableHead>
                        <TableHead className="font-medium whitespace-nowrap hidden sm:table-cell">
                          Crédit
                        </TableHead>
                        <TableHead className="font-medium whitespace-nowrap hidden lg:table-cell">
                          Statut
                        </TableHead>
                        <TableHead className="font-medium text-right">
                          Actions
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {orders?.length === 0 ? (
                        <TableRow>
                          <TableCell
                            colSpan={7}
                            className="text-center py-8 text-gray-500"
                          >
                            Aucune commande trouvée
                          </TableCell>
                        </TableRow>
                      ) : (
                        orders.map((order) => (
                          <TableRow
                            key={order.id}
                            className="hover:bg-gray-50 dark:hover:bg-gray-800"
                          >
                            <TableCell className="font-medium">
                              #{order.id}
                            </TableCell>
                            <TableCell>
                              <div>
                                <p className="line-clamp-1">
                                  {order.client.name} {order.client.lname}
                                </p>
                                <div className="flex gap-2 items-center sm:hidden">
                                  <Badge
                                    variant={
                                      order.is_credit === 1
                                        ? "destructive"
                                        : "success"
                                    }
                                    className="whitespace-nowrap text-xs"
                                  >
                                    <CreditCard className="h-2 w-2 mr-1" />
                                    {order.remain_price === "0.00"
                                      ? "Payé"
                                      : `${order.remain_price} dh`}
                                  </Badge>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell className="hidden sm:table-cell">
                              {order.total_price} dh
                            </TableCell>
                            <TableCell
                              className={`hidden md:table-cell ${
                                order.remain_price === "0.00"
                                  ? "text-green-600 font-medium"
                                  : "text-red-600 font-medium"
                              }`}
                            >
                              {order.remain_price} dh
                            </TableCell>
                            <TableCell className="hidden sm:table-cell">
                              <Badge
                                variant={
                                  order.is_credit === 1
                                    ? "destructive"
                                    : "success"
                                }
                                className="whitespace-nowrap"
                              >
                                <CreditCard className="h-3 w-3 mr-1" />
                                {order.is_credit === 1 ? "Oui" : "Non"}
                              </Badge>
                            </TableCell>
                            <TableCell className="hidden lg:table-cell">
                              {getOrderStatusBadge(order.order_status)}
                            </TableCell>
                            <TableCell className="text-right space-x-1">
                              <Link to={`/orders/details/${order.id}`}>
                                <Button
                                  variant="secondary"
                                  size="sm"
                                  className="h-8 px-2"
                                >
                                  <Eye className="h-4 w-4" />
                                  <span className="sr-only md:not-sr-only md:ml-2">
                                    Détails
                                  </span>
                                </Button>
                              </Link>
                              <Link to={`/orders/edit/${order.id}`}>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="h-8 px-2"
                                >
                                  <Pencil className="h-4 w-4" />
                                  <span className="sr-only md:not-sr-only md:ml-2">
                                    Modifier
                                  </span>
                                </Button>
                              </Link>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>
              </div>

              {orders.length > 0 && (
                <div className="flex flex-col md:flex-row justify-between items-center mt-4 gap-2">
                  <div className="text-sm text-gray-500">
                    Affichage de {orders.length} sur {totalOrders} commandes
                  </div>

                  <Pagination>
                    <PaginationContent>
                      <PaginationItem>
                        <PaginationPrevious
                          onClick={() =>
                            handleChangePage(Math.max(0, page - 1))
                          }
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
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default Orders;
