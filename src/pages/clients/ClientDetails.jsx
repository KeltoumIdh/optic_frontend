import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import PropTypes from "prop-types";
import dayjs from "dayjs";
import { useAuth } from "@/hooks/useAuth";
import axiosClient from "@/api/axiosClient.jsx";
import Loader from "@/components/loader";
import { renderImageDir } from "@/helpers/utils";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  ArrowLeft,
  User,
  Edit,
  Calendar,
  MapPin,
  Phone,
  ShoppingCart,
  Wallet,
  CheckCircle,
  AlertCircle,
  Eye,
  Plus,
  Search,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

// Badge component
const Badge = ({ children, variant = "default", className = "" }) => {
  const getVariantClass = () => {
    switch (variant) {
      case "success":
        return "bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100";
      case "warning":
        return "bg-amber-100 text-amber-800 dark:bg-amber-800 dark:text-amber-100";
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

Badge.propTypes = {
  children: PropTypes.node.isRequired,
  variant: PropTypes.oneOf([
    "default",
    "success",
    "warning",
    "destructive",
    "outline",
  ]),
  className: PropTypes.string,
};

// Update pagination component
const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  return (
    <div className="flex items-center justify-center mt-4 gap-1">
      <Button
        variant="outline"
        size="icon"
        className="h-8 w-8"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>
      <div className="flex items-center gap-1.5 mx-2">
        <span className="text-sm">
          <span className="font-medium text-gray-900 dark:text-white">
            {currentPage}
          </span>
          <span className="text-gray-600 dark:text-gray-400 mx-1">/</span>
          <span className="text-gray-600 dark:text-gray-400">{totalPages}</span>
        </span>
      </div>
      <Button
        variant="outline"
        size="icon"
        className="h-8 w-8"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  );
};

Pagination.propTypes = {
  currentPage: PropTypes.number.isRequired,
  totalPages: PropTypes.number.isRequired,
  onPageChange: PropTypes.func.isRequired,
};

function ClientDetails() {
  const [client, setClient] = useState();
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [orderSearchDate, setOrderSearchDate] = useState("");
  const [paymentAmount, setPaymentAmount] = useState("");
  const [payments, setPayments] = useState([]);
  const [filteredPayments, setFilteredPayments] = useState([]);
  const [paymentSearchDate, setPaymentSearchDate] = useState("");
  const [paymentDate, setPaymentDate] = useState(dayjs().format("YYYY-MM-DD"));
  const [statistics, setStatistics] = useState({
    totalAmount: 0,
    totalPaid: 0,
    totalRemaining: 0,
  });
  const { id } = useParams();
  const { csrf } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [orderCurrentPage, setOrderCurrentPage] = useState(1);
  const [paymentCurrentPage, setPaymentCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const calculateStatistics = (orders) => {
    const totalAmount = orders.reduce(
      (acc, order) => acc + parseFloat(order.total_price || 0),
      0
    );
    const totalPaid = orders.reduce(
      (acc, order) => acc + parseFloat(order.paid_price || 0),
      0
    );

    // Calculate remaining as the difference between total amount and total paid
    const totalRemaining = Math.max(0, totalAmount - totalPaid);

    return {
      totalAmount,
      totalPaid,
      totalRemaining,
    };
  };

  const getClient = async () => {
    try {
      setLoading(true);
      await csrf();
      const response = await axiosClient.get(`/api/clients/details/${id}`);
      setClient(response.data.client);
      const orderData = response.data.orders || [];
      setOrders(orderData);
      setPayments(response.data.payments || []);
      setStatistics(calculateStatistics(orderData));
    } catch (err) {
      console.log("err", err);
      toast({
        title: "Erreur",
        description: "Impossible de récupérer les détails du client",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAddPayment = async (e) => {
    e.preventDefault();
    if (
      !paymentAmount ||
      isNaN(paymentAmount) ||
      parseFloat(paymentAmount) <= 0
    ) {
      toast({
        title: "Erreur",
        description: "Veuillez entrer un montant valide",
        variant: "destructive",
      });
      return;
    }

    try {
      setSubmitting(true);
      await csrf();
      await axiosClient.post(`/api/clients/payments/${id}`, {
        amount: parseFloat(paymentAmount),
        payment_date: paymentDate,
      });

      // Refresh client data
      await getClient();

      setPaymentAmount("");
      toast({
        title: "Succès",
        description: "Le paiement a été ajouté avec succès",
      });
    } catch (err) {
      console.error(err);
      toast({
        title: "Erreur",
        description: "Impossible d'ajouter le paiement",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  useEffect(() => {
    if (orders.length > 0) {
      const filtered = orders.filter((order) => {
        if (!orderSearchDate) return true;
        return dayjs(order.created_at).format("YYYY-MM-DD") === orderSearchDate;
      });
      setFilteredOrders(filtered);
    }
  }, [orders, orderSearchDate]);

  useEffect(() => {
    if (payments.length > 0) {
      const filtered = payments.filter((payment) => {
        if (!paymentSearchDate) return true;
        return (
          dayjs(payment.payment_date).format("YYYY-MM-DD") === paymentSearchDate
        );
      });
      setFilteredPayments(filtered);
    }
  }, [payments, paymentSearchDate]);

  useEffect(() => {
    getClient();
  }, [id]);

  // Calculate client status based on orders
  const getClientStatus = () => {
    if (!orders || orders.length === 0) {
      return { text: "Nouveau client", variant: "outline" };
    }

    // Check if client has any pending credit
    const hasPendingCredit = orders.some(
      (order) => order.is_credit === 1 && parseFloat(order.remain_price) > 0
    );

    if (hasPendingCredit) {
      return { text: "Crédit en cours", variant: "warning" };
    }

    // Client with completed orders and no pending credit
    return { text: "Client régulier", variant: "success" };
  };

  const clientStatus = getClientStatus();

  // Get paginated data
  const getPaginatedData = (items, currentPage) => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return items.slice(startIndex, endIndex);
  };

  // Get total pages
  const getTotalPages = (items) => {
    return Math.ceil(items.length / itemsPerPage);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader />
      </div>
    );
  }

  return (
    <div className="mx-auto px-2 py-4 md:px-4 md:py-6">
      <Card className="shadow-md border border-gray-200 dark:border-gray-700">
        <CardHeader className="pb-4 border-b dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Link
                to="/clients"
                className="mr-3 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                <ArrowLeft className="h-5 w-5" />
              </Link>
              <div>
                <div className="flex items-center">
                  <User className="h-6 w-6 mr-2 text-primary" />
                  <CardTitle className="text-xl md:text-2xl font-bold">
                    {client?.name} {client?.lname}
                  </CardTitle>
                </div>
                <CardDescription className="mt-1 text-gray-500 dark:text-gray-400 flex items-center">
                  <Phone className="h-4 w-4 mr-1" />
                  {client?.phone}
                </CardDescription>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Link to={`/clients/edit/${client?.id}`}>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-1"
                >
                  <Edit className="h-4 w-4" />
                  <span className="hidden sm:inline">Modifier</span>
                </Button>
              </Link>
            </div>
          </div>
        </CardHeader>

        <CardContent className="pt-6">
          {/* Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <Card className="bg-white dark:bg-gray-800 shadow-sm">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      Total des commandes
                    </p>
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                      {statistics.totalAmount.toFixed(2)} DH
                    </h3>
                  </div>
                  <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-full">
                    <Wallet className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white dark:bg-gray-800 shadow-sm">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      Total payé
                    </p>
                    <h3 className="text-2xl font-bold text-green-600 dark:text-green-400">
                      {statistics.totalPaid.toFixed(2)} DH
                    </h3>
                  </div>
                  <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-full">
                    <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white dark:bg-gray-800 shadow-sm">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      Total restant
                    </p>
                    <h3 className="text-2xl font-bold text-red-600 dark:text-red-400">
                      {statistics.totalRemaining.toFixed(2)} DH
                    </h3>
                  </div>
                  <div className="p-3 bg-red-100 dark:bg-red-900/30 rounded-full">
                    <AlertCircle className="h-6 w-6 text-red-600 dark:text-red-400" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Add Payment Section */}
          <div className="mb-8">
            <Card className="bg-white dark:bg-gray-800 shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg">Ajouter un paiement</CardTitle>
                <CardDescription>
                  Entrez le montant payé par le client
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form
                  onSubmit={handleAddPayment}
                  className="flex items-end gap-4"
                >
                  <div className="flex-1">
                    <label
                      htmlFor="paymentAmount"
                      className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 block"
                    >
                      Montant (DH)
                    </label>
                    <Input
                      id="paymentAmount"
                      type="number"
                      step="0.01"
                      min="0"
                      value={paymentAmount}
                      onChange={(e) => setPaymentAmount(e.target.value)}
                      placeholder="Entrez le montant..."
                      className="max-w-xs"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="paymentDate"
                      className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 block"
                    >
                      Date de paiement
                    </label>
                    <Input
                      id="paymentDate"
                      type="date"
                      value={paymentDate}
                      onChange={(e) => setPaymentDate(e.target.value)}
                      className="max-w-xs"
                    />
                  </div>
                  <Button
                    type="submit"
                    disabled={submitting}
                    className="flex items-center gap-2"
                  >
                    <Plus className="h-4 w-4" />
                    {submitting ? "Ajout en cours..." : "Ajouter le paiement"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-1 flex flex-col">
              <div className="bg-gray-50  /50 rounded-lg p-4 flex items-center justify-center h-[250px] border border-gray-200 dark:border-gray-700">
                {client?.image ? (
                  <img
                    src={renderImageDir(client.image, "client")}
                    alt={client?.name}
                    className="max-h-full max-w-full object-contain rounded-md"
                  />
                ) : (
                  <div className="flex flex-col items-center text-center p-4">
                    <div className="p-4 bg-gray-100 dark:bg-gray-700 rounded-full mb-3">
                      <User className="h-10 w-10 text-gray-400" />
                    </div>
                    <p className="text-gray-500 dark:text-gray-400">
                      Aucune image disponible
                    </p>
                  </div>
                )}
              </div>

              <div className="mt-6 bg-gray-50  /50 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                <h3 className="font-medium text-gray-900 dark:text-gray-100 mb-3 flex items-center">
                  <Calendar className="h-4 w-4 mr-2" />
                  Information
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between items-center py-1 border-b border-gray-200 dark:border-gray-700">
                    <span className="text-gray-600 dark:text-gray-400">
                      Date d'ajout
                    </span>
                    <span className="font-medium">
                      {dayjs(client?.created_at).format("DD/MM/YYYY")}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-1 border-b border-gray-200 dark:border-gray-700">
                    <span className="text-gray-600 dark:text-gray-400">
                      Dernière mise à jour
                    </span>
                    <span className="font-medium">
                      {dayjs(client?.updated_at).format("DD/MM/YYYY")}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-1 border-b border-gray-200 dark:border-gray-700">
                    <span className="text-gray-600 dark:text-gray-400">
                      Status
                    </span>
                    <Badge variant={clientStatus.variant}>
                      {clientStatus.text}
                    </Badge>
                  </div>
                </div>
              </div>
            </div>

            <div className="md:col-span-2">
              <div className="bg-gray-50  /50 rounded-lg p-4 mb-6 border border-gray-200 dark:border-gray-700">
                <h3 className="font-medium text-gray-900 dark:text-gray-100 mb-3">
                  Coordonnées du client
                </h3>
                <div className="space-y-4">
                  <div className="flex items-start">
                    <div className="p-2 bg-blue-100 dark:bg-blue-800/30 rounded-full mr-3">
                      <User className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                        Nom complet
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {client?.name} {client?.lname}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="p-2 bg-green-100 dark:bg-green-800/30 rounded-full mr-3">
                      <Phone className="h-5 w-5 text-green-600 dark:text-green-400" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                        Téléphone
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {client?.phone}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="p-2 bg-purple-100 dark:bg-purple-800/30 rounded-full mr-3">
                      <MapPin className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                        Adresse
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {client?.address}, {client?.city}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {orders && orders.length > 0 ? (
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200 dark:border-gray-700 overflow-hidden">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-medium text-gray-900 dark:text-gray-100">
                      Commandes du client
                    </h3>
                    <Badge variant="default" className="text-xs">
                      {filteredOrders.length} commande(s)
                    </Badge>
                  </div>
                  <div className="mb-4 flex gap-4 items-end">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Rechercher par date
                      </label>
                      <div className="flex gap-2">
                        <Input
                          type="date"
                          value={orderSearchDate}
                          onChange={(e) => setOrderSearchDate(e.target.value)}
                          className="w-40"
                        />
                        <Button
                          variant="outline"
                          onClick={() => setOrderSearchDate("")}
                          className="flex items-center gap-2"
                        >
                          <Search className="h-4 w-4" />
                          Réinitialiser
                        </Button>
                      </div>
                    </div>
                  </div>
                  <div className="overflow-x-auto -mx-4">
                    <table className="min-w-full text-sm text-left text-gray-500 dark:text-gray-400">
                      <thead className="text-xs text-gray-700 uppercase bg-gray-100 dark:bg-gray-700 dark:text-gray-400">
                        <tr>
                          <th
                            scope="col"
                            className="px-6 py-4 whitespace-nowrap"
                          >
                            #
                          </th>
                          <th
                            scope="col"
                            className="px-6 py-4 whitespace-nowrap"
                          >
                            Date
                          </th>
                          <th
                            scope="col"
                            className="px-6 py-4 whitespace-nowrap"
                          >
                            Prix
                          </th>
                          <th
                            scope="col"
                            className="px-6 py-4 whitespace-nowrap"
                          >
                            Méthode de paiement
                          </th>
                          <th
                            scope="col"
                            className="px-6 py-4 whitespace-nowrap"
                          >
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {getPaginatedData(filteredOrders, orderCurrentPage).map(
                          (order) => (
                            <tr
                              key={order.id}
                              className="bg-white border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50"
                            >
                              <td className="px-6 py-4 font-medium text-gray-900 dark:text-white whitespace-nowrap">
                                {order.id}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                {dayjs(order.created_at).format("DD/MM/YYYY")}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                {order.total_price} DH
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                {order.payment_method}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <Link
                                  to={`/orders/details/${order.id}`}
                                  className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 inline-flex items-center gap-1"
                                >
                                  <Eye className="h-4 w-4" />
                                  <span className="sr-only">
                                    Voir les détails
                                  </span>
                                </Link>
                              </td>
                            </tr>
                          )
                        )}
                      </tbody>
                    </table>
                  </div>
                  {filteredOrders.length > itemsPerPage && (
                    <Pagination
                      currentPage={orderCurrentPage}
                      totalPages={getTotalPages(filteredOrders)}
                      onPageChange={setOrderCurrentPage}
                    />
                  )}
                </div>
              ) : (
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200 dark:border-gray-700 text-center">
                  <ShoppingCart className="h-10 w-10 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-600 dark:text-gray-400">
                    Aucune commande pour ce client
                  </p>
                </div>
              )}
              <div className="mt-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium">
                    Historique des paiements
                  </h3>
                  <Badge variant="secondary" className="text-xs">
                    {filteredPayments.length} paiement(s)
                  </Badge>
                </div>
                {payments.length > 0 ? (
                  <>
                    <div className="mb-4 flex gap-4 items-end">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Rechercher par date
                        </label>
                        <div className="flex gap-2">
                          <Input
                            type="date"
                            value={paymentSearchDate}
                            onChange={(e) =>
                              setPaymentSearchDate(e.target.value)
                            }
                            className="w-40"
                          />
                          <Button
                            variant="outline"
                            onClick={() => setPaymentSearchDate("")}
                            className="flex items-center gap-2"
                          >
                            <Search className="h-4 w-4" />
                            Réinitialiser
                          </Button>
                        </div>
                      </div>
                    </div>
                    <div className="overflow-hidden rounded-lg border border-gray-200 dark:border-gray-700">
                      <table className="w-full text-sm">
                        <thead className="bg-gray-50 dark:bg-gray-800">
                          <tr>
                            <th
                              scope="col"
                              className="px-6 py-4 text-left font-medium text-gray-500 dark:text-gray-400"
                            >
                              DATE
                            </th>
                            <th
                              scope="col"
                              className="px-6 py-4 text-left font-medium text-gray-500 dark:text-gray-400"
                            >
                              MONTANT
                            </th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                          {getPaginatedData(
                            filteredPayments,
                            paymentCurrentPage
                          ).map((payment) => (
                            <tr
                              key={payment.id}
                              className="bg-white dark:bg-gray-900"
                            >
                              <td className="px-6 py-4 text-gray-600 dark:text-gray-300">
                                {dayjs(payment.payment_date).format(
                                  "DD/MM/YYYY"
                                )}
                              </td>
                              <td className="px-6 py-4 text-green-600 dark:text-green-400">
                                {payment.amount} DH
                              </td>
                            </tr>
                          ))}
                          <tr className="bg-gray-50 dark:bg-gray-800 font-medium">
                            <td className="px-6 py-4 text-gray-900 dark:text-white">
                              Total
                            </td>
                            <td className="px-6 py-4 text-gray-900 dark:text-white">
                              {filteredPayments
                                .reduce(
                                  (sum, payment) =>
                                    sum + parseFloat(payment.amount),
                                  0
                                )
                                .toFixed(2)}{" "}
                              DH
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                    {filteredPayments.length > itemsPerPage && (
                      <Pagination
                        currentPage={paymentCurrentPage}
                        totalPages={getTotalPages(filteredPayments)}
                        onPageChange={setPaymentCurrentPage}
                      />
                    )}
                  </>
                ) : (
                  <div className="text-center py-4 text-gray-500 dark:text-gray-400">
                    Aucun paiement enregistré
                  </div>
                )}
              </div>
            </div>
          </div>
        </CardContent>

        <CardFooter className="flex justify-end border-t dark:border-gray-700 pt-4">
          <Link to="/clients">
            <Button variant="outline" className="mr-2">
              Retour à la liste
            </Button>
          </Link>
          <Link to={`/clients/edit/${client?.id}`}>
            <Button className="bg-primary hover:bg-primary/90">
              Modifier le client
            </Button>
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}

export default ClientDetails;
