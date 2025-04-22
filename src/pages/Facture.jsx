import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";
import { backEndUrl } from "@/helpers/utils";
import { useAuth } from "@/hooks/useAuth";
import axiosClient from "@/api/axiosClient";
import Spinner from "@/components/Spinner";
import {
  Eye,
  Download,
  Search,
  FileText,
  CreditCard,
  ArrowUpDown,
  Calendar,
  CheckCircle,
  Truck,
  XCircle,
} from "lucide-react";

export const FactureTable = () => {
  const [invoices, setInvoices] = useState([]);
  const [filteredInvoices, setFilteredInvoices] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [processingId, setProcessingId] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const [sortConfig, setSortConfig] = useState({
    key: "created_at",
    direction: "desc",
  });

  const itemsPerPage = 10;
  const { csrf } = useAuth();

  // Handle opening PDF in new tab
  const showPDF = (url) => {
    window.open(url, "_blank");
  };

  // Generate PDF invoice
  const handleGeneratePDF = async (id) => {
    try {
      setProcessingId(id);
      await csrf();

      const { data: filePath } = await axiosClient.post(
        `/api/download-invoice/${id}`
      );

      const alink = document.createElement("a");
      alink.href = filePath ?? "";
      alink.setAttribute("target", "_blank");
      document.body.appendChild(alink);
      alink.click();

      fetchInvoices();
    } catch (err) {
      console.error("Error generating PDF:", err);
    } finally {
      setProcessingId(null);
    }
  };

  // Fetch invoices data
  const fetchInvoices = async () => {
    try {
      setIsLoading(true);
      await csrf();
      const response = await axiosClient.get("/api/order/facture");

      if (response.status === 200) {
        // Add created_at to each invoice for sorting if it doesn't exist
        const invoicesWithDates = response.data.map((invoice) => ({
          ...invoice,
          created_at: invoice.created_at || new Date().toISOString(),
        }));

        setInvoices(invoicesWithDates);
        sortData(invoicesWithDates, sortConfig.key, sortConfig.direction);
      }
    } catch (error) {
      console.error("Error fetching invoices:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle column sorting
  const handleSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  // Apply sorting to the data
  const sortData = (data, key, direction) => {
    const sortedData = [...data].sort((a, b) => {
      if (key === "created_at") {
        return direction === "asc"
          ? new Date(a.created_at) - new Date(b.created_at)
          : new Date(b.created_at) - new Date(a.created_at);
      }

      if (a[key] < b[key]) return direction === "asc" ? -1 : 1;
      if (a[key] > b[key]) return direction === "asc" ? 1 : -1;
      return 0;
    });

    setFilteredInvoices(sortedData);
  };

  // Filter data based on search query
  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredInvoices(invoices);
    } else {
      const query = searchQuery.toLowerCase();
      const filtered = invoices.filter(
        (invoice) =>
          (invoice.name && invoice.name.toLowerCase().includes(query)) ||
          (invoice.lname && invoice.lname.toLowerCase().includes(query)) ||
          (invoice.phone && invoice.phone.includes(query))
      );
      setFilteredInvoices(filtered);
    }
  }, [searchQuery, invoices]);

  // Apply sorting when sort config changes
  useEffect(() => {
    sortData(invoices, sortConfig.key, sortConfig.direction);
  }, [sortConfig, invoices]);

  // Fetch data on component mount
  useEffect(() => {
    fetchInvoices();
  }, []);

  // Get paginated data
  const getPaginatedData = () => {
    const startIndex = currentPage * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredInvoices.slice(startIndex, endIndex);
  };

  // Get payment status badge
  const getStatusBadge = (invoice) => {
    if (!invoice) return <Badge variant="outline">Non défini</Badge>;

    // Variables pour déterminer l'état réel
    const isCredit =
      invoice.is_credit === 1 || parseFloat(invoice.remain_price) > 0;
    const isDelivered = invoice.order_status === "delivered";
    const orderStatus = invoice.order_status || "";
    const paymentStatus = invoice.payment_status || "";

    // Cas 1: Livré et complètement payé
    if (isDelivered && !isCredit) {
      return (
        <Badge variant="success" className="flex items-center gap-1">
          <CheckCircle className="h-3 w-3" /> Complété
        </Badge>
      );
    }

    // Cas 2: Livré mais avec crédit
    if (isDelivered && isCredit) {
      return (
        <Badge variant="destructive" className="flex items-center gap-1">
          <CreditCard className="h-3 w-3" /> Livré, crédit
        </Badge>
      );
    }

    // Cas 3: En livraison et payé
    if (orderStatus === "in_delivery" && !isCredit) {
      return (
        <Badge variant="warning" className="flex items-center gap-1">
          <Truck className="h-3 w-3" /> En livraison, payé
        </Badge>
      );
    }

    // Cas 4: En livraison avec crédit
    if (orderStatus === "in_delivery" && isCredit) {
      return (
        <Badge variant="destructive" className="flex items-center gap-1">
          <Truck className="h-3 w-3" /> En livraison, crédit
        </Badge>
      );
    }

    // Cas 5: Annulé
    if (orderStatus === "canceled") {
      return (
        <Badge variant="secondary" className="flex items-center gap-1">
          <XCircle className="h-3 w-3" /> Annulé
        </Badge>
      );
    }

    // Si aucun cas précis n'est détecté, on utilise l'ancienne logique basée sur payment_status
    switch (paymentStatus.toLowerCase()) {
      case "paid":
      case "payé":
      case "completed":
        return (
          <Badge variant="success" className="flex items-center gap-1">
            <CreditCard className="h-3 w-3" /> Payé
          </Badge>
        );
      case "pending":
      case "en attente":
        return (
          <Badge variant="warning" className="flex items-center gap-1">
            <Calendar className="h-3 w-3" /> En attente
          </Badge>
        );
      case "credit":
      case "crédit":
        return (
          <Badge variant="destructive" className="flex items-center gap-1">
            <CreditCard className="h-3 w-3" /> Crédit
          </Badge>
        );
      default:
        return (
          <Badge variant="outline">{paymentStatus || "Status inconnu"}</Badge>
        );
    }
  };

  // Format date relative to now
  const formatDate = (dateString) => {
    if (!dateString) return "Date inconnue";
    try {
      return formatDistanceToNow(new Date(dateString), {
        addSuffix: true,
        locale: fr,
      });
    } catch (e) {
      return "Date invalide";
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="mx-auto px-2 py-4 md:px-4 md:py-6">
      <Card className="shadow-md border border-gray-200 dark:border-gray-700">
        <CardHeader className="pb-3 border-b dark:border-gray-700">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center">
              <FileText className="h-6 w-6 mr-2 text-primary" />
              <div>
                <CardTitle className="text-xl md:text-2xl font-bold">
                  Factures
                </CardTitle>
                <CardDescription className="mt-1 text-gray-500 dark:text-gray-400">
                  Gérer et visualiser toutes les factures clients
                </CardDescription>
              </div>
            </div>
            <div className="flex items-center relative w-full md:w-auto">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
              <Input
                placeholder="Rechercher par nom ou téléphone"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 w-full md:w-80"
              />
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-4">
          <div className="rounded-md border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader className="bg-gray-50 dark:bg-gray-800">
                  <TableRow>
                    <TableHead className="font-medium">
                      <Button
                        variant="ghost"
                        onClick={() => handleSort("name")}
                        className="flex items-center p-0 h-auto font-medium"
                      >
                        Client <ArrowUpDown className="ml-2 h-3 w-3" />
                      </Button>
                    </TableHead>
                    <TableHead className="font-medium">
                      <Button
                        variant="ghost"
                        onClick={() => handleSort("phone")}
                        className="flex items-center p-0 h-auto font-medium"
                      >
                        Téléphone <ArrowUpDown className="ml-2 h-3 w-3" />
                      </Button>
                    </TableHead>
                    <TableHead className="font-medium hidden md:table-cell">
                      <Button
                        variant="ghost"
                        onClick={() => handleSort("payment_method")}
                        className="flex items-center p-0 h-auto font-medium"
                      >
                        Méthode <ArrowUpDown className="ml-2 h-3 w-3" />
                      </Button>
                    </TableHead>
                    <TableHead className="font-medium">Statut</TableHead>
                    <TableHead className="font-medium hidden md:table-cell">
                      <Button
                        variant="ghost"
                        onClick={() => handleSort("created_at")}
                        className="flex items-center p-0 h-auto font-medium"
                      >
                        Date <ArrowUpDown className="ml-2 h-3 w-3" />
                      </Button>
                    </TableHead>
                    <TableHead className="font-medium text-right">
                      Actions
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {getPaginatedData().length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={6}
                        className="text-center py-8 text-gray-500"
                      >
                        Aucune facture trouvée
                      </TableCell>
                    </TableRow>
                  ) : (
                    getPaginatedData().map((invoice) => (
                      <TableRow
                        key={invoice.id}
                        className="hover:bg-gray-50 dark:hover:bg-gray-800"
                      >
                        <TableCell>
                          <div>
                            <p className="font-medium">
                              {invoice.name} {invoice.lname}
                            </p>
                            <p className="text-xs text-gray-500 md:hidden">
                              {invoice.phone}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                          {invoice.phone}
                        </TableCell>
                        <TableCell className="hidden md:table-cell capitalize">
                          {invoice.payment_method || "Non défini"}
                        </TableCell>
                        <TableCell>{getStatusBadge(invoice)}</TableCell>
                        <TableCell className="hidden md:table-cell text-gray-500 text-sm">
                          {formatDate(invoice.created_at)}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            {invoice.invoice ? (
                              <Button
                                variant="success"
                                size="sm"
                                className="bg-emerald-600 hover:bg-emerald-700 h-8"
                                onClick={() =>
                                  showPDF(
                                    `${backEndUrl}/assets/uploads/pdf/${invoice.invoice}`
                                  )
                                }
                              >
                                <Eye className="h-4 w-4 mr-1" />
                                <span className="hidden md:inline">Voir</span>
                              </Button>
                            ) : (
                              <Button
                                variant="outline"
                                size="sm"
                                className="h-8 border-emerald-600 text-emerald-600 hover:bg-emerald-50"
                                onClick={() => handleGeneratePDF(invoice.id)}
                                disabled={processingId === invoice.id}
                              >
                                {processingId === invoice.id ? (
                                  <>
                                    <Spinner className="h-3 w-3 mr-1" />
                                    <span className="hidden md:inline">
                                      Génération...
                                    </span>
                                  </>
                                ) : (
                                  <>
                                    <Download className="h-4 w-4 mr-1" />
                                    <span className="hidden md:inline">
                                      Générer
                                    </span>
                                  </>
                                )}
                              </Button>
                            )}
                            <Link to={`/orders/details/${invoice.id}`}>
                              <Button
                                variant="outline"
                                size="sm"
                                className="h-8"
                              >
                                <Eye className="h-4 w-4 md:mr-1" />
                                <span className="hidden md:inline">
                                  Détails
                                </span>
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

          {filteredInvoices.length > 0 && (
            <div className="flex items-center justify-between mt-4">
              <div className="text-sm text-gray-500">
                Affichage de {Math.min(filteredInvoices.length, itemsPerPage)}{" "}
                sur {filteredInvoices.length} factures
              </div>

              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      onClick={() =>
                        setCurrentPage(Math.max(0, currentPage - 1))
                      }
                      className={
                        currentPage === 0
                          ? "pointer-events-none opacity-50"
                          : ""
                      }
                    />
                  </PaginationItem>

                  {Array.from({
                    length: Math.min(
                      5,
                      Math.ceil(filteredInvoices.length / itemsPerPage)
                    ),
                  }).map((_, i) => (
                    <PaginationItem key={i}>
                      <PaginationLink
                        onClick={() => setCurrentPage(i)}
                        isActive={currentPage === i}
                      >
                        {i + 1}
                      </PaginationLink>
                    </PaginationItem>
                  ))}

                  <PaginationItem>
                    <PaginationNext
                      onClick={() =>
                        setCurrentPage(
                          Math.min(
                            Math.ceil(filteredInvoices.length / itemsPerPage) -
                              1,
                            currentPage + 1
                          )
                        )
                      }
                      className={
                        currentPage >=
                        Math.ceil(filteredInvoices.length / itemsPerPage) - 1
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
};
