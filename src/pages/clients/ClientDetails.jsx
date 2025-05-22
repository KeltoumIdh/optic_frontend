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
import {
  ArrowLeft,
  User,
  Edit,
  Calendar,
  MapPin,
  Phone,
  CreditCard,
  ShoppingCart,
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

function ClientDetails() {
  const [client, setClient] = useState();
  const [orders, setOrders] = useState([]);
  const { id } = useParams();
  const { csrf } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const getClient = async () => {
    try {
      setLoading(true);
      await csrf();
      const response = await axiosClient.get(`/api/clients/details/${id}`);
      setClient(response.data.client);
      setOrders(response.data.orders || []);
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
                <div className="bg-gray-50  /50 rounded-lg p-4 border border-gray-200 dark:border-gray-700 overflow-hidden">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-medium text-gray-900 dark:text-gray-100">
                      Commandes du client
                    </h3>
                    <Badge variant="default" className="text-xs">
                      {orders.length} commande(s)
                    </Badge>
                  </div>
                  <div className="overflow-x-auto -mx-4">
                    <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                      <thead className="text-xs text-gray-700 uppercase bg-gray-100 dark:bg-gray-700 dark:text-gray-400">
                        <tr>
                          <th
                            scope="col"
                            className="px-4 py-3 whitespace-nowrap"
                          >
                            #
                          </th>
                          <th
                            scope="col"
                            className="px-4 py-3 whitespace-nowrap"
                          >
                            Prix
                          </th>
                          <th
                            scope="col"
                            className="px-4 py-3 whitespace-nowrap"
                          >
                            Méthode de paiement
                          </th>
                          <th
                            scope="col"
                            className="px-4 py-3 whitespace-nowrap"
                          >
                            Crédit
                          </th>
                          <th
                            scope="col"
                            className="px-4 py-3 whitespace-nowrap"
                          >
                            Prix payé
                          </th>
                          <th
                            scope="col"
                            className="px-4 py-3 whitespace-nowrap"
                          >
                            Prix restant
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {orders.map((order) => (
                          <tr
                            key={order.id}
                            className="bg-white   border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50"
                          >
                            <td className="px-4 py-3 font-medium text-gray-900 dark:text-white whitespace-nowrap">
                              {order.id}
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap">
                              {order.total_price} DH
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap">
                              {order.payment_method}
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap">
                              <Badge
                                variant={
                                  order.is_credit === 1
                                    ? "destructive"
                                    : "success"
                                }
                                className="text-xs"
                              >
                                {order.is_credit === 1 ? "Oui" : "Non"}
                              </Badge>
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap">
                              {order.paid_price} DH
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap">
                              {order.remain_price} DH
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ) : (
                <div className="bg-gray-50  /50 rounded-lg p-4 border border-gray-200 dark:border-gray-700 text-center">
                  <ShoppingCart className="h-10 w-10 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-600 dark:text-gray-400">
                    Aucune commande pour ce client
                  </p>
                </div>
              )}
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
