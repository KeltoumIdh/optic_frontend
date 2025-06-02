import * as React from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Link } from "react-router-dom";
import {
  CreditCard,
  Clock,
  AlertCircle,
  CheckCircle,
  Wallet,
  Users,
  DollarSign,
  TrendingDown,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "../../components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import axiosClient from "@/api/axiosClient.jsx";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import dayjs from "dayjs";

export function ListCard() {
  const { csrf } = useAuth();
  const [clients, setClients] = React.useState([]);
  const [statistics, setStatistics] = React.useState(null);
  const [isLoading, setisLoading] = React.useState(false);

  const fetchData = async () => {
    try {
      setisLoading(true);
      await csrf();

      // Fetch clients and statistics in parallel
      const [clientsResponse, statsResponse] = await Promise.all([
        axiosClient.get("/api/credit/clients"),
        axiosClient.get("/api/credit/statistics"),
      ]);

      if (clientsResponse.status === 200) {
        setClients(clientsResponse.data);
      }

      if (statsResponse.status === 200) {
        setStatistics(statsResponse.data);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setisLoading(false);
    }
  };

  React.useEffect(() => {
    fetchData();
  }, []);

  const getStatusInfo = (creditStatus) => {
    switch (creditStatus) {
      case "overdue":
        return {
          icon: <AlertCircle className="h-3.5 w-3.5 mr-1" />,
          colorClass: "bg-rose-100 text-rose-800 border-rose-300",
          text: "En retard",
        };
      case "due_soon":
        return {
          icon: <Clock className="h-3.5 w-3.5 mr-1" />,
          colorClass: "bg-amber-100 text-amber-800 border-amber-300",
          text: "Bientôt dû",
        };
      case "on_time":
        return {
          icon: <CheckCircle className="h-3.5 w-3.5 mr-1" />,
          colorClass: "bg-emerald-100 text-emerald-800 border-emerald-300",
          text: "À temps",
        };
      case "no_due_date":
      default:
        return {
          icon: <CreditCard className="h-3.5 w-3.5 mr-1" />,
          colorClass: "bg-gray-100 text-gray-800 border-gray-300",
          text: "Sans échéance",
        };
    }
  };

  const [confirmationInProgress, setConfirmationInProgress] =
    React.useState(false);

  const sendConfirmationRequest = async (id) => {
    try {
      setConfirmationInProgress(true);
      await csrf();
      const response = await axiosClient.put("/api/confirmOrder", {
        order_id: id,
      });
      if (response.status === 200) {
        fetchData();
      } else {
        throw new Error("Failed to confirm order");
      }
    } catch (error) {
      console.error("Error confirming order:", error);
    } finally {
      setConfirmationInProgress(false);
    }
  };

  return (
    <Card className="border shadow-none h-full">
      <CardHeader className="pb-2 p-3 md:p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <CreditCard className="h-4 w-4 md:h-5 md:w-5 text-blue-500 mr-2" />
            <h3 className="text-base md:text-lg font-medium">Clients crédit</h3>
          </div>
          {statistics && (
            <div className="text-sm text-gray-500">
              Total clients: {statistics.total_clients}
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {/* Statistics Cards */}
        {statistics && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-white rounded-lg border p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    Total crédit
                  </p>
                  <p className="text-xl font-bold text-gray-900">
                    {parseFloat(statistics.total_credit).toFixed(2)} DH
                  </p>
                </div>
                <div className="p-3 bg-blue-50 rounded-full">
                  <DollarSign className="h-6 w-6 text-blue-500" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg border p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    Total payé
                  </p>
                  <p className="text-xl font-bold text-green-600">
                    {parseFloat(statistics.total_paid).toFixed(2)} DH
                  </p>
                </div>
                <div className="p-3 bg-green-50 rounded-full">
                  <CheckCircle className="h-6 w-6 text-green-500" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg border p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    Total restant
                  </p>
                  <p className="text-xl font-bold text-rose-600">
                    {parseFloat(statistics.total_remaining).toFixed(2)} DH
                  </p>
                </div>
                <div className="p-3 bg-rose-50 rounded-full">
                  <TrendingDown className="h-6 w-6 text-rose-500" />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Clients Table */}
        {isLoading ? (
          <div className="h-64 w-full rounded-md animate-pulse bg-gray-100"></div>
        ) : (
          <ScrollArea className="h-[260px] md:h-[320px] w-full rounded-md">
            <div className="px-2 md:px-4">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="py-2 md:py-3 px-1 md:px-2 text-left text-xs md:text-sm font-medium text-gray-500">
                        Client
                      </th>

                      <th className="py-2 md:py-3 px-1 md:px-2 text-left text-xs md:text-sm font-medium text-gray-500">
                        Crédit total
                      </th>
                      <th className="py-2 md:py-3 px-1 md:px-2 text-left text-xs md:text-sm font-medium text-gray-500">
                        Reste à payer
                      </th>
                      <th className="py-2 md:py-3 px-1 md:px-2 text-left text-xs md:text-sm font-medium text-gray-500">
                        Status
                      </th>
                      <th className="py-2 md:py-3 px-1 md:px-2 text-left text-xs md:text-sm font-medium text-gray-500">
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {clients.map((client) => {
                      const statusInfo = getStatusInfo(client.credit_status);
                      return (
                        <tr
                          key={client.id}
                          className="border-b border-gray-100 hover:bg-gray-50/50"
                        >
                          <td className="py-2 md:py-3 px-1 md:px-2 whitespace-nowrap">
                            <div className="flex items-center">
                              <span className="font-medium text-gray-900">
                                {client.name} {client.lname}
                              </span>
                            </div>
                          </td>

                          <td className="py-2 md:py-3 px-1 md:px-2 whitespace-nowrap">
                            <span className="font-medium text-gray-900">
                              {parseFloat(client.total_credit).toFixed(2)} DH
                            </span>
                          </td>
                          <td className="py-2 md:py-3 px-1 md:px-2 whitespace-nowrap">
                            <span className="font-medium text-rose-600">
                              {parseFloat(client.total_remaining).toFixed(2)} DH
                            </span>
                          </td>
                          <td className="py-2 md:py-3 px-1 md:px-2 whitespace-nowrap">
                            <div
                              className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${statusInfo.colorClass}`}
                            >
                              {statusInfo.icon}
                              {statusInfo.text}
                              {client.days_remaining !== null && (
                                <span className="ml-1">
                                  ({Math.abs(client.days_remaining)}j)
                                </span>
                              )}
                            </div>
                          </td>
                          <td className="py-2 md:py-3 px-1 md:px-2 whitespace-nowrap">
                            <Link
                              to={`/clients/details/${client.id}`}
                              className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 inline-flex items-center gap-1"
                            >
                              <Wallet className="h-4 w-4" />
                              <span className="sr-only">Voir les détails</span>
                            </Link>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  );
}
