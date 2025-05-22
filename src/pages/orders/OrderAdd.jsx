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
import { Badge } from "@/components/ui/badge";
import { useCheckoutStore } from "../../store";
import { useAuth } from "@/hooks/useAuth";
import axiosClient from "@/api/axiosClient";
import { renderImageDir } from "@/helpers/utils";
import Spinner from "@/components/Spinner";
import {
  Users,
  Search,
  PlusCircle,
  UserCheck,
  ArrowLeft,
  CreditCard,
  ShoppingCart,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function OrderAdd() {
  const { csrf } = useAuth();
  const { setClient } = useCheckoutStore();
  const [clients, setClients] = useState([]);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalClients, setTotalClients] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);

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

  const getClients = async (page, perPage, query = "") => {
    try {
      setIsLoading(true);
      await csrf();
      const res = await axiosClient.get("/api/orders/add", {
        params: {
          page: page + 1,
          per_page: perPage,
          query: query,
        },
      });

      const data = res.data?.data ?? [];
      const total = res.data?.total_pages ?? 0;
      const totalClientsCount = res.data?.total ?? 0;

      setClients(data);
      setTotalPages(total);
      setTotalClients(totalClientsCount);
    } catch (err) {
      console.error("Error fetching clients:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getClients(page, rowsPerPage, searchQuery);
  }, [page, rowsPerPage, searchQuery]);

  const renderNoClientsFound = () => (
    <TableRow>
      <TableCell colSpan={6} className="text-center py-8 text-gray-500">
        <div className="flex flex-col items-center">
          <UserCheck className="h-12 w-12 text-gray-400 mb-2" />
          <p className="text-lg font-medium">Aucun client trouvé</p>
          <p className="text-sm text-gray-500 mt-1">
            {searchQuery
              ? "Essayez une autre recherche."
              : "Aucun client n'est disponible."}
          </p>
        </div>
      </TableCell>
    </TableRow>
  );

  const renderLoadingSpinner = () => (
    <TableRow>
      <TableCell colSpan={6}>
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
                to="/orders"
                className="mr-3 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                <ArrowLeft className="h-5 w-5" />
              </Link>
              <div className="flex items-center">
                <Users className="h-6 w-6 mr-2 text-primary" />
                <CardTitle className="text-xl md:text-2xl font-bold">
                  Sélectionner un client
                </CardTitle>
              </div>
            </div>
            <Link to="/clients/add">
              <Button className="bg-primary hover:bg-primary/90">
                <PlusCircle className="mr-2 h-4 w-4" />
                Client invité
              </Button>
            </Link>
          </div>
          <CardDescription className="mt-2 text-gray-500 dark:text-gray-400">
            Sélectionnez un client pour créer une nouvelle commande
          </CardDescription>
        </CardHeader>

        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-4 gap-3">
            <div className="relative w-full md:max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
              <Input
                value={searchQuery}
                onChange={handleChangeSearch}
                className="w-full pl-10"
                placeholder="Rechercher par nom, email, ou téléphone"
              />
            </div>
          </div>

          <div className="rounded-md border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader className="bg-gray-50  ">
                  <TableRow>
                    <TableHead className="font-medium">Client</TableHead>
                    <TableHead className="font-medium whitespace-nowrap hidden md:table-cell">
                      Numéro de téléphone
                    </TableHead>
                    <TableHead className="font-medium whitespace-nowrap hidden md:table-cell">
                      Ville
                    </TableHead>
                    <TableHead className="font-medium whitespace-nowrap hidden lg:table-cell">
                      Nbr Commandes
                    </TableHead>
                    <TableHead className="font-medium whitespace-nowrap">
                      Crédit
                    </TableHead>
                    <TableHead className="font-medium text-right">
                      Actions
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading
                    ? renderLoadingSpinner()
                    : clients?.length === 0
                    ? renderNoClientsFound()
                    : clients.map((client) => (
                        <TableRow
                          key={client.id}
                          className="hover:bg-gray-50 dark:hover:bg-gray-800"
                        >
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <Avatar className="h-9 w-9">
                                <AvatarImage
                                  src={renderImageDir(client.image)}
                                  alt={client.name}
                                />
                                <AvatarFallback>
                                  {client.name ? client.name.charAt(0) : "C"}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="font-medium line-clamp-1">
                                  {client.name} {client.lname}
                                </p>
                                <p className="text-xs text-gray-500 hidden sm:block">
                                  {client.email}
                                </p>
                                <p className="text-xs text-gray-500 md:hidden">
                                  {client.phone}
                                </p>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="hidden md:table-cell">
                            {client.phone}
                          </TableCell>
                          <TableCell className="hidden md:table-cell">
                            {client.city}
                          </TableCell>
                          <TableCell className="text-center hidden lg:table-cell">
                            {client.orders_count}
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant={
                                client.has_credit ? "destructive" : "success"
                              }
                              className="whitespace-nowrap"
                            >
                              <CreditCard className="h-3 w-3 mr-1" />
                              {client.has_credit ? "Oui" : "Non"}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <Link
                              onClick={() => setClient(client.id)}
                              to={`/orders/products/add/${client.id}`}
                              className="inline-block"
                            >
                              <Button className="bg-primary hover:bg-primary/90 whitespace-nowrap">
                                <ShoppingCart className="mr-2 h-4 w-4 md:mr-1" />
                                <span className="hidden md:inline">
                                  Créer commande
                                </span>
                                <span className="md:hidden">Commander</span>
                              </Button>
                            </Link>
                          </TableCell>
                        </TableRow>
                      ))}
                </TableBody>
              </Table>
            </div>
          </div>

          {!isLoading && clients?.length > 0 && (
            <div className="flex flex-col md:flex-row justify-between items-center mt-4 gap-2">
              <div className="text-sm text-gray-500">
                Affichage de {clients.length} sur {totalClients} clients
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
      </Card>
    </div>
  );
}
