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
  Search,
  FileText,
  CreditCard,
  ArrowUpDown,
  Calendar,
  CheckCircle,
  Truck,
  XCircle,
  FileCheck,
  Banknote,
  AlertCircle,
} from "lucide-react";

export const DataTable = () => {
  const [payments, setPayments] = useState([]);
  const [filteredPayments, setFilteredPayments] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const [sortConfig, setSortConfig] = useState({
    key: "created_at",
    direction: "desc",
  });

  const itemsPerPage = 10;
  const { csrf } = useAuth();

  // Afficher le fichier de paiement dans un nouvel onglet
  const showFile = (url) => {
    window.open(url, "_blank");
  };

  // Récupération des données
  const fetchPayments = async () => {
    try {
      setIsLoading(true);
      await csrf();
      const response = await axiosClient.get("/api/order/check");

      if (response.status === 200) {
        // Ajouter created_at si nécessaire pour le tri
        const paymentsWithDates = response.data.map((payment) => ({
          ...payment,
          created_at: payment.created_at || new Date().toISOString(),
        }));

        setPayments(paymentsWithDates);
        sortData(paymentsWithDates, sortConfig.key, sortConfig.direction);
      }
    } catch (error) {
      console.error("Erreur lors de la récupération des paiements:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Gestion du tri des colonnes
  const handleSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  // Appliquer le tri aux données
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

    setFilteredPayments(sortedData);
  };

  // Filtrer les données en fonction de la recherche
  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredPayments(payments);
    } else {
      const query = searchQuery.toLowerCase();
      const filtered = payments.filter(
        (payment) =>
          (payment.name && payment.name.toLowerCase().includes(query)) ||
          (payment.lname && payment.lname.toLowerCase().includes(query)) ||
          (payment.phone && payment.phone.includes(query)) ||
          (payment.payment_method &&
            payment.payment_method.toLowerCase().includes(query))
      );
      setFilteredPayments(filtered);
    }
  }, [searchQuery, payments]);

  // Appliquer le tri lorsque la configuration change
  useEffect(() => {
    sortData(payments, sortConfig.key, sortConfig.direction);
  }, [sortConfig, payments]);

  // Charger les données au montage du composant
  useEffect(() => {
    fetchPayments();
  }, []);

  // Obtenir les données paginées
  const getPaginatedData = () => {
    const startIndex = currentPage * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredPayments.slice(startIndex, endIndex);
  };

  // Obtenir le badge pour la méthode de paiement
  const getPaymentMethodBadge = (method) => {
    if (!method) return <Badge variant="outline">Non défini</Badge>;

    switch (method.toLowerCase()) {
      case "cash":
        return (
          <Badge
            variant="outline"
            className="flex items-center gap-1 bg-green-50"
          >
            <Banknote className="h-3 w-3" /> Espèces
          </Badge>
        );
      case "check":
      case "chèque":
      case "cheque":
        return (
          <Badge
            variant="outline"
            className="flex items-center gap-1 bg-blue-50"
          >
            <FileCheck className="h-3 w-3" /> Chèque
          </Badge>
        );
      case "traita":
      case "traite":
        return (
          <Badge
            variant="outline"
            className="flex items-center gap-1 bg-purple-50"
          >
            <FileText className="h-3 w-3" /> Traite
          </Badge>
        );
      default:
        return <Badge variant="outline">{method}</Badge>;
    }
  };

  // Obtenir le badge de statut intelligent
  const getStatusBadge = (payment) => {
    if (!payment) return <Badge variant="outline">Non défini</Badge>;

    // Variables pour déterminer l'état réel
    const hasRemainingAmount = parseFloat(payment.remain_price) > 0;
    const isCredit = payment.is_credit === 1 || hasRemainingAmount;
    const orderStatus = payment.order_status || "";
    const paymentStatus = payment.payment_status || "";
    const hasPaymentFile = !!payment.payement_file;

    // Cas 1: Commande annulée
    if (orderStatus === "canceled") {
      return (
        <Badge variant="destructive" className="flex items-center gap-1">
          <XCircle className="h-3 w-3" /> Annulé
        </Badge>
      );
    }

    // Cas 2: Commande livrée sans crédit
    if (orderStatus === "delivered" && !isCredit) {
      return (
        <Badge variant="success" className="flex items-center gap-1">
          <CheckCircle className="h-3 w-3" /> Complété
        </Badge>
      );
    }

    // Cas 3: En crédit mais avec fichier de paiement à traiter
    if (isCredit && hasPaymentFile) {
      return (
        <Badge variant="warning" className="flex items-center gap-1">
          <AlertCircle className="h-3 w-3" /> Attente validation
        </Badge>
      );
    }

    // Cas 4: En crédit sans fichier de paiement
    if (isCredit && !hasPaymentFile) {
      return (
        <Badge variant="destructive" className="flex items-center gap-1">
          <CreditCard className="h-3 w-3" /> Paiement en attente
        </Badge>
      );
    }

    // Cas 5: En cours de livraison
    if (orderStatus === "in_delivery") {
      return (
        <Badge variant="warning" className="flex items-center gap-1">
          <Truck className="h-3 w-3" /> En livraison
        </Badge>
      );
    }

    // Si aucun cas précis n'est détecté, on utilise payment_status
    switch (paymentStatus.toLowerCase()) {
      case "paid":
      case "payé":
      case "completed":
        return (
          <Badge variant="success" className="flex items-center gap-1">
            <CheckCircle className="h-3 w-3" /> Payé
          </Badge>
        );
      case "pending":
      case "en attente":
        return (
          <Badge variant="warning" className="flex items-center gap-1">
            <Calendar className="h-3 w-3" /> En attente
          </Badge>
        );
      default:
        return (
          <Badge variant="outline">{paymentStatus || "État inconnu"}</Badge>
        );
    }
  };

  // Formater la date en temps relatif
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

  // Formater le montant restant avec un style approprié
  const formatRemainingAmount = (amount) => {
    if (!amount) return "0.00 dh";
    const value = parseFloat(amount);
    return (
      <span
        className={
          value > 0 ? "text-red-600 font-medium" : "text-green-600 font-medium"
        }
      >
        {value.toFixed(2)} dh
      </span>
    );
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
              <Banknote className="h-6 w-6 mr-2 text-primary" />
              <div>
                <CardTitle className="text-xl md:text-2xl font-bold">
                  Gestion des Paiements Bancaires
                </CardTitle>
                <CardDescription className="mt-1 text-gray-500 dark:text-gray-400">
                  Suivre et traiter les paiements par chèques et traites
                </CardDescription>
              </div>
            </div>
            <div className="flex items-center relative w-full md:w-auto">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
              <Input
                placeholder="Rechercher par nom, téléphone ou méthode"
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
                    <TableHead className="font-medium hidden md:table-cell">
                      <Button
                        variant="ghost"
                        onClick={() => handleSort("phone")}
                        className="flex items-center p-0 h-auto font-medium"
                      >
                        Téléphone <ArrowUpDown className="ml-2 h-3 w-3" />
                      </Button>
                    </TableHead>
                    <TableHead className="font-medium">
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
                        onClick={() => handleSort("remain_price")}
                        className="flex items-center p-0 h-auto font-medium"
                      >
                        Reste à payer <ArrowUpDown className="ml-2 h-3 w-3" />
                      </Button>
                    </TableHead>
                    <TableHead className="font-medium hidden lg:table-cell">
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
                        colSpan={7}
                        className="text-center py-8 text-gray-500"
                      >
                        <div className="flex flex-col items-center justify-center">
                          <AlertCircle className="h-10 w-10 text-gray-400 mb-3" />
                          <p className="text-lg font-medium">
                            Aucun paiement trouvé
                          </p>
                          <p className="text-sm">
                            Essayez de modifier vos critères de recherche
                          </p>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : (
                    getPaginatedData().map((payment) => (
                      <TableRow
                        key={payment.id}
                        className="hover:bg-gray-50 dark:hover:bg-gray-800"
                      >
                        <TableCell>
                          <div>
                            <p className="font-medium">
                              {payment.name} {payment.lname}
                            </p>
                            <p className="text-xs text-gray-500 md:hidden">
                              {payment.phone}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                          {payment.phone}
                        </TableCell>
                        <TableCell>
                          {getPaymentMethodBadge(payment.payment_method)}
                        </TableCell>
                        <TableCell>{getStatusBadge(payment)}</TableCell>
                        <TableCell className="hidden md:table-cell">
                          {formatRemainingAmount(payment.remain_price)}
                        </TableCell>
                        <TableCell className="hidden lg:table-cell text-gray-500 text-sm">
                          {formatDate(payment.created_at)}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end space-x-1">
                            {payment.payement_file ? (
                              <Button
                                variant="outline"
                                size="sm"
                                className="h-8 border-blue-600 text-blue-600 hover:bg-blue-50"
                                onClick={() =>
                                  showFile(
                                    `${backEndUrl}${payment.payement_file}`
                                  )
                                }
                              >
                                <FileText className="h-4 w-4 md:mr-1" />
                                <span className="hidden md:inline">
                                  Voir fichier
                                </span>
                              </Button>
                            ) : (
                              <Button
                                variant="outline"
                                size="sm"
                                className="h-8 opacity-50 cursor-not-allowed"
                                disabled={true}
                              >
                                <FileText className="h-4 w-4 md:mr-1" />
                                <span className="hidden md:inline">
                                  Aucun fichier
                                </span>
                              </Button>
                            )}
                            <Link to={`/orders/details/${payment.id}`}>
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

          {filteredPayments.length > 0 && (
            <div className="flex items-center justify-between mt-4">
              <div className="text-sm text-gray-500">
                Affichage de {Math.min(filteredPayments.length, itemsPerPage)}{" "}
                sur {filteredPayments.length} paiements
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
                      Math.ceil(filteredPayments.length / itemsPerPage)
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
                            Math.ceil(filteredPayments.length / itemsPerPage) -
                              1,
                            currentPage + 1
                          )
                        )
                      }
                      className={
                        currentPage >=
                        Math.ceil(filteredPayments.length / itemsPerPage) - 1
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
