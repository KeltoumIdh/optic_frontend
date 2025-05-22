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
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { useAuth } from "@/hooks/useAuth.jsx";
import axiosClient from "@/api/axiosClient.jsx";
import { renderImageDir } from "@/helpers/utils";
import { useToast } from "@/components/ui/use-toast";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  User,
  Search,
  Plus,
  Eye,
  Edit,
  Phone,
  MapPin,
  Check,
  X,
  AlertTriangle,
} from "lucide-react";
import Spinner from "@/components/Spinner";

// Badge component for client status
const Badge = ({ children, variant = "default", className = "" }) => {
  const getVariantClass = () => {
    switch (variant) {
      case "success":
        return "bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100";
      case "warning":
        return "bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100";
      case "destructive":
        return "bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100";
      case "outline":
        return "bg-transparent border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300";
      default:
        return "bg-primary text-white";
    }
  };

  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${getVariantClass()} ${className}`}
    >
      {children}
    </span>
  );
};

export default function Clients() {
  const [clients, setClients] = useState([]);
  const [rowsPerPage] = useState(10);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalClients, setTotalClients] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { csrf } = useAuth();

  const handleChangePage = (newPage) => {
    setPage(newPage);
  };

  const handleChangeSearch = (event) => {
    const value = event.target.value;
    setSearchQuery(value);

    // Reset to first page when search changes
    if (page !== 0) {
      setPage(0);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      setPage(0); // Reset to first page on new search
      getClients(0, rowsPerPage, searchQuery);
    }
  };

  const getClients = async (page, perPage, query = "") => {
    try {
      setIsLoading(true);
      await csrf();
      const res = await axiosClient.get("/api/clients", {
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
      toast({
        title: "Erreur",
        description: "Impossible de récupérer la liste des clients",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getClients(page, rowsPerPage, searchQuery);
  }, [page, rowsPerPage, searchQuery]);

  // Generate pagination items
  const renderPaginationItems = () => {
    if (totalPages <= 1) return null;

    const items = [];
    const maxVisiblePages = 5;

    // Calculate range of pages to show
    let startPage = Math.max(
      0,
      Math.min(
        page - Math.floor(maxVisiblePages / 2),
        totalPages - maxVisiblePages
      )
    );
    let endPage = Math.min(startPage + maxVisiblePages - 1, totalPages - 1);

    // Adjust if we're showing fewer than maxVisiblePages
    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(0, endPage - maxVisiblePages + 1);
    }

    // First page
    if (startPage > 0) {
      items.push(
        <PaginationItem key="first">
          <PaginationLink onClick={() => handleChangePage(0)}>1</PaginationLink>
        </PaginationItem>
      );

      if (startPage > 1) {
        items.push(
          <PaginationItem key="ellipsis-start">
            <PaginationLink disabled>...</PaginationLink>
          </PaginationItem>
        );
      }
    }

    // Pages
    for (let i = startPage; i <= endPage; i++) {
      items.push(
        <PaginationItem key={i}>
          <PaginationLink
            isActive={page === i}
            onClick={() => handleChangePage(i)}
          >
            {i + 1}
          </PaginationLink>
        </PaginationItem>
      );
    }

    // Last page
    if (endPage < totalPages - 1) {
      if (endPage < totalPages - 2) {
        items.push(
          <PaginationItem key="ellipsis-end">
            <PaginationLink disabled>...</PaginationLink>
          </PaginationItem>
        );
      }

      items.push(
        <PaginationItem key="last">
          <PaginationLink onClick={() => handleChangePage(totalPages - 1)}>
            {totalPages}
          </PaginationLink>
        </PaginationItem>
      );
    }

    return items;
  };

  // Render empty state
  const renderEmptyState = () => (
    <TableRow>
      <TableCell
        colSpan={6}
        className="text-center py-8 text-gray-500 dark:text-gray-400"
      >
        <div className="flex flex-col items-center justify-center space-y-3">
          <AlertTriangle className="h-8 w-8 text-amber-500 opacity-40" />
          <p>Aucun client trouvé</p>
        </div>
      </TableCell>
    </TableRow>
  );

  return (
    <div className="mx-auto px-2 py-4 md:px-4 md:py-6">
      <Card className="shadow-md border border-gray-200 dark:border-gray-700">
        <CardHeader className="pb-4 border-b dark:border-gray-700">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-center">
              <User className="h-6 w-6 mr-2 text-primary" />
              <div>
                <CardTitle className="text-xl md:text-2xl font-bold">
                  Clients
                </CardTitle>
                <CardDescription className="mt-1">
                  {totalClients} client{totalClients !== 1 ? "s" : ""} au total
                </CardDescription>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
              <div className="relative w-full md:w-64">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500 dark:text-gray-400" />
                <Input
                  value={searchQuery}
                  onChange={handleChangeSearch}
                  onKeyDown={handleKeyPress}
                  className="pl-10 pr-4 py-2 w-full text-sm"
                  placeholder="Rechercher un client..."
                />
              </div>
              <Link to="/clients/add">
                <Button className="w-full sm:w-auto bg-primary hover:bg-primary/90">
                  <Plus className="h-4 w-4 mr-2" />
                  Ajouter un client
                </Button>
              </Link>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="relative overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Client</TableHead>
                  <TableHead>Numéro de téléphone</TableHead>
                  <TableHead>Ville</TableHead>
                  <TableHead>Commandes</TableHead>
                  <TableHead>Crédit</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-10">
                      <div className="flex justify-center items-center">
                        <Spinner />
                      </div>
                    </TableCell>
                  </TableRow>
                ) : clients.length === 0 ? (
                  renderEmptyState()
                ) : (
                  clients.map((client) => (
                    <TableRow
                      key={client.id}
                      className="hover:bg-gray-50 dark:hover:bg-gray-800/50"
                    >
                      <TableCell className="min-w-[200px]">
                        <div className="flex items-center space-x-3">
                          <div className="h-10 w-10 rounded-full overflow-hidden bg-gray-100   flex-shrink-0">
                            {client.image ? (
                              <img
                                src={renderImageDir(client.image, "client")}
                                alt={client.name}
                                className="h-full w-full object-cover"
                              />
                            ) : (
                              <User className="h-6 w-6 m-auto text-gray-400" />
                            )}
                          </div>
                          <div>
                            <div className="font-medium text-gray-900 dark:text-gray-100">
                              {client.name} {client.lname}
                            </div>
                            <div className="text-xs text-gray-500 dark:text-gray-400">
                              Client #{client.id}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <Phone className="h-4 w-4 mr-2 text-gray-400" />
                          <span>{client.phone}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <MapPin className="h-4 w-4 mr-2 text-gray-400" />
                          <span>{client.city || "N/A"}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <span className="font-medium">
                            {client.orders_count || 0}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        {client.has_credit ? (
                          <Badge
                            variant="warning"
                            className="flex items-center space-x-1"
                          >
                            <Check className="h-3 w-3 mr-0.5" />
                            <span>Oui</span>
                          </Badge>
                        ) : (
                          <Badge
                            variant="outline"
                            className="flex items-center space-x-1"
                          >
                            <X className="h-3 w-3 mr-0.5" />
                            <span>Non</span>
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-right space-x-2 whitespace-nowrap">
                        <Link to={`/clients/details/${client.id}`}>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0"
                          >
                            <span className="sr-only">Voir les détails</span>
                            <Eye className="h-4 w-4" />
                          </Button>
                        </Link>
                        <Link to={`/clients/edit/${client.id}`}>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0"
                          >
                            <span className="sr-only">Modifier</span>
                            <Edit className="h-4 w-4" />
                          </Button>
                        </Link>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center py-4 border-t border-gray-200 dark:border-gray-700">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      onClick={() => handleChangePage(Math.max(0, page - 1))}
                      disabled={page === 0}
                    />
                  </PaginationItem>

                  {renderPaginationItems()}

                  <PaginationItem>
                    <PaginationNext
                      onClick={() =>
                        handleChangePage(Math.min(totalPages - 1, page + 1))
                      }
                      disabled={page === totalPages - 1}
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
